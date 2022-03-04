const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'update_log',
	description: 'The latest update notes for the bot!',
	data: new SlashCommandBuilder()
		.setName('update_log')
		.setDescription('The latest update notes for the bot!'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guild = client.guilds.cache.find(g => g.id == '746399419460616193');
		const members = await guild.members.cache;
		const filtered = members.filter(u => u.roles.cache.has('779520789812609025'));
		const temp = filtered.random(5);
		const names = [];
		for(let i = 0; i < 5; i++) {
			names.push(temp[i].user.username);
		}
		const embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('📖   Latest Update! 12/22/2021  📖')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('A NEW BOSS HITS THE FIGHT!\n**Skull Klaux**\n\nEngage and defeat this new foe to save winterfest!\n\nCheers!')
			.setFooter(names.join(', ') + ' and ' + (filtered.size - 5) + ' other beta testers made this happen!');

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'About Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'About Command', 'Reply Denied');}
	},
};