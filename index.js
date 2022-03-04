/* eslint-disable max-statements-per-line */
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, topapi, databasePW } = require('./token.json');
const { Pool } = require('pg');
const extra = require('./extra_script');
const Topgg = require(`@top-gg/sdk`);
const topapi = new Topgg.Api(topapi);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.topapi = topapi;
client.logger = fs.createWriteStream('./logs/' + Date.now() + '.txt', { flags : 'w' });
client.commands = new Collection();
client.colors = [['#177E12', '#62AE5E', '#B8DCA7'], ['#C70909', '#8A0404']];
client.icons = ['<:red:905256863958958101>', '<:purple:905259235015798814>', '<:pink:905320519203688498>', '<:orange:905312090259095572>', '<:green:905311851473170492>', '<:blue:905319682653978655>', '<:yellow:905311851246669895>', '<:glitched:905261878958235729>', '<:gray:921476533976195122>', '<:gray:921476533976195122>'];
client.commands_array = [];
client.messages = new Collection();
client.ready = [false, false];
client.voters = [];
client.extra = extra;
const database = require('./bot_modules/json/data.json');


const { AutoPoster } = require('topgg-autoposter');
const ap = AutoPoster(topapi, client);

client.presents = database.presents;
client.toys = database.toys;

const pool = new Pool({
	database: 'christmas',
	user: 'postgres',
	password: databasePW,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

const votes = new Pool({
	database: 'vote_log',
	user: 'postgres',
	password: databasePW,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

const pgtools = require('pgtools');
pgtools.createdb({
	user: 'postgres',
	password: databasePW,
	port: 5432,
}, 'christmas', function(err, res) {
	if (err) {
		console.error('This db already exists');
	}
	else {
		console.log('New Database Made' + res);
	}
});

client.pool = pool;
client.votes = votes;

['Commands'].forEach(handler => {
	require('./bot_modules/handlers/' + handler)(client, token);
});


// Events
fs.readdirSync('./bot_modules/events/').forEach((dir) => {
	const eventFiles = fs
		.readdirSync(`./bot_modules/events/${dir}/`)
		.filter((file) => file.endsWith('.js'));
	eventFiles.forEach(async (file) => {
		const event = require(`./bot_modules/events/${dir}/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	});
});
/*
// Commands
fs.readdirSync('./bot_modules/commands/').forEach((dir) => {
	const commandFiles = fs
		.readdirSync(`./bot_modules/commands/${dir}/`)
		.filter((file) => file.endsWith('.js'));
	commandFiles.forEach(async (file) => {
		const command = require(`./bot_modules/commands/${dir}/${file}`);
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	});
});
*/


ap.on('posted', () => {
	client.extra.simple_log(client.logger, 'Top.gg stats posted!');
});

async function status() {
	if(client.ready.every(v => v === true))
	{
		const data = await client.pool.query('SELECT SUM(presents_collected) AS collect, SUM(coal_thrown) AS throw, SUM(presents_given) AS give FROM guild_stats');
		const stats = data.rows[0];
		// eslint-disable-next-line max-statements-per-line
		const rand = client.extra.random(0, 3);
		let firstPart = client.guilds.cache.size + ' servers';
		if(client.extra.random(0, 100) % 3 == 1) firstPart = client.extra.nFormatter(client.guilds.cache.reduce((sum, g) => sum + g.memberCount, 0)).toString() + ' members ';

		if(rand == 0) try{ await client.user.setActivity(firstPart + ' collect ' + client.extra.nFormatter(stats.collect, 1) + ' presents!', { type: 'WATCHING' });} catch {console.error;}
		else if(rand == 1) try{ await client.user.setActivity(firstPart + ' throw ' + client.extra.nFormatter(stats.throw, 1) + ' coal!', { type: 'WATCHING' });} catch {console.error;}
		else if(rand == 2) try{ await client.user.setActivity(firstPart + ' give ' + client.extra.nFormatter(stats.give, 1) + ' presents away!', { type: 'WATCHING' });} catch {console.error;}
	}
}

setInterval(async function() {status();}, 300000);

client.login(token);