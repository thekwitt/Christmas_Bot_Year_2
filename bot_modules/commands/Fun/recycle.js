const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'recycle',
	description: 'Give a piece of coal to the coalsmith!',
	cooldown: 43200,
	data: new SlashCommandBuilder()
		.setName('recycle')
		.setDescription('Give a piece of coal to the coalsmith!'),
	async execute(interaction, client) {
		if((Date.now() / 1000) > 1640401200) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'Looks like the coalsmith is on vacation for the celebration! You can\'t recycle anymore coal!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Recycle Command', 'Past Chjristmas Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Command', 'Reply Denied');}
		}

		const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
		const user_bag = raw.rows[0].toys;

		const v = await client.votes.query('SELECT * FROM christmas WHERE User_ID = $1', [interaction.user.id]);
		const voter = v.rows[0];
		
		if(voter == undefined) {
			const hasVoted = await client.topapi.hasVoted(interaction.user.id);
			if(hasVoted == false) {
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel('Vote Here')
							.setStyle('LINK')
							.setURL('https://top.gg/bot/771198190447230986/vote'),
					);

				const embed = new MessageEmbed()
					.setColor(client.colors[0][0])
					.setTitle('🔗   You need to vote first!   🔗')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nYou need to vote first before you recycle coal! Vote by pressing the button below.\n⠀')
					.setFooter('For any questions/concerns please visit the official TheKWitt server! https://discord.gg/BYVD4AGmYR');
				interaction.reset_cooldown = true;
				try{return await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Invite Command', 'Bot Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Invite Command', 'Reply Denied');}
			} else {
				await client.votes.query('INSERT INTO christmas(user_id, timestamp) VALUES ($1, $2);' ,[interaction.user.id, Math.floor(Date.now()/1000) + 43200]);
			}
		}

		if(user_bag.length == 0) {
			// eslint-disable-next-line no-unused-vars
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'You don\'t have any coal! Noice!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Recycle Command', 'No Present Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Recycle Command', 'Reply Denied');}
		}

		const data = [...new Set(user_bag)].sort();

		const coals = [7003, 7002, 7001];
		const coal_names = ['Glitched Coal', 'Lucky Coal', 'Regular Coal'];

		if(data.some(d => coals.includes(d))) {
			let coal = undefined;

			for (let x = 0; x < coals.length; x++)
			{
				if(data.includes(coals[x])) {
					coal = x;
					break;
				}
			}
			user_bag.splice(user_bag.indexOf(coals[coal]), 1);
			await client.pool.query('UPDATE guild_data SET toys = $1 WHERE Member_ID = $2 AND Guild_ID = $3', [user_bag, interaction.user.id, interaction.guildId]);

			const embed = new MessageEmbed()
				.setColor(client.colors[0][2])
				.setTitle(interaction.user.username + ' recycled coal!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\nThe Coalsmith accepted the ' + coal_names[coal] + ' as a recyclable gift! How kind!\n⠀')
				.setFooter(interaction.user.username + ' cannot recycle again for 12 hours!');

			try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Recycle Command', 'Gave ID Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Recycle Command', 'Reply Denied'); }
		} else {
			interaction.reset_cooldown = true;
			try {return await interaction.reply({ content: 'You don\'t have any regular coal! Remember that lucky coal and glitched coal **cannot** be thrown. Please use /toybox to see what coal you have.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Recycle Command', 'Wrong present ID Warning Reply')); }
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Recycle Command', 'Reply Denied');}
		}
	},
};