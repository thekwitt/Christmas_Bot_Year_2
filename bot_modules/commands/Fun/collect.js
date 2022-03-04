const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'collectcoal',
	description: 'Collect a piece of coal to throw at people.',
	cooldown: 43200,
	data: new SlashCommandBuilder()
		.setName('collectcoal')
		.setDescription('Collect a piece of coal to throw at people.'),
	async execute(interaction, client) {
		
		if((Date.now() / 1000) > 1640401200) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'Looks like it is time for the celebration! You can\'t collect anymore lumps coal!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Collect Coal Command', 'Past Christmas Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Command', 'Reply Denied');}
		}

		
		const d = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = d.rows[0];

		if(!setting.enable_chucking) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'You can\'t chuck coal so you can\'t collect any to chuck at others!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Collect Command', 'No Chucking Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Command', 'Reply Denied');}
		}

		const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
		const user_bag = raw.rows[0].toys;

		user_bag.push(7001);
		await client.pool.query('UPDATE guild_stats SET Coal_Collected = Coal_Collected + 1 WHERE Guild_ID = $1', [interaction.guildId]);
		await client.pool.query('UPDATE guild_data SET toys = $1 WHERE Guild_ID = $3 AND Member_ID = $2', [user_bag, interaction.user.id, interaction.guildId]);
		try {return await interaction.reply({ content: 'You collected a piece of coal! Go chuck it at someone!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Collect Command', 'Chuck Reply')); }
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Command', 'Reply Denied');}
	},
};