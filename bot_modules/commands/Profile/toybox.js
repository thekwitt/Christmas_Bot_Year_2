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

function detectRarity(string) {
	const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Lucky', 'Glitched', 'Dull'].reverse();
	for(let x = 0; x < rarities.length; x++) {
		if(string.includes(rarities[x])) return x;
	}
}

function writeOutPages(toys, dups) {
	const tiers = [[], [], [], [], [], [], []];
	// Seperate Lines into Tiers
	for(let x = 1; x < 8; x++) {
		for(let y = 0; y < toys.length; y++) {
			if(String(toys[y].id).charAt(0) == String(x)) {
				tiers[x - 1].push('• ** ' + toys[y].rarity + '** ' + toys[y].name + ' x ' + dups[y] + '\n');
			}
		}
	}

	// Put them into pages
	const strings = [];
	let string = '';
	for(let x = 0; x < tiers[6].length; x++) {
		if(x % 10 == 0 && x != 0) {
			strings.push(string);
			string = '';
		}
		else {
			string += tiers[6][x];
		}
	}
	if(string != '') {
		strings.push(string);
	}

	for(let y = 0; y < 6; y++) {
		string = '';
		for(let x = 0; x < tiers[y].length; x++) {
			if(x % 10 == 0 && x != 0) {
				strings.push(string);
				string = '';
			}
			else {
				string += tiers[y][x];
			}
		}
		if(string != '') {
			strings.push(string);
		}
	}
	return strings;
}

module.exports = {
	name: 'toybox',
	description: 'Check out your toys!',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('toybox')
		.setDescription('Check out your toys!')
		.addUserOption(option => option.setName('target').setDescription('The bag of that user.')),
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
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Sack Command', 'Reply Denied');}
		}
		const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, user.id]);
		const user_bag = raw.rows[0].toys;
		const length = user_bag.length;
		try{if(user_bag.length == 0) return await interaction.reply({ content: 'This user has no toys!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Empty Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Reply Denied');}
		const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Lucky', 'Glitched', 'Dull'].reverse();
		const data = [...new Set(user_bag)].sort();
		let page = 0;

		const toys = [];
		for(let i = 0; i < data.length; i++)
		{
			toys.push(client.toys.filter(toy => toy.id == data[i])[0]);
		}

		const counts = [];
		for(let i = 0; i < toys.length; i++)
		{
			counts.push(duplicates(user_bag, toys[i].id));
		}

		const string_array = writeOutPages(toys, counts);

		const max_page = string_array.length - 1;

		let embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('🧸  ' + user.username + '\'s Toy Box  🧸')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nTotal Toys: `' + length + '` | ' + rarities[detectRarity(string_array[page])] + ' Toys: `' + user_bag.filter(present => String(present).charAt(0) == 7 - detectRarity(string_array[page])).length + '`\n\n' + string_array[page] + '\n⠀⠀')
			.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('BigLeft')
					.setLabel('⏪')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('Left')
					.setLabel('◀️')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('Right')
					.setLabel('▶️')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('BigRight')
					.setLabel('⏩')
					.setStyle('PRIMARY'),
			);

		try{await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Duplicate Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Reply Denied');}
		let reply = undefined;
		try{ reply = await interaction.fetchReply().then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Fetch Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Fetch Reply Denied')); }
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Fetch Reply Denied');}
		if(reply == undefined) return ;
		const filter = f => {
			return f.user.id == interaction.user.id && f.message.id == reply.id;
		};
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
		collector.on('collect', async f => {
			if(f.customId === 'BigLeft') {				
				if(page != 0) {
					if(page - 5 <= 0) page = 0;
					else page -= 5;
					
					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🧸  ' + user.username + '\'s Toy Box  🧸')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nTotal Toys: `' + length + '` | ' + rarities[detectRarity(string_array[page])] + ' Toys: `' + user_bag.filter(present => String(present).charAt(0) == 7 - detectRarity(string_array[page])).length + '`\n\n' + string_array[page] + '\n⠀⠀')
						.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Update Edit Denied');}

				} else {
					try{await f.reply({ content: 'You are already on the first page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'First Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Reply Denied'); }
				}
			} else if(f.customId === 'Left') {
				if(page != 0) {
					page--;
					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🧸  ' + user.username + '\'s Toy Box  🧸')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nTotal Toys: `' + length + '` | ' + rarities[detectRarity(string_array[page])] + ' Toys: `' + user_bag.filter(present => String(present).charAt(0) == 7 - detectRarity(string_array[page])).length + '`\n\n' + string_array[page] + '\n⠀⠀')
						.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Update Edit Denied');}

				} else {
					try{await f.reply({ content: 'You are already on the first page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'First Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Reply Denied'); }
				}

			} else if(f.customId === 'Right') {
				if(page != max_page) {
					page++;
					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🧸  ' + user.username + '\'s Toy Box  🧸')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nTotal Toys: `' + length + '` | ' + rarities[detectRarity(string_array[page])] + ' Toys: `' + user_bag.filter(present => String(present).charAt(0) == 7 - detectRarity(string_array[page])).length + '`\n\n' + string_array[page] + '\n⠀⠀')
						.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Update Edit Denied');}
				} else {
					try{await f.reply({ content: 'You are already on the last page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Last Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Reply Denied'); }
				}
			} else if(f.customId === 'BigRight') {
				if(page != max_page) {
					if(page + 5 >= max_page) page = max_page;
					else page += 5;
					
					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🧸  ' + user.username + '\'s Toy Box  🧸')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nTotal Toys: `' + length + '` | ' + rarities[detectRarity(string_array[page])] + ' Toys: `' + user_bag.filter(present => String(present).charAt(0) == 7 - detectRarity(string_array[page])).length + '`\n\n' + string_array[page] + '\n⠀⠀')
						.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Update Edit Denied');}
				} else {
					try{await f.reply({ content: 'You are already on the last page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'Last Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Reply Denied'); }
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
			try{await reply.edit({ embed: embed, components: [finished_row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Toybox Command', 'End Bag Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Toybox Command', 'Edit Denied');}
		});
	},
};