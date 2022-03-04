const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'chuck',
	description: 'Chuck a piece of coal at someone!',
	cooldown: 3600,
	data: new SlashCommandBuilder()
		.setName('chuck')
		.setDescription('Chuck a piece of coal at someone!')
		.addUserOption(option => option.setName('target').setDescription('The Person you want to give the present to.').setRequired(true)),
	async execute(interaction, client) {
		
		if((Date.now() / 1000) > 1640401200) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'Looks like it is time for the celebration! You can\'t chuck anymore lumps of coal!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Collect Coal Command', 'Past Christmas Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Collect Command', 'Reply Denied');}
		}
		
		const target = interaction.options.getUser('target');
		const d = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = d.rows[0];

		if(!setting.enable_chucking) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'Looks like the server disabled chucking!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Chuck Command', 'No Present Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Chuck Command', 'Reply Denied');}
		}

		const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
		const user_bag = raw.rows[0].toys;

		if(target.id === interaction.user.id) {
			const choose = client.extra.random(0, 2);
			if(choose == 0) {
				const more = client.extra.random(1, 11);
				for(let x = 0; x < more; x++) {
					user_bag.push(7001);
				}
				await client.pool.query('UPDATE guild_data SET toys = $1 WHERE Guild_ID = $3 AND Member_ID = $2', [user_bag, interaction.user.id, interaction.guildId]);
				const embed = new MessageEmbed()
					.setColor(client.colors[0][2])
					.setTitle(interaction.user.username + ' chucked coal at themselves and is now stuck with ' + more + ' extra lumps of coal!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nFor some odd reason they slammed the coal into their face and it multiplies into more lumps of coal.\n⠀')
					.setFooter(interaction.user.username + ' cannot throw coal again for one hour!');
				try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Chuck Command', 'Punish ID 1 Reply')); }
				catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Chuck Command', 'Reply Denied'); }
			} else if (choose == 1) {
				const more = client.extra.random(1, 4);
				for(let x = 0; x < more; x++) {
					user_bag.push(7003);
				}
				await client.pool.query('UPDATE guild_data SET toys = $1 WHERE Guild_ID = $3 AND Member_ID = $2', [user_bag, interaction.user.id, interaction.guildId]);
				const embed = new MessageEmbed()
					.setColor(client.colors[0][2])
					.setTitle(interaction.user.username + ' chucked coal at themselves and is now stuck with ' + more + ' glitched lumps of coal!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nThey felt really weird today and tried to eat the coal. However, the coal morphs into glitched coal and pops out of their mouth.\n⠀')
					.setFooter(interaction.user.username + ' cannot throw coal again for one hour!');
				try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Chuck Command', 'Punish ID 2 Reply')); }
				catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Chuck Command', 'Reply Denied'); }
			}
		}

		if(target.bot) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: target.username + ' is a bot. It doesn\'t need presents since the greatest gift is you using the bot!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Chuck Command', 'No Present Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Chuck Command', 'Reply Denied');}
		}

		await client.pool.query('INSERT INTO guild_data (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, target.id]);
		const data_t = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, target.id]);
		const t_bag = data_t.rows[0].toys;

		if(user_bag.length == 0) {
			// eslint-disable-next-line no-unused-vars
			interaction.reset_cooldown = true;
			try {return await interaction.reply({ content: 'You don\'t have any regular coal! Remember that lucky coal and glitched coal **cannot** be thrown. Please use /toybox to see what coal you have.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Chuck Command', 'Wrong present ID Warning Reply')); }
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Chuck Command', 'Reply Denied');}
		}

		const data = [...new Set(user_bag)].sort();

		if(data.includes(7001)) {
			user_bag.splice(user_bag.indexOf(7001), 1);
			t_bag.push(7001);
			await client.pool.query('UPDATE guild_stats SET Coal_Thrown = Coal_Thrown + 1 WHERE Guild_ID = $1', [interaction.guildId]);
			await client.pool.query('UPDATE guild_data SET toys = $1 WHERE Guild_ID = $3 AND Member_ID = $2', [user_bag, interaction.user.id, interaction.guildId]);
			await client.pool.query('UPDATE guild_data SET toys = $1 WHERE Guild_ID = $3 AND Member_ID = $2', [t_bag, target.id, interaction.guildId]);

			const embed = new MessageEmbed()
				.setColor(client.colors[0][2])
				.setTitle(interaction.user.username + ' chucked coal at ' + target.username + '!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n' + client.extra.getRandom(['When ' + target.username + ' wasn\'t looking, ' + interaction.user.username + ' chucked a lump of coal at them! What a naughty winterfester!', target.username + ' owes ' + interaction.user.username + ' five dollars, so in spite, they chucked coal at them as payback! What a naughty winterfester!']) + '\n⠀')
				.setFooter(interaction.user.username + ' cannot throw coal again for one hour!');

			try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Chuck Command', 'Gave ID Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Chuck Command', 'Reply Denied'); }
		} else {
			interaction.reset_cooldown = true;
			try {return await interaction.reply({ content: 'You don\'t have any regular coal! Remember that lucky coal and glitched coal **cannot** be thrown. Please use /toybox to see what coal you have.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Chuck Command', 'Wrong present ID Warning Reply')); }
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Chuck Command', 'Reply Denied');}
		}
	},
};