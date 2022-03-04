const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars
function duplicates(arr, id) {
	let count = 0;
	for(let i = 0; i < arr.length; i++)
	{
		if (arr[i] === id) count++;
	}
	return count;
}

module.exports = {
	name: 'help',
	description: 'Get help for commands and how the bot works!',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help for commands and how the bot works!')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('What kind of help do you need?')
				.setRequired(true)
				.addChoice('Why is the bot called An Elf\'s Christmas?', 'elf')
				.addChoice('Overview of Bot', 'overview')
				.addChoice('List of Commands', 'list')
				.addChoice('Overview of Presents', 'presents')
				.addChoice('Overview of Winterbosses', 'boss')
				.addChoice('Overview of Toys', 'toys')
				.addChoice('Overview of Coal', 'coal')
				.addChoice('Overview of Value', 'value')
				.addChoice('Overview of Giving', 'giving')
				.addChoice('Overview of Profile Commands', 'profile')
				.addChoice('Overview of Setting Commands', 'setting')
				.addChoice('Overview of Information Commands', 'info')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const data = interaction.options.getString('type');
		const raw = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = raw.rows[0];
		let string = '';
		if(setting.channel_set == '0') string = '\n\n**Looks like you haven\'t setup the bot yet! Go ahead and pick a channel by using */setchannel*** to get access to the bot. (You need to have Manage Channel Perms in order to use that command)';

		if(data === 'overview') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Winterfest   📙')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n**__What is Winterfest?__**\nWinterfest is a Christmas Bot dedicated to bringing the fun of opening presents to your devices! You can stay more connected with your community with collecting presents, giving them to your friends and throwing coal at strangers!\n\n**__Is there a role included?__**\nYes! It is awarded to the user who has the most valuable presents and toys!\n\n**__I have a big server. Is there any customization?__**\nDepending on the size of your server you can also use setting commands to change up how the bot responds, allowing more flexibility for anybody\'s server.' + string + '\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
		} else if(data === 'elf') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Why is the bot called "An Elf\'s Christmas"?   📙')
				.setDescription('⠀\nCreator here. Turns out I have to send a support email to change the name of a verified bot. (Go figure). Until then please bear with me on this one. As I was not aware of this. Thanks!\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'boss') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   What is a winterboss?   📙')
				.setDescription('⠀\n**__What is a winterboss__**\nA winterboss is an event that happens occasionally on your server! A boss will spawn and your objective is to defeat it for presents!\n\n**__How do you play?__**\nYou hit the "Hit!" button to do damage! If you somehow hit the "Miss!" button, you will be stunned for three seconds!\n\n**__What happens when you win?__**\nEveryone who participated gets presents! The more people that participate, the more presents people can get! The top 3 damage dealers get the most presents though!\n**If your server gets defeated however... all participating members will get coal!**\n\n**__How does damage work?__**\nSo basically damage is calculated based on how many people recently attacked the boss. **1 / Recent participates**\nSo lets say 7 people attack the boss but only 5 of them are stil attacking after 3 seconds, that means the damage will change from 1/7 to 1/5.\nThis was done to help prevent bosses from being griefed and allow everyone to defeat it fairly.\n\n**__I am a server owner and I hate this addition! Can I turn it off?__**\nOfcourse! This isn\'t for every community so you can turn it off with the settings command!\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'list') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Command List   📙')
				.addFields(
					{ name: 'Fun Commands', value: '**/give**  **/unwrap**   **/chuck**   **/collectcoal**   **/collectrarepresent**', inline: true },
					{ name: 'Setting Commands', value: '**/setchannel**  **/settings** **/addpresents**', inline: true },
					{ name: 'Profile Commands', value: '**/sack**   **/toybox**   **/card**   **/leaderboard**', inline: true },
					{ name: 'Info Commands', value: '**/help**   **/donate**   **/support**   **/about**   **/invite**   **/server_stats**', inline: true },
				)
				.setDescription('Here is')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'presents') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Presents   📙')
				.setDescription('⠀\n**__What is a present?__**\nPresents are collectable items that you can obtain from messages that spawn on the server which can be unwrapped on the day of the celebration! (<t:1640401200>)\n\n**__How do you collect presents?__**\nYou can collect presents by interacting with the messages that pop up with presents on them! The more you talk, the more the presents will spawn!\n\n**__What types of presents are there?__**\nThere are three types of presents. **Regular, Lucky and Glitched**. Each present contains more valuable toys inside.\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'toys') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Toys   📙')
				.setDescription('⠀\n**__What is a toy?__**\nToys are collectable items that you can obtain from opening presents on the day of the celebration! (<t:1640401200>)\n\n**__How do you collect toys?__**\nYou can open then with the /unwrap command! Make sure it is past <t:1640401200> though!\n\n**__What do toys do?__**\nThink of toys as digital collectables that build up points. They drive up your value which makes you get the number one spot on the server!\n\n**__What is in each type of toys are there?__**\nThere are **Common, Uncommon, Rare and Epic** toys in regular presents. **Lucky** Toys in Lucky presents and **Glitched** Toys in Glitched Presents.\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'coal') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Coal   📙')
				.setDescription('⠀\n**__What is coal?__**\nCoal are toys that are in the dull rarity. They can add negative value to your overall score!\n\n**__How do I receive coal?__**\nYou can get coal by guessing the wrong present on present messages or using the /collectcoal command.\n\n**__Are there different types of coal?__**\nYes there are! Depending on the present you can get either regular coal, lucky coal or glitched coal which can add more negative value to your score based on their type.\n\n**__What can I do with coal?__**\nNo one likes coal and wants to get rid of it so you can do either one of two things! Firstly you can chuck coal at others using ***/chuck*** but **ONLY** regular coal. Lucky coal and Glitched coal are too heavy to throw. Otherwise you can recycle coal using the ***/recycle*** command. It\'ll take any glitched coal first then lucky then regular coal. This way anyone can get rid of any mistakes and have fun along the way!\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'value') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Values   📙')
				.setDescription('⠀\n**__What is a value?__**\nA value is the worth of someone\'s presents and toys mashed together.\n\n**__How is a value calculated?__**\n__For Presents__\nRegular Presents are worth **1 point**\nLucky Presents are worth **2 points**\nGlitched Presents are worth **3 points**\n\n__For Toys__\nCommon Toys are worth **1 point**\nUncommon Toys are worth **2 points**\nRare Toys are worth **3 points**\nEpic Toys are worth **4 points**\nLucky Toys are worth **5 points**\nGlitched Toys are worth **10 points**\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'giving') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Giving   📙')
				.setDescription('⠀\n**__What is giving?__**\nGiving is a command that allows you to give presents you collect to other people on the server!\n\n**__Can I gift toys to other people?__**\nNo. Only presents are able to be gifted. You wouldn\'t want other people giving away their unwrapped gifts wouldn\'t you?**__Why can\'t I give away *gifted* presents?__**\nYou are only allowed to give away collected presents. You wouldn\'t want presents you give someone to be given away to someone else wouldn\'t you?\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'profile') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Profile Commands   📙')
				.setDescription('⠀\n**__What is profile commands?__**\nProfile Commands are commands you can use to see stats about your time with this bot!\n\n**__What can they do?__**\n\n**/sack** - This commands allows you to view your sack of presents and other people\'s sack of presents!\n\n**/toybox** - This commands allows you to view your toybox of toys and other people\'s toybox of toys!\n\n**/card** - This command displays a card of overall stats of yourself or anyone else on the server.\n\n**/leaderboard** - This commands displays a leaderboard of the top 100 winterfesters on your server! (This excludes people with empty sacks and empty toyboxes.)\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'setting') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Setting Commands   📙')
				.setDescription('⠀\n**__What is setting commands?__**\nSetting Commands are commands that allow server moderators to customize the bot for the most balanced experience! (You need to have Manage Channel Perms in order to use these commands)\n\n**__What can they do?__**\n\n**/settings** - You can change how frequently the present message appears by changing the interval of how long it takes and how many messages the chat needs to send.\nYou can also change how many people can get presents from each message and if it can spawn from channels outside the dedicated one! (Ex: #off-topic can spawn messages in #channel-target)\n\n**/setchannel** - Set the channel you want the messages to appear in.\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'info') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Information Commands   📙')
				.setDescription('⠀\n**__What is information commands?__**\nInformation Commands are commands that show details about the bot and allow people to access credits and more!\n\n**__What can they do?__**\n\n**/help** - Your all in one guide!\n\n**/about** - Shows the people who made this bot happen and special thanks!\n\n**/server_stats** - Shows the statistics of your server!\n\n**/invite** - Want to invite the bot to your server? Use this command!\n\n**/donate** - Help fund the development for more seasonal bots!\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		}
	},
};