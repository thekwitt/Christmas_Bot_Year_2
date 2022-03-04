const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

function getTime(time, mode) {
	if(mode == 1) return time % 60;
	else if (mode == 2) return Math.floor(time / 60) % 60;
	else if (mode == 3) return Math.floor(time / 3600);
}

module.exports = {
	name: 'collectrarepresent',
	description: 'Collect a random lucky or glitched present every hour instead of waiting for one!',
	cooldown: 3600,
	data: new SlashCommandBuilder()
		.setName('collectrarepresent')
		.setDescription('Collect a random lucky or glitched present every hour instead of waiting for one!'),
	async execute(interaction, client) {
		
		if((Date.now() / 1000) > 1640401200) {
			try{return await interaction.reply({ content: 'It is time to open presents! Not collect them! Go go go! **/unwrap** ' }).then(client.extra.log_g(client.logger, interaction.guild, 'Christmas collect Present Command', 'Bot Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Present Command', 'Reply Denied');}
		}
		
		const v = await client.votes.query('SELECT * FROM christmas WHERE user_id = $1', [interaction.user.id]);
		const voter = v.rows[0];

		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];

		if(voter == undefined) {
			const hasVoted = await client.topapi.hasVoted(interaction.user.id);
			if(hasVoted == false) {
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel('Vote Here')
							.setStyle('LINK')
							.setURL('https://top.gg/bot/771198190447230986/vote'),
					);
				interaction.reset_cooldown = true;
				const embed = new MessageEmbed()
					.setColor(client.colors[0][0])
					.setTitle('🔗   You need to vote first!   🔗')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nYou need to vote first before you collect an extra rare present! Vote by pressing the button below.\n\n**You can get up to ' + setting.extra_collect_hours + ' rare presents per vote now!**\n⠀')
					.setFooter('For any questions/concerns please visit the official TheKWitt server! https://discord.gg/BYVD4AGmYR');
				try{return await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Collect Present Command', 'Bot Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Present Command', 'Reply Denied');}
			} else {
				await client.votes.query('INSERT INTO christmas(user_id, timestamp) VALUES ($1, $2);' ,[interaction.user.id, Math.floor(Date.now()/1000) + 43200]);
			}
		}
		const present = client.extra.getRandom(client.presents.filter(p => p.type != 'Regular' && p.gifted == false));
		const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
		const user_bag = raw.rows[0].presents;

		user_bag.push(present.id);
		await client.pool.query('UPDATE guild_stats SET Presents_Collected = Presents_Collected + 1 WHERE Guild_ID = $1', [interaction.guildId]);
		await client.pool.query('UPDATE guild_data SET presents = $1, collected = collected + 1 WHERE Guild_ID = $3 AND Member_ID = $2', [user_bag, interaction.user.id, interaction.guildId]);
		const embed = new MessageEmbed()
			.setColor(client.colors[0][1])
			.setTitle('🎁   You got a ' + present.name + '   🎁')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
			.setImage(present.url)
			.setDescription('⠀\nThanks for voting on the bot! You help bring presents like these to everyone on Discord!\n⠀')
			.setFooter('Come back in ' + getTime(Math.floor(43200 / setting.extra_collect_hours), 3) + ' hours ' + getTime(Math.floor(43200 / setting.extra_collect_hours), 2) + ' minutes for another present!');

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Collect Present Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Collect Present Command', 'Reply Denied - ' + String(err));}
	},
};