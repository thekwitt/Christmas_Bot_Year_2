const Topgg = require("@top-gg/sdk")
const express = require("express")
const { Pool } = require('pg');
const fs = require('fs');
const app = express()
const { topweb, databasePW } = require('./token.json');
const logger = fs.createWriteStream('./logs/' + Date.now() + '.txt', { flags : 'w' });
const webhook = new Topgg.Webhook(topweb)

const pool = new Pool({
	database: 'vote_log',
	user: 'postgres',
	password: databasePW,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

function simple_log(logger, message) {
	//console.log('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + message);
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + message + '\n');
}

app.post("/dblwebhook", webhook.listener( async vote => {
	const data = await pool.query('SELECT * FROM christmas WHERE user_id = $1', [vote.user]);
	const test = data.rows[0]
	simple_log(logger, vote.user + ' just voted! Timestamp: ' + (Math.floor(Date.now()/1000) + 43200));
	if(test == undefined) await pool.query('INSERT INTO christmas(user_id, timestamp) VALUES ($1, $2);' ,[vote.user, Math.floor(Date.now()/1000) + 43200]);
	else pool.query('UPDATE christmas SET timestamp = $2 WHERE user_id = $1;', [vote.user, Math.floor(Date.now()/1000)]);
	simple_log(logger, vote.user + ' now synced into database.');
}))

async function delete_stuff() {
	await pool.query('DELETE FROM christmas WHERE timestamp < $1;' , [Math.floor(Date.now()/1000)])
	simple_log(logger, 'Delete cycle executed');
}

setInterval(async function() {delete_stuff();}, 300000);

app.listen(80)