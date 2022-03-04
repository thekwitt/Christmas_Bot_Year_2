const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'give',
	description: 'Give a present to a friend!',
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give a present to a friend!')
		.addUserOption(option => option.setName('target').setDescription('The Person you want to give the present to.').setRequired(true))
		.addIntegerOption(option => option.setName('id').setDescription('The ID of the Present you want to give away.').setRequired(true)),
	async execute(interaction, client) {
		
		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];
		
		if(setting.toggle_gifts == false) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'Looks like gifting was disabled on this server!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Gifting Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
		}
		
		const id = interaction.options.getInteger('id');
		const target = interaction.options.getUser('target');

		if(id) {

			const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
			const user_bag = raw.rows[0].presents;

			if(target.bot) {
				interaction.reset_cooldown = true;
				try{return await interaction.reply({ content: target.username + ' is a bot. It doesn\'t need presents since the greatest gift is you using the bot!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}

			if(target.id == interaction.user.id) {
				interaction.reset_cooldown = true;
				try{return await interaction.reply({ content: 'You already have the present silly! Why would you give it to yourself.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Same ID Warning Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}

			await client.pool.query('INSERT INTO guild_data (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, target.id]);

			const data_t = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, target.id]);
			const t_bag = data_t.rows[0].presents;
			
			if(user_bag.length == 0) {
				interaction.reset_cooldown = true;
				// eslint-disable-next-line no-unused-vars
				try{return await interaction.reply({ content: 'You have no present! Go get some before you try to open any!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}

			const data = [...new Set(user_bag)].sort();

			if (String(id).charAt(0) == '2') {
				interaction.reset_cooldown = true;
				try{return await interaction.reply({ content: 'That present is already gifted to you! You don\'t give away gifts that someone gave you!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gifted Present Warning Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}

			if(data.includes(id)) {
				user_bag.splice(user_bag.indexOf(id), 1);
				t_bag.push(Number('2' + String(id).substring(1, 4)));
				await client.pool.query('UPDATE guild_data SET presents = $1 WHERE Guild_ID = $3 AND Member_ID = $2', [user_bag, interaction.user.id, interaction.guildId]);
				await client.pool.query('UPDATE guild_data SET presents = $1 WHERE Guild_ID = $3 AND Member_ID = $2', [t_bag, target.id, interaction.guildId]);
				await client.pool.query('UPDATE guild_stats SET Presents_Given = Presents_Given + 1 WHERE Guild_ID = $1', [interaction.guildId]);
				const present = client.presents.filter(p => p.id == id)[0];

				const embed = new MessageEmbed()
					.setColor(client.colors[0][2])
					.setTitle(interaction.user.username + ' gave ' + target.username + ' a ' + present.name + '!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nNow that is the spirit of Winterfest! Give this user some respect for giving away their gift!\n⠀')
					.setFooter('See what other presents there are in your sack with /sack!');

				try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gave ID Reply')); }
				catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
			} else {
				interaction.reset_cooldown = true;
				try {return await interaction.reply({ content: 'You don\'t have the present with the id ' + id.toString() + '. Please use /sack to see what presents you have and check the ID on the far right!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Wrong present ID Warning Reply')); }
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}
		}
	},
};