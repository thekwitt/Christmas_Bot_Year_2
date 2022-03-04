const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
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

module.exports = {
	name: 'leaderboard',
	description: 'See the server leaderboard',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('See the server leaderboard'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const raw_data = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1;', [interaction.guildId]);
		let data = raw_data.rows;

		data = client.extra.playOrganizer(data);

		let user_empty = true;
		let page = 0;
		let user_index = 0;

		// Eliminate Empty Users
		for(let i = data.length - 1; i > -1; i--)
		{
			try {
				if(data[i][0] == interaction.user.id) {
					user_empty = false;
				}
			} catch {
				break;
			}
		}

		for(user_index; user_index < data.length; user_index++)
		{
			if(interaction.user.id == data[user_index][0]) break;
		}

		// Reduce size if over 100
		if(data.length > 100)
		{
			data = data.slice(0, 100);
		}

		const max_page = parseInt((data.length - 1) / 10) ;

		// Get User Index

		let userFound = false;
		let string = '```css\n[Rank] | {.Points.} | Winterfester\n==========================================\n';
		let list = interaction.guild.members.cache;
		if (interaction.guild.memberCount > list.size)
		{
			try{list = await interaction.guild.members.fetch().then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', 'Member Fetch'));}
			catch {client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Fetch Denied');}
		}
		// eslint-disable-next-line max-statements-per-line
		if(list == undefined) try{return await interaction.reply({ content: 'Looks like this server doesn\'t let the bot get a list of all the users! Let a mod know incase its turned off!', ephemeral: true });} catch {client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Reply Denied');}
		if(data.length == 0)
		{
			const embed = new MessageEmbed()
				.setColor('#0xFE8000')
				.setTitle(interaction.user.username + '\'s Empty Leaderboard')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('No one has presents or toys! Go get some!')
				.setFooter('/help for more info');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', 'Empty LB Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Reply Denied');}
		}
		else {
			for(let i = page * 10; i < 10 + (10 * page); i++) {
				// eslint-disable-next-line max-statements-per-line
				if (data[i] == undefined) break;

				const raw_user = data[i][0];
				const pre_user = list.get(raw_user.toString());
				if (!pre_user) { client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Get Member From List | ' + raw_user.toString() + ' | Denied Start '); }
				else {
					const user = pre_user.user;

					if(data[i][0] == interaction.user.id) {
						userFound = true;
					}

					string += ' ' + '[' + (i + 1).toString().padStart(2, '0') + ']' + '  |   ' + client.extra.zfill((data[i][1]), 5) + '   | ' + user.username.substring(0, 18) + '\n';
				}
			}
			if(!userFound) {
				if(user_empty) string += '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n [' + (data.length + 1).toString().padStart(2, '0') + ']  |   00000   | ' + interaction.user.username.substring(0, 18) + '\n';
				else string += '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n [' + (user_index + 1).toString().padStart(2, '0') + ']  |   ' + (data[user_index][1]).toString().padStart(5, '0') + '   | ' + interaction.user.username.substring(0, 18) + '\n';
			}
			string += '```';

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

			let embed = new MessageEmbed()
				.setColor('#0xFE8000')
				.setTitle(interaction.guild.name + '\'s Leaderboard')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription(string)
				.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
			try{await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', '1st Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Reply Denied');}

			let reply = undefined;
			try{reply = await interaction.fetchReply().then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', 'Fetch Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Fetch Reply Denied');}

			try{if(reply == undefined) return await interaction.channel.send('Looks like something wrong happened! Forward this error code: **FRLB1** to TheKWitt @ https://discord.com/invite/BYVD4AGmYR!');}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Reply Denied');}
			const filter = f => {
				return f.user.id == interaction.user.id && f.message.id == reply.id;
			};
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
			collector.on('collect', async f => {
				if(f.customId === 'Left') {
					if(page != 0) {
						page--;
						userFound = false;
						string = '```css\n[Rank] | {.Points.} | Winterfester\n==========================================\n';
						for(let i = page * 10; i < 10 + (10 * page); i++) {
							// eslint-disable-next-line max-statements-per-line
							if (data[i] == undefined) break;

							const raw_user = data[i][0];
							const pre_user = list.get(raw_user.toString());
							if (!pre_user) { client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Get Member From List | ' + raw_user.toString() + ' | Denied Right Button'); }
							else {
								const user = pre_user.user;

								if(data[i][0] == interaction.user.id) {
									userFound = true;
								}

								string += ' ' + '[' + (i + 1).toString().padStart(2, '0') + ']' + '  |   ' + client.extra.zfill((data[i][1]), 5) + '   | ' + user.username.substring(0, 18) + '\n';
							}
						}
						if(!userFound) {
							if(user_empty) string += '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n [' + (data.length + 1).toString().padStart(2, '0') + ']  |   00000   | ' + interaction.user.username.substring(0, 18) + '\n';
							else string += '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n [' + (user_index + 1).toString().padStart(2, '0') + ']  |   ' + (data[user_index][1]).toString().padStart(5, '0') + '   | ' + interaction.user.username.substring(0, 18) + '\n';
						}
						string += '```';

						embed = new MessageEmbed()
							.setColor('#0xFE8000')
							.setTitle(interaction.guild.name + '\'s Leaderboard')
							// eslint-disable-next-line spaced-comment
							//.setThumbnail(user.defaultAvatarURL)
							.setDescription(string)
							.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
						try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', 'Update Page Left'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Update Denied');}
					}
					else {
						try{await f.reply({ content: 'You are already on the first page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', 'Left Page Warning'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Reply Denied'); }
					}
				}
				else if(f.customId === 'Right') {
					if(page != max_page) {
						page++;
						userFound = false;
						string = '```css\n[Rank] | {.Points.} | Winterfester\n==========================================\n';
						for(let i = page * 10; i < 10 + (10 * page); i++) {
							// eslint-disable-next-line max-statements-per-line
							if (data[i] == undefined) break;

							const raw_user = data[i][0];
							const pre_user = list.get(raw_user.toString());
							if (!pre_user) { client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Get Member From List | ' + data[i][0].toString() + ' | Denied Right Button'); }
							else {
								const user = pre_user.user;

								if(data[i][0] == interaction.user.id) {
									userFound = true;
								}

								string += ' ' + '[' + (i + 1).toString().padStart(2, '0') + ']' + '  |   ' + client.extra.zfill((data[i][1]), 5) + '   | ' + user.username.substring(0, 18) + '\n';
							}
						}
						if(!userFound) {
							if(user_empty) string += '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n [' + (data.length + 1).toString().padStart(2, '0') + ']  |   00000   | ' + interaction.user.username.substring(0, 18) + '\n';
							else string += '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n [' + (user_index + 1).toString().padStart(2, '0') + ']  |   ' + (data[user_index][1]).toString().padStart(5, '0') + '   | ' + interaction.user.username.substring(0, 18) + '\n';
						}
						string += '```';

						embed = new MessageEmbed()
							.setColor('#0xFE8000')
							.setTitle(interaction.guild.name + '\'s Leaderboard')
							// eslint-disable-next-line spaced-comment
							//.setThumbnail(user.defaultAvatarURL)
							.setDescription(string)
							.setFooter('Controlled by ' + interaction.user.username + ' | Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
						try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', 'Right Page Update'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Update Denied');}
					}
					else {
						try{await f.reply({ content: 'You are already on the last page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'LB Command', 'Left Page Warning'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'Reply Denied'); }
					}

				}
			});
			// eslint-disable-next-line no-unused-vars
			collector.on('end', async f => {
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
				try{ await reply.edit({ embed: embed, components: [finished_row] }); }
				catch{ client.extra.log_error_g(client.logger, interaction.guild, 'LB Command', 'End Reply Denied'); }
			});
		}
	},
};