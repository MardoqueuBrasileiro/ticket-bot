const { Client, MessageEmbed } = require('discord.js');
const {Bot_Token, Bot_Prefix, Mensagen_Ticket, Emoji_Abrir_Ticket, Categoria_Tickets_ID, Cargo_Suporte_ID, Cor_Bot} = require('./config/config.json');
const client = new Client({partials: ["CHANNEL", "REACTION", "MESSAGE"]});
const channels = new Set();
const map = new Map();
client.on("ready", () => {
    console.log("Discord ticket bot foi ligado com sucesso!");
    console.log("");
    console.log("Discord ticket bot - https://github.com/Raggzinn/DC-ticket-bot");
});

client.on('message', async message => {
    if (!message.content.startsWith(Bot_Prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLocaleLowerCase();

    

    if (command === 'msg-ticket') {
        message.channel.send(Mensagen_Ticket).then((m) => {
            m.react(Emoji_Abrir_Ticket).then(() => {
                client.on("messageReactionAdd", async(reaction, user) => {
                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (user.bot) return;
                    if (!reaction.message.guild) return;

                    if (reaction.message.channel.id == message.channel.id) {
                        if (reaction.emoji.name === emoji) {
                                type: 'text',
                                parent: ticket_caotgory_ID,
                                permissionOverwrites: [{
                                    id: user.id,
                                    allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                                }, {
                                    id: reaction.message.guild.roles.cache.find(role => role.name === '@everyone').id,
                                    deny: ['SEND_MESSAGES', "VIEW_CHANNEL"]
                                }, {
                                    id: support_team_role,
                                    allow: ['SEND_MESSAGES', "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                                }].then(c => {
                                map.set(user.id, {
                                    channel: c.id
                                })
                                channels.add(c.id);
                                const openTicket = new MessageEmbed()
                                    .setColor(Cor_Bot)
                                    .setDescription(`O suporte estará com você em breve.
									Para fechar este ticket use o comando **!close**`)
                                c.send(`<@${user.id}> Bem-vindo(a)`, openTicket).then(() => {
                                })
                                reaction.users.remove(user.id);
                            })
                        }
                    }
                })
            })
        })
    }
    if (command === 'close') {
        if (channels.has(message.channel.id)) {

            message.channel.send('Deletando ticket...').then(() => {
                message.channel.delete().then(() => {
                    channels.delete(message.channel.id);
                })
            })
        }
    }

    if (command === 'add') {
        if (!channels.has(message.channel.id)) return console.log('ca')
        if (!message.member.roles.cache.has(support_team_role)) return message.reply('Somente suportes podem usar este comando!');
      const userAdd = args[0];
      
      if (message.guild.roles.cache.get(userAdd)) {
        message.channel.updateOverwrite(userAdd, {
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            VIEW_CHANNEL: true
        })
        message.channel.send(`Eu adicionei **${message.guild.roles.cache.get(userAdd).name}** ao ticket!`)
      } else {
          if(message.guild.members.cache.get(userAdd)) {
            message.channel.createOverwrite(userAdd, {
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
                VIEW_CHANNEL: true
            })
            message.channel.send(`Eu adicionei **${message.guild.members.cache.get(userAdd).user.username}** ao ticket!`)
          }
      }
    }

    if (command === 'remove') {
    
        if (!channels.has(message.channel.id)) return console.log('ca')
        if (!message.member.roles.cache.has(support_team_role)) return message.reply('Somente suportes podem usar este comando!');
      const userAdd = args[0];
      
      if (message.guild.roles.cache.get(userAdd)) {
        message.channel.updateOverwrite(userAdd, {
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false,
            VIEW_CHANNEL: false
        })
        message.channel.send(`Eu removi **${message.guild.roles.cache.get(userAdd).name}** do ticket!`)
      } else {
          if(message.guild.members.cache.get(userAdd)) {
            message.channel.createOverwrite(userAdd, {
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: false,
                VIEW_CHANNEL: false
            })
            message.channel.send(`Eu removi **${message.guild.members.cache.get(userAdd).user.username}** do ticket!`)
          }
      }

    }

    if (command === 'help') {
        const helpEmbed = new MessageEmbed()
            .setColor(Cor_Bot)
            .setTitle('Discord ticket bot')
            .setDescription('Comandos:')
            .addField("`!close` - Fechar um ticket.")
            .addField("`!add` - Adicionar um usuario ao ticket.")
            .addField("`!remove` - Remover um usuario do ticket.")
            .addField("`!id` - Mostra o ID do cargo/canal/usuario mencionado.")
            .addField("`!help` - Mostrar a lista de comandos do bot.")
            .addField("`!msg-ticket` - Enviar a mensagem com a reação para abir ticket.")
            .setFooter("https://github.com/Raggzinn/DC-ticket-bot")

        message.channel.send(helpEmbed)
    }

    if (command === 'rename') {
        if (!channels.has(message.channel.id)) return;
        if (message.member.roles.cache.has(support_team_role)) {
            if (!args.length) return message.channel.send('Nenhum nome foi dado')
            message.channel.setName(args.join(" "))
            message.channel.send(`Renomeou o ticket para: ${args.join(" ")}`)
        }
    }

    if (command === 'id') {
        const { MessageEmbed } = require('discord.js')
        const user = message.mentions.users.last();
        const role = message.mentions.roles.first();
        const channel = message.mentions.channels.first();
        if (!role && !channel && !user) return message.channel.send("Você não mencionou nenhum cargo/canal/usuario")
        if (role) {
            message.channel.send(`ID do <@${role.id}> e ${role.id}`)
        } else {
            if (channel) {
                message.channel.send(`ID do <#${channel.id}> e ${channel.id}`)
            } else {
                if (user) {
                    message.channel.send(" ID do " + user.tag + " e " + user.id)
                }
            }
        }
    }
    
})
 
client.login(Bot_Token);
