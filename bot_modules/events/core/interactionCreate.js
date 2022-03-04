// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Collection, MessageEmbed } = require('discord.js');
const cooldowns = new Map();

function getTime(time, mode) {
	time = Math.floor(time / 1000) + 1;
	if(mode == 1) return time % 60;
	else if (mode == 2) return Math.floor(time / 60) % 60;
	else if (mode == 3) return Math.floor(time / 3600);
}

module.exports = {
	name: 'interactionCreate',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		if(client.ready.every(v => v === true)) {
			if (interaction.componentType === 'BUTTON') {
				let messageSpawn = client.messages.get(interaction.guildId);

				if (messageSpawn == undefined) {
					const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guildId]);
					const setting = data.rows[0];
					const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
					client.messages.set(interaction.guildId, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
					messageSpawn = client.messages.get(interaction.guildId);
				}

				if (['0', '1', '2', '3', '4', '5', '6', '7'].includes(interaction.customId.toString()) && messageSpawn.get('activeMessage') == false) {
					try{await interaction.reply({ content: 'Looks like present broke itself! As compensation, check out the **/collectrarepresent** to get a free present on me, the bot developer! Thank you for using my bot!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Bad Present Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Broken Present Reply Denied');}
				} else if (['hit', 'miss1', 'miss2'].includes(interaction.customId.toString()) && messageSpawn.get('activeMessage') == false) {
					try{await interaction.reply({ content: 'Looks like the winterboss broke itself! As compensation, check out the **/collectrarepresent** to get a free present on me, the bot developer! Thank you for using my bot!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Bad Boss Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Broken Present Reply Denied');}
				}

				await client.pool.query('INSERT INTO guild_data (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id]);
				// eslint-disable-next-line max-statements-per-line
			} else if(interaction.inGuild() && interaction.guild != undefined) {
				const guildID = interaction.guildId;
				if (!interaction.isCommand()) return;

				const { commandName } = interaction;

				if (!client.commands.has(commandName)) return;

				if (!interaction.guild) return;

				const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guildID]);
				const setting = data.rows[0];

				const authorPerms = interaction.channel.permissionsFor(interaction.member);

				if ((!authorPerms || !authorPerms.has('MANAGE_CHANNELS')) && setting.exclude_cmd_channels.includes(interaction.channelId)) {
					try{return await interaction.reply({ content: 'Looks like this channel is locked from using slash commands on this bot! Try another channel.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'No Channel Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
				}

				await client.pool.query('INSERT INTO guild_data (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id]);
				await client.extra.organize_roles(client, interaction.channel, interaction.guild);

				// Check Channel ID
				const list = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');

				if(!list.has(setting.channel_set) && setting.channel_set != 0) {

					await client.pool.query('UPDATE guild_settings SET channel_set = 0 WHERE Guild_ID = $1', [guildID]);
				}

				const command = client.commands.get(interaction.commandName);

				if(!cooldowns.has(commandName)) {
					cooldowns.set(commandName, new Collection());
				}

				const current_time = Date.now();
				const time_stamps = cooldowns.get(commandName);
				let cooldown_amount = (command.cooldown) * 1000;
				if(commandName === 'collectrarepresent') cooldown_amount = (43200 / setting.extra_collect_hours) * 1000;

				// Check Member ID + Guild ID
				if(time_stamps.has(interaction.member.id + '' + guildID)) {
					const expire_time = time_stamps.get(interaction.member.id + '' + guildID) + cooldown_amount;

					if(current_time < expire_time) {
						// eslint-disable-next-line no-unused-vars
						const time_left = expire_time - current_time;
						if(getTime(time_left, 3) > 0) {
							try{return await interaction.reply({ content: 'Looks like you\'ve used this command lately! Please wait ' + getTime(time_left, 3) + ' hours ' + getTime(time_left, 2) + ' minutes ' + getTime(time_left, 1) + ' seconds!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Cooldown Reply'));}
							catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
						}
						try{return await interaction.reply({ content: 'Looks like you\'ve used this command lately! Please wait ' + getTime(time_left, 2) + ' minutes ' + getTime(time_left, 1) + ' seconds!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Cooldown Reply'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
					}
				}

				time_stamps.set(interaction.member.id + '' + guildID, current_time);
				cooldowns.set(commandName, time_stamps);
				setTimeout(() => time_stamps.delete(interaction.member.id + '' + interaction.guildId), cooldown_amount);


				try {
					// eslint-disable-next-line prefer-const

					if(setting.channel_set == 0 && (commandName != 'setchannel' && commandName != 'help')) {
						try{return await interaction.reply({ content: 'Looks like you don\'t have a channel set or your old channel is gone. To start using the bot, please have a moderator or admin use the /setchannel command on a channel for presents to spawn.' }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'No Channel Reply'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
					}
					else if(((commandName === 'setchannel' || commandName === 'help') && setting.channel_set == 0) || (setting.channel_set != 0)) {

						if(interaction.member.id == 198305088203128832) {
							try{ await command.execute(interaction, client).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', commandName + ' - Execution')); }
							catch(err) {
								await interaction.reply({ content: 'There was an error while executing this command Please try again!', ephemeral: true });
								time_stamps.delete(interaction.member.id + '' + guildID);
								client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event - Look Below', commandName + ' - Execution Failed ');
								client.extra.simple_log(client.logger, String(err));
							}
						} else if(command.permission) {
							if(!authorPerms || !authorPerms.has(command.permission)) {
								const bucketEmbed = new MessageEmbed()
									.setColor('RED')
									.setTitle('You don\'t have permission to use this command.')
									.setDescription('You need the ability to ' + command.permission + ' to use this!')
									.setFooter('If you encounter anymore problems, please join https://discord.gg/BYVD4AGmYR and tag TheKWitt!');
								try{await interaction.reply({ embeds: [bucketEmbed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Invalid Perms Reply'));}
								catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}

							// eslint-disable-next-line max-statements-per-line
							} else {
								try{ await command.execute(interaction, client).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', commandName + ' - Execution')); }
								catch(err) {
									await interaction.reply({ content: 'There was an error while executing this command Please try again!', ephemeral: true });
									time_stamps.delete(interaction.member.id + '' + guildID);
									client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event - Look Below', commandName + ' - Execution Failed ');
									client.extra.simple_log(client.logger, String(err));
								}
							}
						// eslint-disable-next-line max-statements-per-line
						} else {
							try{ await command.execute(interaction, client).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', commandName + ' - Execution')); }
							catch (err) {
								await interaction.reply({ content: 'There was an error while executing this command Please try again!', ephemeral: true });
								time_stamps.delete(interaction.member.id + '' + guildID);
								client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event - Look Below', commandName + ' - Execution Failed ');
								client.extra.simple_log(client.logger, String(err));
							}
						}
					}

					if (interaction.reset_cooldown) time_stamps.delete(interaction.member.id + '' + guildID);

				} catch (error) {
					console.error(error);
					try{await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Error Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
				}
			}
		} else {
			try{await interaction.reply({ content: 'The bot is restarting! Please wait 10 seconds.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Restarting Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
		}
	},
};