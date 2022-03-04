// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'viewexcludedcmdchannels',
	description: 'View all the channels that exclude slash commands.',
	data: new SlashCommandBuilder()
		.setName('viewexcludedcmdchannels')
		.setDescription('View all the channels that exclude slash commands.'),
	permission: 'MANAGE_CHANNELS',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];

		if(setting.exclude_cmd_channels.length == 0) {
			try{ return await interaction.reply('There are no locked channels!').then(client.extra.log_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Confirm Reply')); }
			catch {client.extra.log_error_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Reply Denied'); }
		}

		let list = interaction.guild.channels.cache;
		if (interaction.guild.channels.channelCountWithoutThreads > list.size)
		{
			try{list = await interaction.guild.channels.fetch().then(client.extra.log_g(client.logger, interaction.guild, 'viewchannels Command', 'Member Fetch'));}
			catch {client.extra.log_error_g(client.logger, interaction.guild, 'viewchannels Command', 'Fetch Denied');}
		}

		const channels = [];
		for(let i = 0; i < setting.exclude_cmd_channels.length; i++) {
			const channel = list.get(setting.exclude_cmd_channels.toString());
			channels.push(channel.name);
		}

		try{ return await interaction.reply(channels.join(', ') + ' are locked from using slash commands.').then(client.extra.log_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Confirm Reply')); }
		catch {client.extra.log_error_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Reply Denied'); }

	},
};