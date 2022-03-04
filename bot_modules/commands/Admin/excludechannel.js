// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'excludecmdchannel',
	description: 'Toggle a channel to be excluded from slash commands!',
	data: new SlashCommandBuilder()
		.setName('excludecmdchannel')
		.setDescription('Toggle a channel to be excluded from slash commands!')
		.addChannelOption(option =>
			option.setName('text_channel')
				.setDescription('The text channel you wish to exclude or reinclude.').setRequired(true)),
	permission: 'MANAGE_CHANNELS',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const c = interaction.options.getChannel('text_channel');

		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];

		if(c.type != 'GUILD_TEXT') {
			try { return await interaction.reply('That channel isn\'t a text channel!').then(client.extra.log_g(client.logger, interaction.guild, 'Set Channel Command', 'Not Text Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Set Channel Command', 'Reply Denied'); }
		}

		if(setting.exclude_cmd_channels.includes(c.id)) {
			await client.pool.query('UPDATE guild_settings SET exclude_cmd_channels = array_remove(exclude_cmd_channels,$1) WHERE Guild_ID = $2;', [c.id, interaction.guildId]);
			try{ return await interaction.reply(c.name + ' is now included for slash command!').then(client.extra.log_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Confirm Reply')); }
			catch {client.extra.log_error_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Reply Denied'); }
		} else if(!setting.exclude_cmd_channels.includes(c.id)) {
			await client.pool.query('UPDATE guild_settings SET exclude_cmd_channels = array_append(exclude_cmd_channels,$1) WHERE Guild_ID = $2;', [c.id, interaction.guildId]);
			try{ return await interaction.reply(c.name + ' is now excluded for slash command!').then(client.extra.log_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Confirm Reply')); }
			catch {client.extra.log_error_g(client.logger, interaction.guild, 'Exclude Channel Command', 'Reply Denied'); }
		}
	},
};