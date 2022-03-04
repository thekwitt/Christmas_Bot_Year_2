const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

function clarify(id1, id2)
{
	if(id1 == id2) return 'SUCCESS';
	return 'DANGER';
}

function unique_random(client, num, max) {
	let temp = client.extra.random(0, max);
	while(temp == num) {
		temp = client.extra.random(0, max);
	}
	return temp;
}

function get_clock(timestamp) {
	if(timestamp - (Date.now() / 1000) > 110) return '🕐';
	else if(timestamp - (Date.now() / 1000) > 100) return '🕑';
	else if(timestamp - (Date.now() / 1000) > 90) return '🕒';
	else if(timestamp - (Date.now() / 1000) > 80) return '🕓';
	else if(timestamp - (Date.now() / 1000) > 70) return '🕔';
	else if(timestamp - (Date.now() / 1000) > 60) return '🕕';
	else if(timestamp - (Date.now() / 1000) > 50) return '🕖';
	else if(timestamp - (Date.now() / 1000) > 40) return '🕗';
	else if(timestamp - (Date.now() / 1000) > 30) return '🕘';
	else if(timestamp - (Date.now() / 1000) > 20) return '🕙';
	else if(timestamp - (Date.now() / 1000) > 10) return '🕚';
	else return '🕛';
}

async function boss_spawn(message, client, channel_id, messageSpawn) {
	messageSpawn.set('activeMessage', true);
	client.messages.set(message.guildId, messageSpawn);

	const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [message.guildId]);
	const setting = data.rows[0];

	const whichBoss = client.extra.random(0, 2);

	const intros = ['The abominable snow chad rose from the depth of the ground to steal all the presents!', 'Skull Klaux has risen from the depths and is now ready to take over winterfest!'];
	const links = ['https://cdn.discordapp.com/attachments/782835367085998080/920389263785332806/Chad_Snow.png', 'https://cdn.discordapp.com/attachments/782835367085998080/923083477346299904/Skull_Klaux.png'];
	let z = client.extra.random(0, 3);

	const rows = [
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)				.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			),
	];

	const superHits = [
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('superhit')
					.setLabel('Super Hit!')
					.setStyle('PRIMARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('superhit')
					.setLabel('Super Hit!')
					.setStyle('PRIMARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)				.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('superhit')
					.setLabel('Super Hit!')
					.setStyle('PRIMARY'),
			),
	];


	const expires = [
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER')
					.setDisabled(true),

			),
	];

	const endts = (Date.now() / 1000) + 130;
	const users = new Map();
	const user_damage = new Map();
	const user_miss = new Map();
	const randomHealth = setting.boss_diff - 1;
	const stun = new Map();
	const health = [40, 60, 75][randomHealth];
	let damage = 0;
	let sec_limit = client.extra.random([8, 7, 6][setting.boss_diff - 1], 11);

	const beginning = ['Is that.. snow?', 'Where did that portal come from?'];
	const begin_links = ['https://cdn.discordapp.com/attachments/782835367085998080/922302710710173726/Firstsnow.png', 'https://cdn.discordapp.com/attachments/782835367085998080/923083476637470730/Portal.png'];

	let embed = new MessageEmbed()
		.setColor(client.colors[0][0])
		.setTitle('Something is happening!')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
		.setDescription(beginning[whichBoss])
		.setFooter('I don\'t like the look of this...')
		.setImage(begin_links[whichBoss]);

	let channel = undefined;
	channel = await message.guild.channels.cache.get(channel_id.toString());
	let interactionMessage = undefined;
	try{ interactionMessage = await channel.send({ embeds: [embed] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss First Send - ' + setting.boss_diff)); }
	catch {
		client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Boss Send Denied');
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		client.messages.set(message.guildId, messageSpawn);
	}
	await client.pool.query('UPDATE guild_stats SET messages_spawned = messages_spawned + 1 WHERE Guild_ID = $1', [message.guildId]);

	if(interactionMessage == undefined) {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		return client.messages.set(message.guildId, messageSpawn);
	}
	if(setting.delete_ot) {
		try { await client.extra.deleteMessageAfterTime(client, interactionMessage, 300000 + setting.message_duration); }
		catch (error) { client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Boss Delete Denied'); }
	}

	const filter = i => {
		if(interactionMessage != undefined) return i.message.id == interactionMessage.id;
	};

	if(filter == undefined) {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		return client.messages.set(message.guildId, messageSpawn);
	}

	await client.extra.sleep(5000);

	embed = new MessageEmbed()
		.setColor(client.colors[0][1])
		.setTitle('A Winterboss has invaded the server!')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
		.addFields(
			{ name: 'Health', value: (100 - Math.floor((damage / health) * 100)) + '% remaining', inline: true },
			{ name: 'Time', value: get_clock(endts), inline: true },
			{ name: '\u200B', value: '\u200B' },
		)
		.setDescription('⠀\n*' + intros[whichBoss] + '*\n\n' + '**Defeat the boss to win presents!**\n⠀')
		.setFooter('You only have two minutes to defeat the boss! \n(Hint: 5 clicks per 5 seconds before it tells you to slow down!)\nNext Button Swap is in ' + sec_limit + ' seconds.')
		.setImage(links[whichBoss]);

	try{await interactionMessage.edit({ embeds: [embed], components: [rows[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Attack Edit'));}
	catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}

	const collector = await channel.createMessageComponentCollector({ filter, time: 120000 });

	collector.on('collect', async i => {
		users.set(i.user.id, (Date.now() / 1000) + 3);
		if(!user_miss.has(i.user.id)) user_miss.set(i.user.id, 0);
		if (i.customId === 'hit' || i.customId === 'superhit') {
			if(stun.has(i.user.id)) {
				if(stun.get(i.user.id) - Math.floor(Date.now() / 1000) < 0) {
					stun.delete(i.user.id);

					let x = users.size;

					if(x == 0) x = 1;

					let hit = 1 / x;

					if(i.customId === 'superhit') hit = 0.03 * health;

					if(!user_damage.has(i.user.id)) user_damage.set(i.user.id, hit);
					else user_damage.set(i.user.id, user_damage.get(i.user.id) + hit);

					damage += hit;
					if(damage >= health) {
						try { await i.deferUpdate(); }
						catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Ended Hit');}
						collector.stop();
					} else {
						// eslint-disable-next-line no-lonely-if
						if(i.customId === 'hit') {
							try { await i.deferUpdate(); }
							catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Hit Denied');}
						} else if(i.customId === 'superhit') {
							try{ await i.reply({ content: 'Nice! You super hit the boss for 3% !', ephemeral: true }); }
							catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
							if(damage < health) {
								try{await interactionMessage.edit({ embeds: [embed], components: [rows[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Super Attack Edit'));}
								catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
							}
						}
					}
				} else {
					try{ await i.reply({ content: 'You can\'t attack for ' + (stun.get(i.user.id) - Math.floor(Date.now() / 1000)) + ' more seconds!', ephemeral: true }); }
					catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
				}
			} else {
				let x = users.size;

				if(x == 0) x = 1;

				let hit = 1 / x;

				if(i.customId === 'superhit') hit = 0.03 * health;

				if(!user_damage.has(i.user.id)) user_damage.set(i.user.id, hit);
				else user_damage.set(i.user.id, user_damage.get(i.user.id) + hit);

				damage += hit;
				if(damage >= health) {
					try { await i.deferUpdate(); }
					catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Ended Hit');}
					collector.stop();
				} else {
					// eslint-disable-next-line no-lonely-if
					if(i.customId === 'hit') {
						try { await i.deferUpdate(); }
						catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Hit Denied');}
					} else if(i.customId === 'superhit') {
						try{ await i.reply({ content: 'Nice! You super hit the boss for 3% !', ephemeral: true }); }
						catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
						if(damage < health) {
							try{await interactionMessage.edit({ embeds: [embed], components: [rows[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Super Attack Edit'));}
							catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
						}
					}
				}
			}
		} else {
			// eslint-disable-next-line no-lonely-if
			if(stun.has(i.user.id)) {
				try{ await i.reply({ content: 'You can\'t attack for ' + (stun.get(i.user.id) - Math.floor(Date.now() / 1000)) + ' more seconds!', ephemeral: true }); }
				catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
			} else {
				stun.set(i.user.id, Math.floor(Date.now() / 1000) + 4);
				setTimeout(() => stun.delete(i.user.id), 3000);

				user_miss.set(i.user.id, user_miss.get(i.user.id) + 1);

				try{ await i.reply({ content: 'You missed an attack and got knocked out for three seconds! You have to wait three seconds before you can attack again!', ephemeral: true }); }
				catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Attacik Denied');}
			}
		}
	});
	try {
	// eslint-disable-next-line no-unused-vars
		collector.on('end', async i => {
			const sortedDamage = new Map([...user_damage.entries()].sort((a, b) => b[1] - a[1]));
			const arraySortedDamage = Array.from(sortedDamage.keys());

			if(user_damage.size == 0) {
				const end = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('The Winterboss Left!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n**No one tried to stop the winterboss and claimed victory over the server!**\n⠀')
					.setFooter('You only have two minutes to defeat the boss!')
					.setImage();
				try{await interactionMessage.edit({ embeds: [end], components: [expires[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Empty Edit'));}
				catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}
			} else {
				let string = 'Oh no! The winterboss couldn\'t be defeated in time and claimed victory over the server!!';
				let members = channel.guild.members.cache;

				if (channel.guild.memberCount > members.size)
				{
					try{members = await channel.guild.members.fetch().then(client.extra.log_g(client.logger, channel.guild, 'LB Command', 'Member Fetch'));}
					catch {client.extra.log_error_g(client.logger, channel.guild, 'LB Command', 'Fetch Denied');}
				}
				if(damage >= health) {
					let dmgString = '';
					let ranking = '';
					if(whichBoss == 0) string = 'The abominable snow chad exploded with a bunch of presents inside! Everyone grabs the presents falling from the sky!';
					else if (whichBoss == 1) string = 'Skull Klaux starts crumbling and shatters! Inside him was a bunch of presents! Everyone grabs the presents falling from the sky!';

					if(user_damage.size > 3) {
						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'Over ' + user_damage.size + ' members participated!\n\n__Prizes__\n1st - 2 Glitched Present\n2nd - 3 Lucky Presents\n3rd - 2 Lucky Presents\n4th and Under - 1 Lucky Present';
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 3 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301, 1302], arraySortedDamage[0], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 2 WHERE Guild_ID = $3 AND Member_ID = $2;', [[Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)), Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)), Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2))], arraySortedDamage[1], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)), Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2))], arraySortedDamage[2], message.guildId]);

						for(let x = 3; x < arraySortedDamage.length; x++)
						{
							await client.pool.query('UPDATE guild_data SET presents = array_append(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)), arraySortedDamage[x], message.guildId]);
						}

					} else if (user_damage.size == 3) {
						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'Over ' + user_damage.size + ' members participated!\n\n__Prizes__\n1st - 1 Glitched Present\n2nd - 2 Lucky Presents\n3rd - 1 Lucky Present';
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 2 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301], arraySortedDamage[0], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)), Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2))], arraySortedDamage[1], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_append(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)), arraySortedDamage[2], message.guildId]);

					} else if(user_damage.size == 2) {
						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'Over ' + user_damage.size + ' members participated!\n\n__Prizes__\n1st - 1 Glitched Present\n2nd - 1 Lucky Present';
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301], arraySortedDamage[0], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_append(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)), arraySortedDamage[1], message.guildId]);
					} else if(user_damage.size == 1) {
						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'One warrior has defeated the boss themselves! What a hero! They get a glitched present!';
						await client.pool.query('UPDATE guild_data SET presents = array_append(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [1301, arraySortedDamage[0], message.guildId]);
					}

					let limit = user_damage.size;
					if (limit > 10) limit = 10;

					for(let x = 0; x < limit; x++) {
						dmgString += ' ' + '[' + (x + 1).toString().padStart(2, '0') + ']' + '  |  ' + sortedDamage.get(arraySortedDamage[x]).toFixed(2).toString().padStart(5, '0') + ' / ' + user_miss.get(arraySortedDamage[x]).toString().padStart(3, '0') + '   | ' + members.get(arraySortedDamage[x].toString()).user.username.substring(0, 15) + '\n';
					}

					dmgString += '```';
					const end = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('The Winterboss is defeated!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n' + string + '\n\n**' + ranking + '**\n⠀')
						.setFooter('Enjoy the presents!')
						.setImage();


					const dmgBoard = new MessageEmbed()
						.setColor(client.colors[0][2])
						.setTitle('Damage Leaderboard')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n' + dmgString + '\n⠀')
						.setFooter('Enjoy the presents!')
						.setImage();


					const viewfilter = j => {
						if(interactionMessage != undefined) return j.message.id == interactionMessage.id;
					};

					if(viewfilter == undefined) {
						try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [expires[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Win 6 Edit'));}
						catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

						messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
						return client.messages.set(message.guildId, messageSpawn);
					}

					const button = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('view')
								.setLabel('View your stats!')
								.setStyle('PRIMARY'),
						);

					try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [button] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Win 5 Edit'));}
					catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

					const viewcollector = await channel.createMessageComponentCollector({ filter, time: 300000 });

					viewcollector.on('collect', async j => {
						if(j.customId === 'view') {
							if(!arraySortedDamage.includes(j.user.id)) {
								try{ await j.reply({ content: 'Looks like you weren\'t in this boss fight!', ephemeral: true }); }
								catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied');}
							} else {
								const r = arraySortedDamage.indexOf(j.user.id);

								try{ await j.reply({ content: 'You did ' + sortedDamage.get(arraySortedDamage[r]).toFixed(2).toString() + ' damage, missed ' + user_miss.get(arraySortedDamage[r]).toString() + ' times and were ranked #' + (r + 1), ephemeral: true }); }
								catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied - ' + err.toString());}
							}
						}
					});
					try {
						// eslint-disable-next-line no-unused-vars
						viewcollector.on('end', async j => {
							return;
						});
					} catch { return; }

				} else {
					for(let x = 0; x < arraySortedDamage.length; x++)
					{
						await client.pool.query('UPDATE guild_data SET toys = array_append(toys,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [7001, arraySortedDamage[x], message.guildId]);
					}
					let dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';

					let limit = user_damage.size;
					if (limit > 10) limit = 10;

					for(let x = 0; x < limit; x++) {
						dmgString += ' ' + '[' + (x + 1).toString().padStart(2, '0') + ']' + '  |  ' + sortedDamage.get(arraySortedDamage[x]).toFixed(2).toString().padStart(5, '0') + ' / ' + user_miss.get(arraySortedDamage[x]).toString().padStart(3, '0') + '   | ' + members.get(arraySortedDamage[x].toString()).user.username.substring(0, 15) + '\n';
					}

					dmgString += '```';

					const end = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('The Winterboss defeated the server!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n**' + string + '**\n\nAnyone who hit the boss got coal from that!\n⠀')
						.setFooter('Next time work together to defeat the winterboss!')
						.setImage();


					const dmgBoard = new MessageEmbed()
						.setColor(client.colors[0][2])
						.setTitle('Damage Leaderboard')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n' + dmgString + '\n⠀')
						.setFooter('Enjoy the presents!')
						.setImage();


					const viewfilter = j => {
						if(interactionMessage != undefined) return j.message.id == interactionMessage.id;
					};

					if(viewfilter == undefined) {
						try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [expires[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Defeated 6 Edit'));}
						catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

						messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
						return client.messages.set(message.guildId, messageSpawn);
					}

					const button = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('view')
								.setLabel('View your stats!')
								.setStyle('PRIMARY'),
						);

					try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [button] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Defeated 5 Edit'));}
					catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

					const viewcollector = await channel.createMessageComponentCollector({ filter, time: 300000 });

					viewcollector.on('collect', async j => {
						if(j.customId === 'view') {
							if(!arraySortedDamage.includes(j.user.id)) {
								try{ await j.reply({ content: 'Looks like you weren\'t in this boss fight!', ephemeral: true }); }
								catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied');}
							} else {
								const r = arraySortedDamage.indexOf(j.user.id);

								try{ await j.reply({ content: 'You did ' + sortedDamage.get(arraySortedDamage[r]).toFixed(2).toString() + ' damage, missed ' + user_miss.get(arraySortedDamage[r]).toString() + ' times and were ranked #' + (r + 1), ephemeral: true }); }
								catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied - ' + err.toString());}
							}
						}
					});
					try {
						// eslint-disable-next-line no-unused-vars
						viewcollector.on('end', async j => {
							return;
						});
					} catch { return; }
				}
			}
			messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
			client.messages.set(message.guildId, messageSpawn);

			return;

		});
	} catch {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		client.messages.set(message.guildId, messageSpawn);
		client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Failed From No Cache');
	}

	let second = 0;

	while (damage < health && collector.ended == false) {
		await client.extra.sleep(1000);

		if(messageSpawn.get('activeMessage') == false) break;

		second++;
		for(let [key, value] of users.entries()) {
			if(value < (Date.now() / 1000)) {
				users.delete(key);
			}
		}

		if(damage < health && collector.ended == false) {
			if(second >= sec_limit) {
				sec_limit = client.extra.random([8, 7, 6][setting.boss_diff - 1], 11);
				second = 0;
				const superMaybe = client.extra.random(0, 101);
				if (superMaybe > 5) {
					embed = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('A Winterboss has invaded the server!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.addFields(
							{ name: 'Health', value: (100 - Math.floor((damage / health) * 100)) + '% remaining', inline: true },
							{ name: 'Time', value: get_clock(endts), inline: true },
							{ name: '\u200B', value: '\u200B' },
						)
						.setDescription('⠀\n*' + intros[whichBoss] + '*\n\n' + '**Defeat the boss to win presents!**\n⠀')
						.setFooter('You only have two minutes to defeat the boss! \n(Hint: 5 clicks per 5 seconds before it tells you to slow down!)\nNext Button Swap is in ' + sec_limit + ' seconds.')
						.setImage(links[whichBoss]);
					z = unique_random(client, z, 3);

					if(damage < health && collector.ended == false) {
						try{await interactionMessage.edit({ embeds: [embed], components: [rows[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Attack Edit'));}
						catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
					}
				} else {
					embed = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('A Winterboss has invaded the server!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.addFields(
							{ name: 'Health', value: (100 - Math.floor((damage / health) * 100)) + '% remaining', inline: true },
							{ name: 'Time', value: get_clock(endts), inline: true },
							{ name: '\u200B', value: '\u200B' },
						)
						.setDescription('⠀\n*' + intros[whichBoss] + '*\n\n' + '**Defeat the boss to win presents!**\n⠀')
						.setFooter('You only have two minutes to defeat the boss! \n(Hint: 5 clicks per 5 seconds before it tells you to slow down!)\nNext Button Swap is in ' + sec_limit + ' seconds.')
						.setImage(links[whichBoss]);
					z = unique_random(client, z, 3);
					if(damage < health && collector.ended == false) {
						try{await interactionMessage.edit({ embeds: [embed], components: [superHits[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Attack Edit'));}
						catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
					}
				}
			}
		} else {break;}
	}


}

async function mystic_boss_spawn(message, client, channel_id, messageSpawn) {
	messageSpawn.set('activeMessage', true);
	client.messages.set(message.guildId, messageSpawn);

	const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [message.guildId]);
	const setting = data.rows[0];

	const whichBoss = client.extra.random(0, 2);

	const intros = ['The snow chad champion rose from the depth of the ground to steal all the presents!', 'The Juiced Up Skull Klaux has risen from then depths to take over winterfest!'];
	const links = ['https://cdn.discordapp.com/attachments/782835367085998080/920885962760921098/Mystic_Chad_Snow.png', 'https://cdn.discordapp.com/attachments/782835367085998080/923083476947828756/Mystic_Skull_Klaux.png'];
	let z = client.extra.random(0, 3);

	const rows = [
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)				.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			),
	];

	const superHits = [
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('superhit')
					.setLabel('Super Hit!')
					.setStyle('PRIMARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('superhit')
					.setLabel('Super Hit!')
					.setStyle('PRIMARY'),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY'),
			)				.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('superhit')
					.setLabel('Super Hit!')
					.setStyle('PRIMARY'),
			),
	];

	const expires = [
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			),
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('miss1')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('miss2')
					.setLabel('Miss!')
					.setStyle('SECONDARY')
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit!')
					.setStyle('DANGER')
					.setDisabled(true),

			),
	];

	const endts = (Date.now() / 1000) + 130;
	const users = new Map();
	const stun = new Map();
	const user_miss = new Map();
	const user_damage = new Map();
	const health = 85;
	let damage = 0;
	let sec_limit = client.extra.random(5, 11);

	const beginning = ['Is that.. glowing snow?', 'Where did that immortal portal come from?'];
	const begin_links = ['https://cdn.discordapp.com/attachments/782835367085998080/922302710487842867/Firstsnowglow.png', 'https://cdn.discordapp.com/attachments/782835367085998080/923083476452913162/Portal_2.png'];

	let embed = new MessageEmbed()
		.setColor(client.colors[0][0])
		.setTitle('Something is happening!')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
		.setDescription(beginning[whichBoss])
		.setImage(begin_links[whichBoss]);


	let channel = undefined;
	channel = await message.guild.channels.cache.get(channel_id.toString());
	let interactionMessage = undefined;
	try{ interactionMessage = await channel.send({ embeds: [embed] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss First Send - ' + setting.boss_diff)); }
	catch {
		client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Boss Send Denied');
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		client.messages.set(message.guildId, messageSpawn);
	}
	await client.pool.query('UPDATE guild_stats SET messages_spawned = messages_spawned + 1 WHERE Guild_ID = $1', [message.guildId]);

	if(interactionMessage == undefined) {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		return client.messages.set(message.guildId, messageSpawn);
	}
	if(setting.delete_ot) {
		try { await client.extra.deleteMessageAfterTime(client, interactionMessage, 300000 + setting.message_duration); }
		catch (error) { client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Boss Delete Denied'); }
	}

	const filter = i => {
		if(interactionMessage != undefined) return i.message.id == interactionMessage.id;
	};

	if(filter == undefined) {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		return client.messages.set(message.guildId, messageSpawn);
	}

	await client.extra.sleep(5000);

	embed = new MessageEmbed()
		.setColor(client.colors[0][1])
		.setTitle('A Mystic Winterboss has invaded the server!')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
		.addFields(
			{ name: 'Health', value: (100 - Math.floor((damage / health) * 100)) + '% remaining', inline: true },
			{ name: 'Time', value: get_clock(endts), inline: true },
			{ name: '\u200B', value: '\u200B' },
		)
		.setDescription('⠀\n*' + intros[whichBoss] + '*\n\n' + '**Defeat the boss to win presents!**\n⠀')
		.setFooter('You only have three minutes to defeat the boss! \n(Hint: 5 clicks per 5 seconds before it tells you to slow down!)\nNext Button Swap is in ' + sec_limit + ' seconds.')
		.setImage(links[whichBoss]);

	const collector = await channel.createMessageComponentCollector({ filter, time: 120000 });

	collector.on('collect', async i => {
		users.set(i.user.id, (Date.now() / 1000) + 3);
		if(!user_miss.has(i.user.id)) user_miss.set(i.user.id, 0);
		if (i.customId === 'hit' || i.customId === 'superhit') {
			if(stun.has(i.user.id)) {
				if(stun.get(i.user.id) - Math.floor(Date.now() / 1000) < 0) {
					stun.delete(i.user.id);

					let x = users.size;

					if(x == 0) x = 1;

					let hit = 1 / x;

					if(i.customId === 'superhit') hit = 0.03 * health;

					if(!user_damage.has(i.user.id)) user_damage.set(i.user.id, hit);
					else user_damage.set(i.user.id, user_damage.get(i.user.id) + hit);

					damage += hit;
					if(damage >= health) {
						try { await i.deferUpdate(); }
						catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Ended Hit');}
						collector.stop();
					} else {
						// eslint-disable-next-line no-lonely-if
						if(i.customId === 'hit') {
							try { await i.deferUpdate(); }
							catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Hit Denied');}
						} else if(i.customId === 'superhit') {
							try{ await i.reply({ content: 'Nice! You super hit the boss for 3% !', ephemeral: true }); }
							catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
							if(damage < health) {
								try{await interactionMessage.edit({ embeds: [embed], components: [rows[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Super Attack Edit'));}
								catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
							}
						}
					}
				} else {
					try{ await i.reply({ content: 'You can\'t attack for ' + (stun.get(i.user.id) - Math.floor(Date.now() / 1000)) + ' more seconds!', ephemeral: true }); }
					catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
				}
			} else {
				let x = users.size;

				if(x == 0) x = 1;

				let hit = 1 / x;

				if(i.customId === 'superhit') hit = 0.03 * health;

				if(!user_damage.has(i.user.id)) user_damage.set(i.user.id, hit);
				else user_damage.set(i.user.id, user_damage.get(i.user.id) + hit);

				damage += hit;
				if(damage >= health) {
					try { await i.deferUpdate(); }
					catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Ended Hit');}
					collector.stop();
				} else {
					// eslint-disable-next-line no-lonely-if
					if(i.customId === 'hit') {
						try { await i.deferUpdate(); }
						catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Hit Denied');}
					} else if(i.customId === 'superhit') {
						try{ await i.reply({ content: 'Nice! You super hit the boss for 3% !', ephemeral: true }); }
						catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
						if(damage < health) {
							try{await interactionMessage.edit({ embeds: [embed], components: [rows[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Super Attack Edit'));}
							catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
						}
					}
				}

			}
		} else {
			// eslint-disable-next-line no-lonely-if
			if(stun.has(i.user.id)) {
				try{ await i.reply({ content: 'You can\'t attack for ' + (stun.get(i.user.id) - Math.floor(Date.now() / 1000)) + ' more seconds!', ephemeral: true }); }
				catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Reminder Denied');}
			} else {
				stun.set(i.user.id, Math.floor(Date.now() / 1000) + 4);
				setTimeout(() => stun.delete(i.user.id), 3000);

				user_miss.set(i.user.id, user_miss.get(i.user.id) + 1);

				try{ await i.reply({ content: 'You missed an attack and got knocked out for three seconds! You have to wait three seconds before you can attack again!', ephemeral: true }); }
				catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'Miss Attacik Denied');}
			}
		}
	});
	try {
	// eslint-disable-next-line no-unused-vars
		collector.on('end', async i => {
			const sortedDamage = new Map([...user_damage.entries()].sort((a, b) => b[1] - a[1]));
			const arraySortedDamage = Array.from(sortedDamage.keys());

			if(user_damage.size == 0) {
				const end = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('The Mystic Mystic Winterboss Left!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n**No one tried to stop the winterboss and claimed victory over the server!**\n⠀')
					.setFooter('Better luck next time winterboss!')
					.setImage();
				try{await interactionMessage.edit({ embeds: [end], components: [expires[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Empty Edit'));}
				catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}
			} else {
				let string = 'Oh no! The winterboss couldn\'t be defeated in time and claimed victory over the server!!';
				let members = channel.guild.members.cache;

				if (channel.guild.memberCount > members.size)
				{
					try{members = await channel.guild.members.fetch().then(client.extra.log_g(client.logger, channel.guild, 'LB Command', 'Member Fetch'));}
					catch {client.extra.log_error_g(client.logger, channel.guild, 'LB Command', 'Fetch Denied');}
				}

				if(damage >= health) {
					let dmgString = '';
					let ranking = '';

					if(whichBoss == 0) string = 'The snow chad champion exploded with a bunch of presents inside! Everyone grabs the presents falling from the sky!';
					else if (whichBoss == 1) string = 'Skull Klaux starts crumbling and shatters! Inside him was a bunch of presents! Everyone grabs the presents falling from the sky!';

					if(user_damage.size > 3) {

						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'Over ' + user_damage.size + ' members participated!\n\n__Prizes__\n1st - 2 Glitched Presents\n2nd - 1 Glitched and Lucky Present\n3rd - 1 Glitched Present\n4th and Under - 1 Lucky Present';


						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 3 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301, 1302], arraySortedDamage[0], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 2 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301, Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2))], arraySortedDamage[1], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301], arraySortedDamage[2], message.guildId]);

						for(let x = 3; x < arraySortedDamage.length; x++)
						{
							await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2))], arraySortedDamage[x], message.guildId]);
						}
					} else if (user_damage.size == 3) {

						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'Over ' + user_damage.size + ' members participated!\n\n__Prizes__\n1st - 2 Glitched Presents\n2nd - 1 Glitched and Lucky Present\n3rd - 1 Glitched Present';

						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 2 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301, 1302], arraySortedDamage[0], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301, Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2))], arraySortedDamage[1], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301], arraySortedDamage[2], message.guildId]);

					} else if(user_damage.size == 2) {

						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'Over ' + user_damage.size + ' members participated!\n\n__Prizes__\n1st - 1 Glitched Presents\n2nd - 1 Lucky Present';

						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301], arraySortedDamage[0], message.guildId]);
						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2))], arraySortedDamage[1], message.guildId]);

					} else if(user_damage.size == 1) {
						dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
						ranking = 'One warrior has defeated the boss themselves! Really one single person beat it?! What an insane hero! They get 3 glitched presents! WOW!';

						await client.pool.query('UPDATE guild_data SET presents = array_cat(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [[1301, 1302, 1303], arraySortedDamage[0], message.guildId]);
					}

					if(message.guildId == '821335372793380874') dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Degen\n========================================\n';


					let limit = user_damage.size;
					if (limit > 10) limit = 10;

					for(let x = 0; x < limit; x++) {
						dmgString += ' ' + '[' + (x + 1).toString().padStart(2, '0') + ']' + '  |  ' + sortedDamage.get(arraySortedDamage[x]).toFixed(2).toString().padStart(5, '0') + ' / ' + user_miss.get(arraySortedDamage[x]).toString().padStart(3, '0') + '   | ' + members.get(arraySortedDamage[x].toString()).user.username.substring(0, 15) + '\n';
					}

					dmgString += '```';
					const end = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('The Winterboss is defeated!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n' + string + '\n\n**' + ranking + '**\n⠀')
						.setFooter('Enjoy the presents!')
						.setImage();


					const dmgBoard = new MessageEmbed()
						.setColor(client.colors[0][2])
						.setTitle('Damage Leaderboard')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n' + dmgString + '\n⠀')
						.setFooter('Enjoy the presents!')
						.setImage();

					const viewfilter = j => {
						if(interactionMessage != undefined) return j.message.id == interactionMessage.id;
					};

					if(viewfilter == undefined) {
						try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [expires[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Win 6 Edit'));}
						catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

						messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
						return client.messages.set(message.guildId, messageSpawn);
					}

					const button = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('view')
								.setLabel('View your stats!')
								.setStyle('PRIMARY'),
						);

					try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [button] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Win 5 Edit'));}
					catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

					const viewcollector = await channel.createMessageComponentCollector({ filter, time: 300000 });

					viewcollector.on('collect', async j => {
						if(j.customId === 'view') {
							if(!arraySortedDamage.includes(j.user.id)) {
								try{ await j.reply({ content: 'Looks like you weren\'t in this boss fight!', ephemeral: true }); }
								catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied');}
							} else {
								const r = arraySortedDamage.indexOf(j.user.id);

								try{ await j.reply({ content: 'You did ' + sortedDamage.get(arraySortedDamage[r]).toFixed(2).toString() + ' damage, missed ' + user_miss.get(arraySortedDamage[r]).toString() + ' times and were ranked #' + (r + 1), ephemeral: true }); }
								catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied - ' + err.toString());}
							}
						}
					});
					try {
						// eslint-disable-next-line no-unused-vars
						viewcollector.on('end', async j => {
							return;
						});
					} catch { return; }

				} else {
					for(let x = 0; x < arraySortedDamage.length; x++)
					{
						await client.pool.query('UPDATE guild_data SET toys = array_append(toys,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [7003, arraySortedDamage[x], message.guildId]);
					}
					let dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Winterfester\n==========================================\n';
					if(message.guildId == '821335372793380874') dmgString = '```css\n[Rank] | {.Dmg / Miss.} | Degen\n========================================\n';

					let limit = user_damage.size;
					if (limit > 10) limit = 10;

					for(let x = 0; x < limit; x++) {
						dmgString += ' ' + '[' + (x + 1).toString().padStart(2, '0') + ']' + '  |  ' + sortedDamage.get(arraySortedDamage[x]).toFixed(2).toString().padStart(5, '0') + ' / ' + user_miss.get(arraySortedDamage[x]).toString().padStart(3, '0') + '   | ' + members.get(arraySortedDamage[x].toString()).user.username.substring(0, 15) + '\n';
					}

					dmgString += '```';

					const end = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('The Winterboss defeated the server!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n**' + string + '**\n\nAnyone who hit the boss got coal from that!\n⠀')
						.setFooter('Next time work together to defeat the winterboss!')
						.setImage();


					const dmgBoard = new MessageEmbed()
						.setColor(client.colors[0][2])
						.setTitle('Damage Leaderboard')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n' + dmgString + '\n⠀')
						.setFooter('Enjoy the presents!')
						.setImage();


					const viewfilter = j => {
						if(interactionMessage != undefined) return j.message.id == interactionMessage.id;
					};

					if(viewfilter == undefined) {
						try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [expires[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Defeat 6 Edit'));}
						catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

						messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
						return client.messages.set(message.guildId, messageSpawn);
					}

					const button = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('view')
								.setLabel('View your stats!')
								.setStyle('PRIMARY'),
						);

					try{await interactionMessage.edit({ embeds: [end, dmgBoard], components: [button] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Defeat 5 Edit'));}
					catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}

					const viewcollector = await channel.createMessageComponentCollector({ filter, time: 300000 });

					viewcollector.on('collect', async j => {
						if(j.customId === 'view') {
							if(!arraySortedDamage.includes(j.user.id)) {
								try{ await j.reply({ content: 'Looks like you weren\'t in this boss fight!', ephemeral: true }); }
								catch {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied');}
							} else {
								const r = arraySortedDamage.indexOf(j.user.id);

								try{ await j.reply({ content: 'You did ' + sortedDamage.get(arraySortedDamage[r]).toFixed(2).toString() + ' damage, missed ' + user_miss.get(arraySortedDamage[r]).toString() + ' times and were ranked #' + (r + 1), ephemeral: true }); }
								catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Boss Event', 'View Denied - ' + err.toString());}
							}
						}
					});
					try {
						// eslint-disable-next-line no-unused-vars
						viewcollector.on('end', async j => {
							return;
						});
					} catch { return; }
				}
			}
			messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
			client.messages.set(message.guildId, messageSpawn);

			return;

		});
	} catch {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		client.messages.set(message.guildId, messageSpawn);
		client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Failed From No Cache');
	}

	let second = 0;

	while (damage < health && collector.ended == false) {
		await client.extra.sleep(1000);

		if(messageSpawn.get('activeMessage') == false) break;

		second++;
		for(let [key, value] of users.entries()) {
			if(value < (Date.now() / 1000)) {
				users.delete(key);
			}
		}

		if(damage < health && collector.ended == false) {
			if(second >= sec_limit) {
				sec_limit = client.extra.random(5, 11);
				second = 0;
				const superMaybe = client.extra.random(0, 101);
				if (superMaybe > 5) {
					embed = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('A Winterboss has invaded the server!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.addFields(
							{ name: 'Health', value: (100 - Math.floor((damage / health) * 100)) + '% remaining', inline: true },
							{ name: 'Time', value: get_clock(endts), inline: true },
							{ name: '\u200B', value: '\u200B' },
						)
						.setDescription('⠀\n*' + intros[whichBoss] + '*\n\n' + '**Defeat the boss to win presents!**\n⠀')
						.setFooter('You only have two minutes to defeat the boss! \n(Hint: 5 clicks per 5 seconds before it tells you to slow down!)\nNext Button Swap is in ' + sec_limit + ' seconds.')
						.setImage(links[whichBoss]);
					z = unique_random(client, z, 3);
					if(damage < health && collector.ended == false) {
						try{await interactionMessage.edit({ embeds: [embed], components: [rows[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Attack Edit'));}
						catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
					}
				} else {
					embed = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('A Winterboss has invaded the server!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.addFields(
							{ name: 'Health', value: (100 - Math.floor((damage / health) * 100)) + '% remaining', inline: true },
							{ name: 'Time', value: get_clock(endts), inline: true },
							{ name: '\u200B', value: '\u200B' },
						)
						.setDescription('⠀\n*' + intros[whichBoss] + '*\n\n' + '**Defeat the boss to win presents!**\n⠀')
						.setFooter('You only have two minutes to defeat the boss! \n(Hint: 5 clicks per 5 seconds before it tells you to slow down!)\nNext Button Swap is in ' + sec_limit + ' seconds.')
						.setImage(links[whichBoss]);
					z = unique_random(client, z, 3);
					if(damage < health && collector.ended == false) {
						try{await interactionMessage.edit({ embeds: [embed], components: [superHits[z]] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Boss Attack Edit'));}
						catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Attack Edit Denied - ' + String(err));}
					}
				}
			}
		} else {break;}
	}
}

async function present_spawn(message, client, channel_id, messageSpawn) {
	// eslint-disable-next-line prefer-const
	let ids = [];
	messageSpawn.set('activeMessage', true);
	client.messages.set(message.guildId, messageSpawn);

	const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [message.guildId]);
	const setting = data.rows[0];

	let embed = undefined;
	const percent = client.extra.random(0, 101);
	let rarity = 1;
	let present = client.extra.getRandom(client.presents.filter(p => p.type == 'Regular' && p.gifted == false));
	let num = (Number(String(present.id).slice(-2)) - 1) % 7;
	const intros = ['*A present falls from the sky!*', '*The present taunts you with anticipation.*', '*Suddenly out of the blue, there is a present in front of you.*', '*George, the potted plant of the North Pole, greets you with a present.*'];
	embed = new MessageEmbed()
		.setColor(client.colors[0][1])
		.setTitle('🌟   A ' + present.name + ' suddenly appeared!   🌟')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
		.setDescription('⠀\n' + client.extra.getRandom(intros) + '\n\n' + '**Press the button that looks like the present in the picture below to get it!**\n⠀')
		.setFooter('You only have one chance to collect this present!')
		.setImage(present.url);

	let tempArr = [num];
	while (tempArr.length < 3) {
		const r = client.extra.random(0, 6);
		if(tempArr.indexOf(r) === -1) tempArr.push(r);
	}
	tempArr = client.extra.shuffle(tempArr);
	let row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(String(tempArr[0]))
				.setEmoji(String(client.icons[tempArr[0]]))
				.setStyle('SUCCESS')
				.setDisabled(false),
		)
		.addComponents(
			new MessageButton()
				.setCustomId(String(tempArr[1]))
				.setEmoji(String(client.icons[tempArr[1]]))
				.setStyle('SUCCESS')
				.setDisabled(false),
		)
		.addComponents(
			new MessageButton()
				.setCustomId(String(tempArr[2]))
				.setEmoji(String(client.icons[tempArr[2]]))
				.setStyle('SUCCESS')
				.setDisabled(false),
		);

	let finishedRow = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(String(tempArr[0]))
				.setEmoji(String(client.icons[tempArr[0]]))
				.setStyle(clarify(tempArr[0], num))
				.setDisabled(true),
		)
		.addComponents(
			new MessageButton()
				.setCustomId(String(tempArr[1]))
				.setEmoji(String(client.icons[tempArr[1]]))
				.setStyle(clarify(tempArr[1], num))
				.setDisabled(true),
		)
		.addComponents(
			new MessageButton()
				.setCustomId(String(tempArr[2]))
				.setEmoji(String(client.icons[tempArr[2]]))
				.setStyle(clarify(tempArr[2], num))
				.setDisabled(true),
		);

	// eslint-disable-next-line no-inline-comments
	if(percent < 5) { // Glitched
		present = client.extra.getRandom(client.presents.filter(p => p.type == 'Glitched' && p.gifted == false));
		num = 7;
		rarity = 3;
		embed = new MessageEmbed()
			.setColor(client.colors[0][1])
			.setTitle('🌟   A ' + present.name + ' suddenly appeared!   🌟')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\n' + client.extra.getRandom(intros) + '\n\n' + '**Press the button that looks like the present in the picture below to get it!**\n⠀')
			.setFooter('You only have one chance to collect this present!')
			.setImage(present.url);

		tempArr = [num, 8, 9];
		while (tempArr.length < 5) {
			const r = client.extra.random(0, 6);
			if(tempArr.indexOf(r) === -1) tempArr.push(r);
		}
		tempArr = client.extra.shuffle(tempArr);
		row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[0]))
					.setEmoji(String(client.icons[tempArr[0]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[1]))
					.setEmoji(String(client.icons[tempArr[1]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[2]))
					.setEmoji(String(client.icons[tempArr[2]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[3]))
					.setEmoji(String(client.icons[tempArr[3]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[4]))
					.setEmoji(String(client.icons[tempArr[4]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			);

		finishedRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[0]))
					.setEmoji(String(client.icons[tempArr[0]]))
					.setStyle(clarify(tempArr[0], num))
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[1]))
					.setEmoji(String(client.icons[tempArr[1]]))
					.setStyle(clarify(tempArr[1], num))
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[2]))
					.setEmoji(String(client.icons[tempArr[2]]))
					.setStyle(clarify(tempArr[2], num))
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[3]))
					.setEmoji(String(client.icons[tempArr[3]]))
					.setStyle(clarify(tempArr[3], num))
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[4]))
					.setEmoji(String(client.icons[tempArr[4]]))
					.setStyle(clarify(tempArr[4], num))
					.setDisabled(true),
			);
	}

	// eslint-disable-next-line no-inline-comments
	else if(percent < 35) { // Lucky
		present = client.extra.getRandom(client.presents.filter(p => p.type == 'Lucky' && p.gifted == false));
		rarity = 2;
		num = (Number(String(present.id).slice(-2)) - 1) % 7;
		embed = new MessageEmbed()
			.setColor(client.colors[0][1])
			.setTitle('🌟   A ' + present.name.replace('Square ', '').replace('Circle  ', '').replace('Rectangle  ', '') + ' suddenly appeared!   🌟')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\n' + client.extra.getRandom(intros) + '\n\n' + '**Press the button that looks like the present in the picture below to get it!**\n⠀')
			.setFooter('You only have one chance to collect this present!')
			.setImage(present.url);

		tempArr = [num];
		while (tempArr.length < 4) {
			const r = client.extra.random(0, 5);
			if(tempArr.indexOf(r) === -1) tempArr.push(r);
		}
		tempArr = client.extra.shuffle(tempArr);
		row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[0]))
					.setEmoji(String(client.icons[tempArr[0]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[1]))
					.setEmoji(String(client.icons[tempArr[1]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[2]))
					.setEmoji(String(client.icons[tempArr[2]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[3]))
					.setEmoji(String(client.icons[tempArr[3]]))
					.setStyle('SUCCESS')
					.setDisabled(false),
			);

		finishedRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[0]))
					.setEmoji(String(client.icons[tempArr[0]]))
					.setStyle(clarify(tempArr[0], num))
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[1]))
					.setEmoji(String(client.icons[tempArr[1]]))
					.setStyle(clarify(tempArr[1], num))
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[2]))
					.setEmoji(String(client.icons[tempArr[2]]))
					.setStyle(clarify(tempArr[2], num))
					.setDisabled(true),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(String(tempArr[3]))
					.setEmoji(String(client.icons[tempArr[3]]))
					.setStyle(clarify(tempArr[3], num))
					.setDisabled(true),
			);
	}

	let channel = undefined;
	channel = await message.guild.channels.cache.get(channel_id.toString());
	let interactionMessage = undefined;
	try{ interactionMessage = await channel.send({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'First Send - ' + rarity));}
	catch (err) {
		client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Send Denied - ' + err.toString());
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		client.messages.set(message.guildId, messageSpawn);
	}
	await client.pool.query('UPDATE guild_stats SET messages_spawned = messages_spawned + 1 WHERE Guild_ID = $1', [message.guildId]);
	if(interactionMessage == undefined) {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		client.messages.set(message.guildId, messageSpawn);
	}
	if(setting.delete_ot) {
		try { await client.extra.deleteMessageAfterTime(client, interactionMessage, 300000 + setting.message_duration); }
		catch (error) { client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Delete Denied'); }
	}

	const filter = i => {
		if(interactionMessage != undefined) return i.message.id == interactionMessage.id;
	};

	if(filter == undefined) {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		return client.messages.set(message.guildId, messageSpawn);
	}

	const wins = [];

	const loses = [];

	const collector = await channel.createMessageComponentCollector({ filter, time: setting.message_duration * 1000, maxUsers: setting.obtain_amount });
	collector.on('collect', async i => {
		await client.pool.query('INSERT INTO guild_data (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [message.guildId, message.author.id]);
		if (ids.includes(i.user.id)) {
			try{await i.reply({ content: 'You already tried to get a present!', ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Already Present Reply'));}
			catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied - ' + String(err));}
		}
		else if (collector.users.size > setting.obtain_amount) {
			try{await i.reply({ content: 'Oh no! You were too late! Someone grabbed the last present.', ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Too Late Present Reply'));}
			catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied - ' + String(err));}
		}
		else if (i.customId === String(num)) {
			ids.push(i.user.id);
			wins.push(i.user.username);
			await client.pool.query('UPDATE guild_data SET presents = array_append(presents,$1), collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2;', [present.id, i.user.id, message.guildId]);
			// eslint-disable-next-line max-statements-per-line
			await client.pool.query('UPDATE guild_stats SET Presents_Collected = Presents_Collected + 1 WHERE Guild_ID = $1', [message.guildId]);
			const strings = ['*You firmly grasp the present and put it in your holiday sack.*', '*You jump around happily and squeal louder than your life depends on it as you put the present in your holiday sack.*', '*Your holiday sack engulfs the present on its own. You stare at the holiday sack as it returns to an inanimate object.*', '*You poke the present with curiosity and slowly tug at the ribbon. Startled, the present jumps into the holiday sack shaking furiously.*', '*You have an anime battle with the present. Fortunately your power exceeds the very soul the present possesses.*', '*You examine the present and conclude that it is worth unwrapping later.*', '*Mahogany.*', '*The present has a casual conversation with you as it trips and falls into your holiday sack.*'];
			const wow = ['', ' Woah! You got a present!', 'Awesome! You got a lucky present!', 'Unbelievable! You got a glitched present'];
			embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle(wow[rarity])
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n' + client.extra.getRandom(strings) + '\n\nNice! You now have a new present! Go ahead and check it out with **/sack** or give it to a friend with **/give target:@Friend#0001 id:' + present.id + '**!\n⠀')
				.setFooter('Make sure to pay attention on the next bunch!');
			try{await i.reply({ embeds: [embed], ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', i.user.username + ' - Present Reply'));}
			catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Got Reply Denied - ' + String(err));}

		}
		else {
			ids.push(i.user.id);
			loses.push(i.user.username);
			const strings = ['*In the end, it was no present. In fact it was just a lump of coal.*', '*You crush the present with your feet and it morphs into coal that is stuck on the bottom of your shoe.*', '*The present vanishes. Maybe the real present was the friend\'s we made along the way. But sadly all you got was coal.*', '*You were impatient and opened the present too early. What you find inside makes you suffer regret.*', '*The present realizes you are not a good person and spits coal at you.*', '*Turns out it was someone else\'s present. As you take it into your hands, you open it up to only find the finest coal ever made.*'];
			embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('Oh no! You picked the wrong present!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n' + client.extra.getRandom(strings) + '\n\n**You now have a lump of coal in your toybox!**\n⠀')
				.setFooter('Make sure to pay attention on the next bunch!');
			await client.pool.query('UPDATE guild_stats SET Coal_Collected = Coal_Collected + 1 WHERE Guild_ID = $1', [message.guildId]);
			await client.pool.query('UPDATE guild_data SET toys = array_append(toys,$1) WHERE Guild_ID = $3 AND Member_ID = $2;', [[7001, 7002, 7003][rarity - 1], i.user.id, message.guildId]);
			// eslint-disable-next-line max-statements-per-line
			try{await i.reply({ embeds: [embed], ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Present Failed Reply'));}
			catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Miss Reply Denied - ' + String(err));}
		}

	});
	// eslint-disable-next-line no-unused-vars
	try {
		// eslint-disable-next-line no-unused-vars
		collector.on('end', async i => {
			await client.extra.sleep(100);
			let print_users = '';
			if(wins.length != 0) print_users += wins.join(', ') + ' got presents! Look at them go!' + '\n\n';
			if(loses.length != 0) print_users += loses.join(', ') + ' got coal! Oh no what have they done!' + '\n\n';

			if(wins.length == 0 && loses.length == 0) print_users = '\n\n';

			if(collector.users.size < setting.obtain_amount) {
				const strings = ['*The present flew away, never to be seen again.*', '*Connection to the present was lost.*', '*The present didn\'t feel wanted and started becoming depressed. The sad little box hopped away.*'];
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('The present vanished!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n' + client.extra.getRandom(strings) + '\n\n' + print_users + '**Keep on talking for another one to appear!**\n⠀')
					.setFooter('Each bundle of presents only lasts ' + setting.message_duration + ' seconds!');
				try{await interactionMessage.edit({ embeds: [embed], components: [finishedRow] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Expired Edit'));}
				catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied - ' + String(err));}
			}
			else {
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('Everyone took all the presents! Holy Cow!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n' + print_users + '**Keep on talking for another one to appear!**\n⠀')
					.setFooter('Each bundle of presents only lasts ' + setting.message_duration + ' seconds!');
				try{await interactionMessage.edit({ embeds: [embed], components: [finishedRow] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Empty Edit'));}
				catch (err) {client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied - ' + String(err));}
			}
			messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
			client.messages.set(message.guildId, messageSpawn);
		});
	} catch {
		messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
		client.messages.set(message.guildId, messageSpawn);
		client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Failed From No Cache');
	}
}


async function fuck(setting, message, client, channel_id) {
	const messageSpawn = client.messages.get(message.guildId);

	if (messageSpawn == undefined) return await client.extra.addGuildStuff(message.guild, client);

	if (messageSpawn.get('timestamp') < Math.floor(Date.now() / 1000) && messageSpawn.get('messageCount') <= 1 && messageSpawn.get('activeMessage') == false) {
		let rand = client.extra.random(0, 101);

		if(setting.boss_enable == false) rand = 20;
		if(rand > 10) {
			await present_spawn(message, client, channel_id, messageSpawn);
		}
		else {
			// eslint-disable-next-line no-lonely-if
			if(setting.boss_diff == 4) await mystic_boss_spawn(message, client, channel_id, messageSpawn);
			else await boss_spawn(message, client, channel_id, messageSpawn);
		}
	}
	else {
		messageSpawn.set('messageCount', messageSpawn.get('messageCount') - 1);
		client.messages.set(message.guildId, messageSpawn);
	}
}

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		if(!message.deleted && message.member != null)
		{
			await client.pool.query('INSERT INTO guild_data (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [message.guildId, message.author.id]);
			const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [message.guildId]);
			const setting = data.rows[0];

			if(setting == undefined) return await client.extra.addGuildStuff(message.guild, client);
			// Check Channel ID
			const list = message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');
			if(!list.has(setting.channel_set) && setting.channel_set != 0) {

				await client.pool.query('UPDATE guild_settings SET channel_set = 0 WHERE Guild_ID = $1', [message.guildId]);
			}

			if(setting.channel_set != 0 && (Date.now() / 1000) < 1640401200) {
				if(setting.trigger_outside) {
					if(client.ready.every(v => v === true) && message.member.user.bot == false) {
						try {
							await fuck(setting, message, client, setting.channel_set);
						} catch (err) {
							const messageSpawn = client.messages.get(message.guildId);
							messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
							client.messages.set(message.guildId, messageSpawn);
							client.extra.log_error_g(client.logger, message.guild, 'Message Create Event - Look Below', 'Message Event Failed ');
							client.extra.simple_log(client.logger, String(err));
						}
					}
				} else if (message.channel.id == setting.channel_set) {
					if(client.ready.every(v => v === true) && message.member.user.bot == false) {
						try {
							await fuck(setting, message, client, setting.channel_set);
						} catch (err) {
							const messageSpawn = client.messages.get(message.guildId);
							messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
							client.messages.set(message.guildId, messageSpawn);
							client.extra.log_error_g(client.logger, message.guild, 'Message Create Event - Look Below', 'Message Event Failed ');
							client.extra.simple_log(client.logger, String(err));
						}
					}
				}
			}
		}
	},
};