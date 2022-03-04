const { SlashCommandBuilder } = require('@discordjs/builders');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'wheniscelebration',
	description: 'When can I open presents?',
	data: new SlashCommandBuilder()
		.setName('wheniscelebration')
		.setDescription('When can I open presents?'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		try{return await interaction.reply({ content: 'Winterfest Celebration begins <t:1640401200:R>! Keep collecting presents until then!' }).then(client.extra.log_g(client.logger, interaction.guild, 'About Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'About Command', 'Reply Denied');}
	},
};