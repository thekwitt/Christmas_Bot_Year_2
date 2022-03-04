const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

function calcPresent(present, client) {
	if(String(present).charAt(1) == '1') {
		const rand = client.extra.random(0, 100);
		if(rand < 10) {
			return client.extra.getRandom(client.toys.filter(toy => toy.rarity == 'Epic'));
		} else if (rand < 30) {
			return client.extra.getRandom(client.toys.filter(toy => toy.rarity == 'Rare'));
		} else if (rand < 60) {
			return client.extra.getRandom(client.toys.filter(toy => toy.rarity == 'Uncommon'));
		} else if (rand > 60) {
			return client.extra.getRandom(client.toys.filter(toy => toy.rarity == 'Common'));
		}
	} else if(String(present).charAt(1) == '2') {
		return client.extra.getRandom(client.toys.filter(toy => toy.rarity == 'Lucky'));
	} else if(String(present).charAt(1) == '3') {
		return client.extra.getRandom(client.toys.filter(toy => toy.rarity == 'Glitched'));
	}
}

module.exports = {
	name: 'unwrap',
	description: 'Unwrap presents from your sack!',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('unwrap')
		.setDescription('Unwrap presents from your sack!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('choose')
				.setDescription('Choose a present to unwrap by it\'s id!')
				.addIntegerOption(option => option.setName('id').setDescription('The ID of the Present you want to unwrap.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('bulk')
				.setDescription('Unwrap a random number of presents!')
				.addIntegerOption(option => option.setName('amount').setDescription('The number of presents you want to unwrap! (1-20)').setRequired(true))),
	async execute(interaction, client) {
		const id = interaction.options.getInteger('id');
		let amount = interaction.options.getInteger('amount');
		if ((Date.now() / 1000) > 1640401200 || interaction.guildId == 333949691962195969)
		{
			if(id) {
				const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
				const user_bag = raw.rows[0].presents;

				if(user_bag.length == 0) {
					interaction.reset_cooldown = true;
					// eslint-disable-next-line no-unused-vars
					try{return await interaction.reply({ content: 'You have no presents! You\'ve opened them all!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Unwrap Command', 'No Present Warning Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Unwrap Command', 'Reply Denied');}
				}

				const data = [...new Set(user_bag)].sort();

				if(data.includes(id)) {
					user_bag.splice(user_bag.indexOf(id), 1);
					let toy = calcPresent(id, client);
					while(toy == undefined) toy = calcPresent(id, client);
					await client.pool.query('UPDATE guild_data SET presents = $1, toys = array_append(toys,$2) WHERE Member_ID = $3 AND Guild_ID = $4', [user_bag, toy.id, interaction.user.id, interaction.guildId]);

					const present = client.presents.filter(p => p.id == id)[0];
					await client.pool.query('UPDATE guild_stats SET Presents_Opened = Presents_Opened + 1 WHERE Guild_ID = $1', [interaction.guildId]);
					const embed = new MessageEmbed()
						.setColor(client.colors[0][2])
						.setTitle(interaction.user.username + ' opened a ' + present.name + '!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n They just unwraped a brand new **' + toy.name + '**!\n⠀')
						.setFooter('See what other presents there are in your sack with /sack!');

					try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gave ID Reply')); }
					catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
				} else {
					interaction.reset_cooldown = true;
					try {return await interaction.reply({ content: 'You don\'t have the present with the id ' + id.toString() + '. Please use /sack to see what presents you have and check the ID on the far right!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Wrong present ID Warning Reply')); }
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
				}
			} else if (amount) {

				if (amount < 0) {
					interaction.reset_cooldown = true;
					try{return await interaction.reply({ content: 'The amount is lower than 0. Please use a number between 1-20!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Unwrap Command', 'No Present Warning Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Unwrap Command', 'Reply Denied');}
				} else if (amount > 20) {
					interaction.reset_cooldown = true;
					try{return await interaction.reply({ content: 'The amount is greater than 20. Please use a number between 1-20!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Unwrap Command', 'No Present Warning Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Unwrap Command', 'Reply Denied');}
				}

				const raw = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
				const user_bag = raw.rows[0].presents;
				const toys = [];

				if(user_bag.length == 0) {
					interaction.reset_cooldown = true;
					// eslint-disable-next-line no-unused-vars
					try{return await interaction.reply({ content: 'You have no present! You\'ve opened them all!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Unwrap Command', 'No Present Warning Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Unwrap Command', 'Reply Denied');}
				}

				if(amount > user_bag.length) amount = user_bag.length;

				let string = '';
				for(let x = 0; x < amount; x++) {
					const temp = client.extra.getRandom(user_bag);
					user_bag.splice(user_bag.indexOf(temp), 1);
					let toy = calcPresent(temp, client);
					while(toy == undefined) toy = calcPresent(temp, client);
					toys.push(toy.id);
					string += '• ** ' + toy.rarity + '** ' + toy.name + '\n';
				}

				await client.pool.query('UPDATE guild_data SET presents = $1, toys = array_cat(toys,$2)  WHERE Member_ID = $3 AND Guild_ID = $4', [user_bag, toys, interaction.user.id, interaction.guildId]);

				const embed = new MessageEmbed()
					.setColor(client.colors[0][2])
					.setTitle(interaction.user.username + ' opened a bunch of presenets!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n Here are the toys they unwrapped!\n\n-----------------------------------\n\n' + string + '\n⠀')
					.setFooter('See what other presents there are in your sack with /sack!');

				try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gave ID Reply')); }
				catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
			}
		}
		else {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: 'It isn\'t time for you to open presents yet! Winterfest Celebration begins <t:1640487600:R>!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Unwrap Command', 'Not Christmas Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Unwrap Command', 'Reply Denied');}
		}
	},
};