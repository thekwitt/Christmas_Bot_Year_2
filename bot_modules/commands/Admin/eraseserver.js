const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'eraseserver',
	description: 'Erase all members in the server\'s database and all of the settings. (CANNOT UNDO)',
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('eraseserver')
		.setDescription('Erase all members in the server\'s database and all of the settings. (CANNOT UNDO)'),
	permission: 'MANAGE_CHANNELS',
	async execute(interaction, client) {

		await client.pool.query('DELETE from guild_data WHERE Guild_ID = $1;', [interaction.guildId]);
		await client.pool.query('UPDATE guild_settings SET Channel_Set = DEFAULT, Trigger_Outside = DEFAULT, Message_Count = DEFAULT, Obtain_Amount = DEFAULT, Message_Interval = DEFAULT, Enable_Chucking = DEFAULT WHERE Guild_ID = $1;', [interaction.guildId]);
		await client.pool.query('UPDATE guild_stats SET Presents_Collected = DEFAULT, Presents_Opened = DEFAULT, Presents_Given = DEFAULT, Coal_Collected = DEFAULT, Coal_Thrown = DEFAULT, Messages_Spawned = DEFAULT Where Guild_ID = $1;', [interaction.guildId]);

		client.extra.addGuildStuff(interaction.guild, client);

		try { return await interaction.reply({ content: 'Server has been removed. This action cannot be undone.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gave ID Reply')); }
		catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
	},
};