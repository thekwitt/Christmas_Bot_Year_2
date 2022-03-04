const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'addpresents',
	description: 'Add presents to someone\'s sack!',
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('addpresents')
		.setDescription('Add presents to someone\'s sack!')
		.addUserOption(option => option.setName('target').setDescription('The Person you want to add presents to.').setRequired(true))
		.addStringOption(option => option.setName('rarity').setDescription('Regular, Lucky or Glitched Presents?').setRequired(true))
		.addIntegerOption(option => option.setName('amount').setDescription('How many presents?').setRequired(true)),
	permission: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		const amount = interaction.options.getInteger('amount');
		const target = interaction.options.getUser('target');
		const rarity = interaction.options.getString('rarity');

		if(['regular', 'lucky', 'glitched'].includes(rarity.toLowerCase())) {
			if(target.bot) {
				interaction.reset_cooldown = true;
				try{return await interaction.reply({ content: target.username + ' is a bot. It doesn\'t need presents since the greatest gift is you using the bot!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}

			if(amount > 100 || amount < 1)
			{
				interaction.reset_cooldown = true;
				try{return await interaction.reply({ content: 'You can only add 1 - 100 presents at a time!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}

			await client.pool.query('INSERT INTO guild_data (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, target.id]);

			const data_t = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, target.id]);
			const t_bag = data_t.rows[0].presents;

			const index = ['regular', 'lucky', 'glitched'].indexOf(rarity.toLowerCase()) + 1;

			const temp = [];

			if(index == 1) {
				for(let x = 0; x < amount; x++) {
					temp.push(Number(11 + '' + client.extra.zfill(client.extra.random(1, 22), 2)));
				}
			} else if(index == 2) {
				for(let x = 0; x < amount; x++) {
					temp.push(Number(12 + '' + client.extra.zfill(client.extra.random(1, 22), 2)));
				}
			} else if(index == 3) {
				for(let x = 0; x < amount; x++) {
					temp.push(Number(13 + '' + client.extra.zfill(client.extra.random(1, 4), 2)));
				}
			}

			t_bag.push.apply(t_bag, temp);

			await client.pool.query('UPDATE guild_data SET presents = $1 WHERE Guild_ID = $3 AND Member_ID = $2;', [t_bag, target.id, interaction.guildId]);

			const embed = new MessageEmbed()
				.setColor(client.colors[0][2])
				.setTitle(target.username + ' got ' + amount + ' new ' + rarity.toLowerCase() + ' presents!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\nNow that is the spirit of Winterfest!\n⠀')
				.setFooter('Check them out with /sack!');

			try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gave ID Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
		} else {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'Whoops! ' + rarity + ' is not a valid rarity type! Remember to put **regular, lucky or glitched** as the rarity!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Same ID Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
		}
	},
};