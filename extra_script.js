const { MessageEmbed } = require('discord.js');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteMessageAfterTime(client, message, time)
{
	setTimeout(async () => {

		if(message == undefined) return;

		if(message.channel == undefined) return;

		if (message.deleted === false)
		{
			try { await message.delete(); }
			catch { return; }
		}
	}, time);
}

// eslint-disable-next-line no-unused-vars
async function organize_roles(client, channel, guild)
{
	const temp_role = guild.roles.cache.find(r => r.name.toLowerCase() === 'winterfest\'s champion');
	let list = guild.members.cache;
	if (guild.memberCount > list.size)
	{
		try{list = await guild.members.fetch().then(client.extra.log_g(client.logger, guild, 'Role Swap', 'Member Fetch'));}
		catch {client.extra.log_error_g(client.logger, guild, 'Role Swap', 'Fetch Denied');}
	}

	if(temp_role != undefined) {
		const raw_data = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1;', [guild.id]);
		let data = raw_data.rows;

		data = client.extra.playOrganizer(data);

		// Eliminate Empty Users
		for(let i = data.length - 1; i > -1; i--)
		{
			try {
				if(data[i][1].length == 0) {
					data.splice(i, 1);
				}
			} catch {
				break;
			}
		}

		// Reduce size if over 100
		if(data.length > 100)
		{
			data = data.slice(0, 100);
		}

		// Get Index of 2nd
		let temp_count = 0;

		for(let i = 1; i < data.length; i++) {
			if(data[0][1] != data[i][1]) break;
			temp_count++;
		}

		for(let i = 0; i < temp_count + 1; i++) {
			let user = undefined;
			try {
				const raw_user = data[i][0];
				const pre_user = list.get(raw_user);
				user = pre_user;
			} catch {
				// eslint-disable-next-line spaced-comment
				//pass
			}

			if(user != undefined) {
				const u_role = user.roles.cache.find(r => r.name.toLowerCase() === 'winterfest\'s champion');
				if(u_role == undefined) {
					try {
						await user.roles.add(temp_role);
					} catch {
						const bucketEmbed = new MessageEmbed()
							.setColor('#FFCC00')
							.setTitle('Attention Server Staff!')
							.setDescription('⠀\nLooks like the **Winterfest\'s Champion** role is higher than the bot role!\nPlease assign a bot role or the included bot role to have manage channel, messages and role perms to this bot that is higher than **Winterfest\'s Champion**.' + '!\n⠀')
							.setFooter('If you encounter anymore problems, please join https://discord.gg/BYVD4AGmYR and tag TheKWitt!');
						// eslint-disable-next-line max-statements-per-line
						try { await channel.send({ embeds: [bucketEmbed] }); } catch{client.extra.log_error_g(client.logger, channel.guild, 'Role Control', 'Warning Reply Denied');}
					}
				}
			}
		}
		for(let i = temp_count + 1; i < data.length; i++) {
			let user = undefined;
			try {
				const raw_user = data[i][0];
				const pre_user = list.get(raw_user);
				user = pre_user;
			} catch {
				// eslint-disable-next-line spaced-comment
				//pass
			}

			if(user != undefined) {
				const u_role = user.roles.cache.find(r => r.name.toLowerCase() === 'winterfest\'s champion');
				if(u_role != undefined) {
					try {
						await user.roles.remove(temp_role);
					} catch {
						// eslint-disable-next-line spaced-comment
						//pass
					}
				}
			}
		}
	}
}

function nFormatter(num, digits) {
	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'B' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	// eslint-disable-next-line no-shadow
	const item = lookup.slice().reverse().find(function(item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

function zfill(number, digits) {
	if (number > 0) {
		return number.toString().padStart(digits, '0');
	} else {
		return '-' + Math.abs(number).toString().padStart(digits, '0');
	}
}

function pointCalculator(entry) {
	let count = 0;

	const toy_values = [1, 2, 3, 4, 5, 10];
	const coals = [-1, -3, -5];
	for (let x = 0; x < entry.toys.length; x++) {
		if(String(entry.toys[x]).charAt(0) == '7') count += coals[Number(String(entry.toys[x]).charAt(3)) - 1];
		else count += toy_values[Number(String(entry.toys[x]).charAt(0)) - 1];
	}

	for (let x = 0; x < entry.presents.length; x++) {
		const fuck = Number(String(entry.presents[x]).charAt(1));
		count += fuck;
	}

	return count;
}

function playOrganizer(list) {
	const ranks = [];
	for (let x = 0; x < list.length; x++) {
		if(list[x].toys.length != 0 || list[x].presents.length != 0) {
			ranks.push([list[x].member_id, pointCalculator(list[x])]);
		}
	}

	ranks.sort(sortFunction);

	return ranks;
}

function sortFunction(a, b) {
	if (a[1] === b[1]) {
		return 0;
	}
	else {
		return (a[1] > b[1]) ? -1 : 1;
	}
}

async function addGuildStuff(guild, client) {

	await client.pool.query('INSERT INTO guild_settings (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
	await client.pool.query('INSERT INTO guild_stats (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
	const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guild.id]);
	const setting = data.rows[0];
	const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
	client.extra.log(client.logger, guild, 'Guild was successfully configured and added to database!');
	client.messages.set(guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
}

function shuffle(array) {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
	return array;
}

function simple_log(logger, message) {
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + message + '\n');
}

function log(logger, guild, message) {
	try {
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

function log_error(logger, guild, message) {
	try {
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | 🔸 ERROR ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

function log_g(logger, guild, message, group) {
	try{
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + group + ': ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

function log_error_g(logger, guild, message, group) {
	try {
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | 🔸 ERROR ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + group + ': ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandom = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = { organize_roles, log, log_error, log_g, log_error_g, simple_log, nFormatter, getRandom, shuffle, random, addGuildStuff, sleep, pointCalculator, playOrganizer, zfill, sortFunction, deleteMessageAfterTime };