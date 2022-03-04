const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'privacy_policy',
	description: 'Privacy Policy for this bot.',
	data: new SlashCommandBuilder()
		.setName('privacy_policy')
		.setDescription('Privacy Policy for this bot.'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('View it here!')
					.setStyle('LINK')
					.setURL('https://gist.github.com/thekwitt/0585ba2790e140f936073a4ae2faa555'),
			);
		const embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('🔗   Privacy Policy!   🔗')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nClick the button below to be redirected to the privacy policy regarding this bot.\n⠀')
			.setFooter('For any questions/concerns please visit the official TheKWitt server! https://discord.gg/BYVD4AGmYR');

		try{return await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Invite Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Invite Command', 'Reply Denied');}
	},
};