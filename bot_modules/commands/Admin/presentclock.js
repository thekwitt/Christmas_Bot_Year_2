const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'presentwatch',
	description: 'See when the next present will spawn.',
	data: new SlashCommandBuilder()
		.setName('presentwatch')
		.setDescription('See when the next present will spawn.'),
	permission: 'MANAGE_CHANNELS',
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const messageSpawn = client.messages.get(interaction.guildId);

		if (messageSpawn == undefined) {
			await client.extra.addGuildStuff(interaction.guild, client);
			try{return await interaction.reply({ content: 'Looks like the watch is still starting up. Go ahead and try /presentwatch again! It is starting to tick!' }).then(client.extra.log_g(client.logger, interaction.guild, 'About Command', 'Bot Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'About Command', 'Reply Denied');}

		}

		const strings = ['Time Remaining: None!', 'Messages Remaining: None!'];


		if(messageSpawn.get('timestamp') - Math.floor(Date.now() / 1000) > 0) strings[0] = 'Time Remaining: ' + (messageSpawn.get('timestamp') - Math.floor(Date.now() / 1000)) + ' Seconds';

		if(messageSpawn.get('messageCount') - 1 > 0) strings[1] = 'Messages Remaining: ' + messageSpawn.get('messageCount');

		const embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('🕒   The Present Watch   🕒')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\n' + strings[0] + '\n' + strings [1] + '\n⠀')
			.setFooter('If you don\'t like these settings, you can always change them with the /settings command!');

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'About Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'About Command', 'Reply Denied');}
	},
};