const Discordjs = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const superagent = require('superagent');

const bot = new Discordjs.Client({ intents: [Discordjs.Intents.FLAGS.GUILDS, Discordjs.Intents.FLAGS.GUILD_MESSAGES] })

bot.login(process.env['token'])

console.log("Starting Bot")

bot.on("ready", () => {

    console.log(`Logged in as ${bot.user.username}`)
    commands = [
        new SlashCommandBuilder()
            .setName('waifu')
            .setDescription('Get a waifu Picture')
            .addStringOption(option =>
                option.setName('category')
                    .setDescription('The gif category')
                    .setRequired(true)
                    .addChoice('Waifu', 'waifu')
                    .addChoice('Maid', 'maid')),

        new SlashCommandBuilder()
            .setName('waifunsfw')
            .setDescription('Get a NSFW waifu Picture')
            .addStringOption(option =>
                option.setName('category')
                    .setDescription('The gif category')
                    .setRequired(true)
                    .addChoice('Ass', 'ass')
                    .addChoice('Ero', 'ero')
                    .addChoice('Hentai', 'hentai')
                    .addChoice('Maid', 'maid')
                    .addChoice('Milf', 'milf')
                    .addChoice('Oppai', 'oppai')
                    .addChoice('Oral', 'oral')
                    .addChoice('Paizuri', 'paizuri')
                    .addChoice('Selfies', 'selfies')
                    .addChoice('Uniform', 'uniform')
                    .addChoice('Ecchi', 'ecchi'))
    ]

    var rest = new REST({ version: '9' }).setToken(bot.token);

    rest.put(Routes.applicationGuildCommands(bot.user.id, '691458137261342760'), { body: commands })
        .then(() => console.log("Commands Reged"))
        .catch((err) => console.error);

})

bot.on('error', err => {

    console.error(err)

})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName == "waifunsfw") {

        var ResJSON = ""

            if(interaction.channel.nsfw == false) {

                interaction.reply("Please use this command is a NSFW channel")
                return

            }

            superagent
                .get(`https://api.waifu.im/nsfw/${interaction.options._hoistedOptions[0].value}?gif=false`)
                .end((err, res) => {

                    ResJSON = JSON.parse(res.text)
                    console.log(ResJSON.images[0].name)
                    WaifuName = interaction.options._hoistedOptions[0].value
                    var embed = new Discordjs.MessageEmbed()
                        .setColor(ResJSON.images[0].dominant_color)
                        .setTitle(`${WaifuName.charAt(0).toUpperCase() + WaifuName.slice(1)}!`)
                        .setAuthor({ name: 'Source', iconURL: 'https://freeiconshop.com/wp-content/uploads/edd/link-open-flat.png', url: ResJSON.images[0].source })
                        .setImage(ResJSON.images[0].url)
                        .setTimestamp()
                        .setFooter({ text: 'Images from Waifu.im', iconURL: 'https://waifu.im/favicon.ico' });
                    interaction.reply({ embeds: [embed] })
                });
    }

    if (interaction.commandName == "waifu") {

        var ResJSON =

            superagent
                .get(`https://api.waifu.im/sfw/${interaction.options._hoistedOptions[0].value}?gif=false`)
                .end((err, res) => {

                    ResJSON = JSON.parse(res.text)
                    console.log(ResJSON.images[0].name)
                    WaifuName = interaction.options._hoistedOptions[0].value
                    var embed = new Discordjs.MessageEmbed()
                        .setColor(ResJSON.images[0].dominant_color)
                        .setTitle(`${WaifuName.charAt(0).toUpperCase() + WaifuName.slice(1)}!`)
                        .setAuthor({ name: 'Source', iconURL: 'https://freeiconshop.com/wp-content/uploads/edd/link-open-flat.png', url: ResJSON.images[0].source })
                        .setImage(ResJSON.images[0].url)
                        .setTimestamp()
                        .setFooter({ text: 'Images from Waifu.im', iconURL: 'https://waifu.im/favicon.ico' });


                    interaction.reply({ embeds: [embed] })

                });


    }

});