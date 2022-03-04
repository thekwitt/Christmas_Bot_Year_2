const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars
function duplicates(arr, id) {
	let count = 0;
	for(let i = 0; i < arr.length; i++)
	{
		if (arr[i] === id) count++;
	}
	return count;
}

function pagePrinter(presents, dups, page)	{
	let string = '';
	const rarity = ['Common', 'Lucky', 'Glitched'];
	for(let x = 0; x < presents.length; x++) {
		if(String(presents[x].id).charAt(1) == String(page + 1))
		{
			if(String(presents[x].id).charAt(0) == '1') string += '• **Collected ' + rarity[page] + '** ' + presents[x].name.replace('Lucky', '').replace('Glitched', '') + ' x **\t' + dups[x] + '** | ID: __' + presents[x].id + '__\n';
			else if(String(presents[x].id).charAt(0) == '2') string += '• **Gifted ' + rarity[page] + '** ' + presents[x].name.replace('Lucky', '').replace('Glitched', '') + ' x **\t' + dups[x] + '** | ID: __' + presents[x].id + '__\n';
		}
	}
	return string;
}

module.exports = {
	name: 'sack',
	description: 'Check out your presents!',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('sack')
		.setDescription('Check out your presents!')
		.addUserOption(option => option.setName('target').setDescription('The sack of that user.')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		let user = interaction.user;
		const target = interaction.options.getUser('target');
		if (target && !target.bot)
		{
			user = target;
			await client.pool.query('INSERT INTO guild_data (Member_ID, Guild_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [target.id, interaction.guildId]);
		}
		else if (target && target.bot) {
			try{return await interaction.reply({ content: target.username + ' is a bot. It doesn\'t need presents since the greatest gift is you using the bot!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
			catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Reply Denied - ' + String(err));}
		}
		const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, user.id]);
		const user_bag = raw.rows[0].presents;
		const length = user_bag.length;
		try{if(user_bag.length == 0) return await interaction.reply({ content: 'This user has no presents!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'Empty Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Reply Denied - ' + String(err));}

		const data = [...new Set(user_bag)].sort();
		let page = 0;
		const sRarity = ['Common', 'Lucky', 'Glitched'];
		const rarity = ['Regular', 'Lucky', 'Glitched'];
		const presents = [];
		for(let i = 0; i < data.length; i++)
		{
			presents.push(client.presents.filter(present => present.id == data[i])[0]);
		}

		// eslint-disable-next-line prefer-const
		let counts = [];
		for(let i = 0; i < presents.length; i++)
		{
			counts.push(duplicates(user_bag, presents[i].id));
		}

		const max_page = 2;

		let page_printed = pagePrinter(presents, counts, page);

		if (page_printed == '') page_printed = 'No **' + rarity[page] + '** presents in this sack!';

		let embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('🎁  ' + user.username + '\'s Present Sack  🎁')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nTotal Presents: `' + length + '` | ' + sRarity[page] + ' Presents: `' + user_bag.filter(present => String(present).charAt(1) == page + 1).length + '`\n\n' + page_printed + '\n⠀⠀')
			.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('Left')
					.setLabel('⬅️')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('Right')
					.setLabel('➡️')
					.setStyle('PRIMARY'),
			);

		try{await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'Duplicate Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Reply Denied - ' + String(err));}
		let reply = undefined;
		try{ reply = await interaction.fetchReply().then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'Fetch Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Fetch Reply Denied')); }
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Fetch Reply Denied - ' + String(err));}
		if(reply == undefined) return ;
		const filter = f => {
			return f.user.id == interaction.user.id && f.message.id == reply.id;
		};
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
		collector.on('collect', async f => {
			if(f.customId === 'Left') {
				if(page != 0) {
					page--;
					page_printed = pagePrinter(presents, counts, page);

					if (page_printed == '') page_printed = 'No **' + rarity[page] + '** presents in this sack!';

					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🎁  ' + user.username + '\'s Present Sack  🎁')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nTotal Presents: `' + length + '` | ' + sRarity[page] + ' Presents: `' + user_bag.filter(present => String(present).charAt(1) == page + 1).length + '`\n\n' + page_printed + '\n⠀⠀')
						.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Update Edit Denied');}

				} else {
					try{await f.reply({ content: 'You are already on the first page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'First Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Reply Denied'); }
				}

			} else if(f.customId === 'Right') {
				if(page != max_page) {
					page++;
					page_printed = pagePrinter(presents, counts, page);

					if (page_printed == '') page_printed = 'No **' + rarity[page] + '** presents in this sack!';

					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🎁  ' + user.username + '\'s Present Sack  🎁')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nTotal Presents: `' + length + '` | ' + sRarity[page] + ' Presents: `' + user_bag.filter(present => String(present).charAt(1) == page + 1).length + '`\n\n' + page_printed + '\n⠀⠀')
						.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Update Edit Denied');}
				} else {
					try{await f.reply({ content: 'You are already on the last page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'Last Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Reply Denied'); }
				}
			}
		});
		collector.on('end', async () => {
			const finished_row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('Left')
						.setLabel('⬅️')
						.setStyle('PRIMARY')
						.setDisabled(true),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('Right')
						.setLabel('➡️')
						.setStyle('PRIMARY')
						.setDisabled(true),
				);
			try{await reply.edit({ embed: embed, components: [finished_row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Sack Command', 'End Bag Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Edit Denied');}
		});
	},
};