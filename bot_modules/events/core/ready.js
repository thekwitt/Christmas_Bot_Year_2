module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await client.pool.query('	CREATE TABLE IF NOT EXISTS guild_settings(\
									Guild_ID bigint PRIMARY KEY,\
									Channel_Set bigint DEFAULT 0,\
									Trigger_Outside BOOLEAN DEFAULT TRUE,\
									Message_Count INTEGER DEFAULT 10,\
									Obtain_Amount INTEGER DEFAULT 3,\
									Message_Interval INTEGER DEFAULT 300,\
									Enable_Chucking BOOLEAN DEFAULT TRUE,\
									Delete_OT BOOLEAN DEFAULT TRUE\
									);');
		await client.pool.query('	CREATE TABLE IF NOT EXISTS guild_stats(\
									Guild_ID bigint PRIMARY KEY,\
									Presents_Collected INTEGER DEFAULT 0,\
									Presents_Opened INTEGER DEFAULT 0,\
									Presents_Given INTEGER DEFAULT 0,\
									Coal_Collected INTEGER DEFAULT 0,\
									Coal_Thrown INTEGER DEFAULT 0,\
									Messages_Spawned INTEGER DEFAULT 0\
									);');

		await client.pool.query('	CREATE TABLE IF NOT EXISTS guild_data(\
									Guild_ID bigint,\
									Member_ID bigint,\
									presents INTEGER[] DEFAULT \'{}\',\
									toys INTEGER[] DEFAULT \'{}\',\
									collected INTEGER DEFAULT 0,\
									PRIMARY KEY (Guild_ID, Member_ID)\
									);');
		for(const g of await client.guilds.fetch()) {
			const guild = g[1];
			client.extra.addGuildStuff(guild, client);
		}

		const guild = client.guilds.cache.find(g => g.id == '746399419460616193');
		// await guild.commands.set([]).then(console.log).catch(console.error);
		await guild.members.fetch();
		client.ready[0] = true;

		client.extra.simple_log(client.logger, 'Bot is ready');
	},
};