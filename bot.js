
var config = require('./config.json');

var Discord = require('discord.js');
var client = new Discord.Client();

function usage(message) {
	message.reply('Usage: `.color #aabbcc`');
}

client.on('ready', function() {
	console.log('Bot ready');
});

client.on('message', function(message) {
	if (!message.guild)
		return;

	if (message.content.startsWith('.color')) {
		console.log(message.content);

		var color = message.content.split(' ');
		if (color.length != 2) {
			usage(message);
			return;
		}

		// Match to test if a string is a hex color with six digits
		var regex = /#?([0-9a-fA-F]{6})/;

		// Just get the expected color code
		color = color[1];
		var hex = color.match(regex);
		if (null === hex) {
			usage(message);
			return;
		}


		var member = message.member;
		if (member) {
			// Remove previous color role if one exists
			var remove = null;
			member.roles.array().forEach(function(role) {
				if (regex.test(role.name)) {
					remove = role;
				}
			});

			if (remove !== null) {
				member.removeRole(remove);
			}

			// Find a role matching the new color
			var toAdd = null;
			message.guild.roles.array().forEach(function(role) {
				if (role.name == hex[1]) {
					toAdd = role;
				}
			});

			if (toAdd === null) {
				message.guild.createRole({
					name : hex[1],
					color : hex[1]
				}).then(function(role) {
					member.addRole(role);
				});
			}
			else {
				member.addRole(toAdd);
			}
		}
	}
});

client.login(config.discord_token);
