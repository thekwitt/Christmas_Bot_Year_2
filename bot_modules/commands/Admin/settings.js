const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'settings',
	description: 'Get or Set Settings for the bot on your server!',
	reset_cooldown: false,
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Get or Set Settings for the bot on your server!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('get_settings')
				.setDescription('Get a list of all your settings.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('enable_chucking')
				.setDescription('Enable chucking coal on your server.')
				.addBooleanOption(option => option.setName('steal').setDescription('Yes or No').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('enable_gifting')
				.setDescription('Enable gifting presents on your server.')
				.addBooleanOption(option => option.setName('gift').setDescription('Yes or No').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_trigger_outside_channel')
				.setDescription('Set if you want messages to be triggered outside the present channel.')
				.addBooleanOption(option => option.setName('outside').setDescription('Yes or No').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_message_count_amount')
				.setDescription('Set how many messages for the present message to appear.')
				.addIntegerOption(option => option.setName('count').setDescription('The Number of Messages').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_message_count_interval')
				.setDescription('Set how long it takes for the present message to appear.')
				.addIntegerOption(option => option.setName('interval').setDescription('The amount of seconds').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_people_per_message')
				.setDescription('Set how many people can get present from a message.')
				.addIntegerOption(option => option.setName('amount').setDescription('The amount of people').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_message_duration')
				.setDescription('Set how long the present message lasts.')
				.addIntegerOption(option => option.setName('duration').setDescription('The amount of seconds').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_rare_present_command')
				.setDescription('Set how many extra presents you want for the /collectrarepresent per vote. (1 - 12)')
				.addIntegerOption(option => option.setName('extra').setDescription('The number of presents').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_boss_difficulty')
				.setDescription('Set how hard you want the boss to be. Easy, Normal, Hard or Mystic?')
				.addStringOption(option => option.setName('difficulty').setDescription('Easy, Normal or Hard?').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_boss_enable')
				.setDescription('Enable winterboss encounters.')
				.addBooleanOption(option => option.setName('boss').setDescription('Yes or No').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_message_delete_overtime')
				.setDescription('Set if you want messages to delete overtime.')
				.addBooleanOption(option => option.setName('overtime').setDescription('Yes or No').setRequired(true))),
	permission: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		const outside = interaction.options.getBoolean('outside');
		const count = interaction.options.getInteger('count');
		const interval = interaction.options.getInteger('interval');
		const amount = interaction.options.getInteger('amount');
		const steal = interaction.options.getBoolean('steal');
		const duration = interaction.options.getInteger('duration');
		const overtime = interaction.options.getBoolean('overtime');
		const boss = interaction.options.getBoolean('boss');
		const extra = interaction.options.getInteger('extra');
		const difficulty = interaction.options.getString('difficulty');
		const gift = interaction.options.getBoolean('gift');

		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];

		if(outside != undefined) {
			await client.pool.query('UPDATE guild_settings SET trigger_outside = $1 WHERE Guild_ID = $2', [outside, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Present Messages being able to be triggered outside the set channel is now ' + outside.toString()).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 1 Command', 'Confirm Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
		} else if(overtime != undefined) {
			await client.pool.query('UPDATE guild_settings SET delete_ot = $1 WHERE Guild_ID = $2', [overtime, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Messages being deleted over time is now set to ' + overtime.toString()).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 1 Command', 'Confirm Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
		} else if (count != undefined) {
			try {
				if (count < 1) return await interaction.reply('That Number is lower than 1, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 2 Command', 'Lower Number Reply'));
				else if (count > 1000) return await interaction.reply('That Number is higher than 1000, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 2 Command', 'High Number Reply'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 2 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET message_count = $1 WHERE Guild_ID = $2', [count, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Present Messages will appear after ' + count.toString() + ' messages.').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 2 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 2 Command', 'Reply Denied')); }
		} else if (interval != undefined) {
			try {
				if (interval < 60) return await interaction.reply('That Number is lower than 60, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 3 Command', 'Lower Number Reply'));
				else if (interval > 3600) return await interaction.reply('That Number is higher than 36000, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 3 Command', 'High Number Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 3 Command', 'Reply Denied'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 2 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET message_interval = $1 WHERE Guild_ID = $2', [interval, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Present Messages will appear after ' + interval.toString() + ' seconds.').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 3 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 3 Command', 'Reply Denied')); }
		} else if (amount != undefined) {
			try {
				if (amount < 1) return await interaction.reply('That Number is lower than 1, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Lower Number Reply'));
				else if (amount > 100) return await interaction.reply('That Number is higher than 100, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'High Number Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET obtain_amount = $1 WHERE Guild_ID = $2', [amount, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply(amount.toString() + ' people can get presents from one present message at a time!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied')); }
		} else if (duration != undefined) {
			try {
				if (duration < 15) return await interaction.reply('That Number is lower than 15, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Lower Number Reply'));
				else if (amount > 300) return await interaction.reply('That Number is higher than 300, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'High Number Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET message_duration = $1 WHERE Guild_ID = $2', [duration, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Present messages will now last ' + duration.toString() + ' seconds!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied')); }
		} else if (extra != undefined) {
			try {
				if (extra < 1) return await interaction.reply('That Number is lower than 1, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Lower Number Reply'));
				else if (extra > 12) return await interaction.reply('That Number is higher than 12, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'High Number Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET extra_collect_hours = $1 WHERE Guild_ID = $2', [extra, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('**/collectrarepresent** now permits ' + extra.toString() + ' presents per vote!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied')); }
		} else if (difficulty != undefined) {
			try { if (!['easy', 'normal', 'hard', 'mystic'].includes(difficulty.toLowerCase())) return await interaction.reply('That isn\'t a proper setting for the boss! Please make sure it is easy, normal, or hard!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'High Number Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Fail Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET boss_diff = $1 WHERE Guild_ID = $2', [['easy', 'normal', 'hard', 'mystic'].indexOf(difficulty.toLowerCase()) + 1, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Winterbosses are now set to ' + difficulty + ' difficulty!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied')); }
		} else if(steal != undefined) {
			await client.pool.query('UPDATE guild_settings SET enable_chucking = $1 WHERE Guild_ID = $2', [steal, interaction.guild.id]);
			try { return await interaction.reply('Members being able to chuck coal at each other is now set to ' + steal.toString()).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 5 Command', 'Confirm Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 5 Command', 'Reply Denied')); }
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
		} else if(boss != undefined) {
			await client.pool.query('UPDATE guild_settings SET boss_enable = $1 WHERE Guild_ID = $2', [boss, interaction.guild.id]);
			try { return await interaction.reply('Encountering winterbosses on the server is now set to ' + boss.toString()).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 5 Command', 'Confirm Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 5 Command', 'Reply Denied')); }
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
		} else if(gift != undefined) {
			await client.pool.query('UPDATE guild_settings SET toggle_gifts = $1 WHERE Guild_ID = $2', [gift, interaction.guild.id]);
			try { return await interaction.reply('Gifting to other members is now set to ' + gift.toString()).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 5 Command', 'Confirm Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 5 Command', 'Reply Denied')); }
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
		} else {
			const channel = interaction.guild.channels.cache.get(setting.channel_set.toString());
			const embed = new MessageEmbed()
				.setColor(client.colors[0][0])
				.setTitle(interaction.guild.name + '\'s Settings')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\nPresent Channel: ' + channel.name + '\n\nMessages being able to be triggered outside the set channel: ' + setting.trigger_outside + '\n\nPeople being able to gift to each other: ' + setting.toggle_gifts + '\n\nMessages to Trigger Present Messages: ' + setting.message_count + ' Messages\n\nSeconds till a Present Message Spawns: ' + setting.message_interval + ' Seconds.\n\nAmount of People that can collect from a present message: ' + setting.obtain_amount + ' People.\n\nPeople being able to chuck coal at each other on the server: ' + setting.enable_chucking + '\n\nDuration of each present message: ' + setting.message_duration + ' seconds.\n\nDelete Messages over time: ' + setting.delete_ot + '.\n\nBoss Encounters: ' + setting.boss_enable + '.\n\nBoss Difficulty: ' + ['Easy', 'Normal', 'Hard', 'Mystic'][setting.boss_diff - 1] + '.\n\nPresents per vote for **/Collectrarepresent**: ' + setting.extra_collect_hours + '.\n⠀');
			try{ return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Get Settings Command', 'Confirm Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Get Settings Command', 'Reply Denied'); }
		}

	},
};