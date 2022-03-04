const { registerFont, createCanvas, loadImage } = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

// eslint-disable-next-line no-unused-vars

function return_title(num) {
	const nums = [0, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 1000];
	const titles = ['Winterfester', 'Winterchucker', 'Winterpresenter', 'Wintercollector', 'Wintermercenary', 'Wintercrusader', 'Winterknight', 'Winterlover', 'Winterwarrior', 'Winterchampion', 'Wintersmith'];

	for(let i = nums.length - 1; i >= 0; i--) {
		if (num >= nums[i]) {
			return titles[i];
		}
	}
}


module.exports = {
	name: 'card',
	description: 'View the user\'s winterfest card.',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('card')
		.setDescription('View the user\'s winterfest card.')
		.addUserOption(option => option.setName('target').setDescription('The card of that user.')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const raw_data = await client.pool.query('SELECT * FROM guild_data WHERE Guild_ID = $1;', [interaction.guildId]);
		let d = raw_data.rows;

		d = client.extra.playOrganizer(d);
		let user_index = 0;

		const target = interaction.options.getUser('target');
		let user = interaction.user;
		if (target != undefined) {user = target;}
		// Get User Index
		for(user_index; user_index < d.length; user_index++)
		{
			if(user.id == d[user_index][0]) break;
		}


		if (target && !target.bot)
		{
			user = target;
			await client.pool.query('INSERT INTO guild_data (Member_ID, Guild_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [target.id, interaction.guildId]);
		}
		else if (target && target.bot) {
			try{return await interaction.reply({ content: target.username + ' is a bot. It doesn\'t need presents since the greatest gift is you using the bot!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Card Command', 'Reply Denied');}
		}

		const user_bag = await client.pool.query('SELECT * FROM guild_data WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);

		const u = user_bag.rows[0];

		registerFont('./card/Count.ttf', { family: 'name' });
		registerFont('./card/Points.ttf', { family: 'points' });
		registerFont('./card/Rank.ttf', { family: 'ranks' });
		registerFont('./card/Title.ttf', { family: 'title' });
		registerFont('./card/Server.ttf', { family: 'server' });

		const canvas = createCanvas(1200, 500);
		const context = canvas.getContext('2d');
		const background = await loadImage('./card/Card.png');

		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.fillStyle = '#f6f6f6';
		context.font = '60px title';
		context.fillText(user.username, 185, 88);

		context.fillStyle = '#FFB8B8';
		context.font = '32px "ranks"';
		context.fillText(return_title(u.collected), 185, 143);

		context.fillStyle = '#F0FFD7';
		context.font = '50px points';
		context.fillText('Value - ' + client.extra.pointCalculator(u), 40, 320);

		context.fillStyle = '#E6FFBB';
		context.font = '50px points';
		context.fillText('Presents - ' + client.extra.nFormatter(u.presents.length).toString(), 40, 390);

		context.fillStyle = '#DCFF9F';
		context.font = '50px points';
		context.fillText('Toys - ' + client.extra.nFormatter(u.toys.length).toString(), 40, 460);


		context.fillStyle = '#E0FFBD';
		context.font = '60px name';
		if(d.length == 0) {
			context.fillText('Unranked', 820, 460);
		} else {
			context.fillText('Rank: ' + (user_index + 1).toString().padStart(4, '0') + '', 810, 460);
		}

		context.fillStyle = '#FFC0C0';
		context.font = '48px server';
		context.textAlign = 'right';
		context.fillText(interaction.guild.name, 1155, 80);

		context.beginPath();
		context.arc(95, 95, 65, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();

		const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
		context.drawImage(avatar, 30, 30, 130, 130);

		// End
		const attachment = new MessageAttachment(canvas.toBuffer(), user.username + '_' + Date.now().toString() + '.png');

		try{await interaction.reply({ files: [attachment] }).then(client.extra.log_g(client.logger, interaction.guild, 'Card Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Card Command', 'Reply Denied');}

	},
};