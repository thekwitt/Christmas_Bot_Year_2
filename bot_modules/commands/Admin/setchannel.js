// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'setchannel',
	description: 'Set the Channel for present spawns and activate bot!',
	data: new SlashCommandBuilder()
		.setName('setchannel')
		.setDescription('Set the Channel for present spawns and activate bot!')
		.addChannelOption(option =>
			option.setName('text_channel')
				.setDescription('The text channel to set the bot with.').setRequired(true)),
	permission: 'MANAGE_CHANNELS',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		
		if((Date.now() / 1000) > 1640401200) {
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setLabel('Discord Server')
						.setStyle('LINK')
						.setURL('https://discord.gg/BYVD4AGmYR'),
				);

			
			try{await interaction.reply({ content: 'Hey Dev Here! It looks like you are trying to setup the bot on Christmas.\n\n I am sorry to say that the Christmas Event is no longer available to new servers. If you would like to see any other projects I am working on, head over to my discord server to stay up to date!\n\nThe next bot I will be releasing is a Valentine\'s bot dedicate to love and awareness!\n\nCheers!', components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Christmas collect Present Command', 'Bot Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Present Command', 'Reply Denied');}
		}
		
		const c = interaction.options.getChannel('text_channel');
		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];
		const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'winterfest\'s champion');
		if(role == undefined) {
			try { await interaction.guild.roles.create({ name: 'Winterfest\'s Champion', color: client.colors[1][0] }).then(client.extra.log_g(client.logger, interaction.guild, 'Set Channel Command', 'Role Created.')); }
			catch { client.extra.log_error_g(client.logger, interaction.guild, 'Set Channel Command', 'Role Permission Denied.'); return await interaction.reply('Looks like this bot doesn\'t havep perms to manage roles. Please give it perms to do so and try this command again.');}
		}

		if(setting.channel_set == c.id) {
			try { return await interaction.reply('You already set that channel!').then(client.extra.log_g(client.logger, interaction.guild, 'Set Channel Command', 'Already Set Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Set Channel Command', 'Reply Denied'); }
		}

		if(c.type != 'GUILD_TEXT') {
			try { return await interaction.reply('That channel isn\'t a text channel!').then(client.extra.log_g(client.logger, interaction.guild, 'Set Channel Command', 'Not Text Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Set Channel Command', 'Reply Denied'); }
		}

		await client.pool.query('UPDATE guild_settings SET channel_set = $1 WHERE Guild_ID = $2', [c.id, interaction.guild.id]);
		const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
		client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
		try{ return await interaction.reply(c.name + ' is now the channel!').then(client.extra.log_g(client.logger, interaction.guild, 'Set Channel Command', 'Confirm Reply')); }
		catch {client.extra.log_error_g(client.logger, interaction.guild, 'Set Channel Command', 'Reply Denied'); }
	},
};