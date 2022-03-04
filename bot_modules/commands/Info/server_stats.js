const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'server_stats',
	description: 'Get statistics about your server within the bot!',
	data: new SlashCommandBuilder()
		.setName('server_stats')
		.setDescription('Get statistics about your server within the bot!'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const raw_data = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1;', [interaction.guildId]);
		const rows = raw_data.rows;
		const data = client.extra.playOrganizer(rows);

		let v = 0;
		for(let x = 0; x < data.length; x++) v += data[x][1];

		const d = await client.pool.query('SELECT * FROM guild_stats WHERE Guild_ID = $1', [interaction.guild.id]);

		const stats = d.rows[0];
		const embed = new MessageEmbed()
			.setColor(client.colors[0][1])
			.setTitle('📖   ' + interaction.guild.name + '\'s Stats   📖   |   Server Value:  ' + String(v))
			.addFields(
				{ name: 'Presents Collected', value: stats.presents_collected + ' presents', inline: true },
				{ name: 'Presents Given Away', value: stats.presents_given + ' presents', inline: true },
				{ name: 'Presents Spawned', value: stats.messages_spawned + ' presents', inline: true },
				{ name: 'Coal Collected', value: stats.coal_collected + ' pieces of coal', inline: true },
				{ name: 'Coal Thrown', value: stats.coal_thrown + ' pieces of coal', inline: true },
			);

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'About Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'About Command', 'Reply Denied');}
	},
};