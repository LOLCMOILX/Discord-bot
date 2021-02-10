const Discord = require("discord.js");
const fs = require("fs");
const bdd = require ("./bdd.json");
const token = require ("./token.json");

const bot = new Discord.Client();



bot.on("ready", async () =>{

    let statuts = bdd.stats
    setInterval(function() {
        let stats = statuts[Math.floor(Math.random()*statuts.length)];
        bot.user.setActivity(stats, {type: "PLAYING"})
    }, 10000)
    
    console.log("Le bot est en ligne")
    bot.user.setStatus("online");
    
})

bot.on("message", async message => {

    if(message.author.bot) return;
    //site
    if(message.content.startsWith("d/site")){
        message.channel.send('Vous avez demandé l\'ip du site Deltasia le voici ! : https://deltasiafr.hubside.fr/ ')
    }

    //warn
    if(message.content.startsWith("d/warn")){
        if(message.member.hasPermission('BAN_MEMBERS')){

            message.delete();


            if(!message.mentions.users.first()) return;

            utilisateur = message.mentions.users.first().id

            let arg = message.content.trim().split(/ +/g)

            utilisateur = message.mentions.members.first();
            raison = arg[2];

            if(!utilisateur) {
                return message.channel.send('Vous devez mentionner un utilisateur !');
            }
            else{
                if(!raison){
                    return message.channel.send('Vous devez indiquer une raison du warn !');
                }
            }

            if(bdd["warn"][utilisateur] == 2){

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)
            }
            else{
                if(!bdd["warn"][utilisateur]){
                    bdd["warn"][utilisateur] = 1 
                    Savebdd();
                }
                else{
                    bdd["warn"][utilisateur]++
                    Savebdd();
                }
            }
            const monembed = new Discord.MessageEmbed()
	            .setColor('#0099ff')
	            .setTitle('Avertissements')
	            .setAuthor( utilisateur)
                .setDescription('Raison du warn et nombre de warn du joueur')
	            .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Raison du warn', value: raison },
                    { name: 'Nombre de warn', value: bdd["warn"][utilisateur] },
                    { name: '\u200B', value: '\u200B' },
	            )
	            .setTimestamp()
	            .setFooter('Attention au bout de 3 c\'est le ban !');

            message.channel.send(monembed);
        }
    }

    //bantemp
    if (message.content.startsWith('d/bantemp')) {
        if (message.member.hasPermission('BAN_MEMBERS')) {

            let arg = message.content.trim().split(/ +/g)

            utilisateur = message.mentions.members.first();
            temps = arg[2];
            raison = arg[3];

            if(!utilisateur) {
                return message.channel.send('Vous devez mentionner un utilisateur !');
            }
            else{
                if(!temps || isNaN(temps)){
                    return message.channel.send('Vous devez indiquer un temps en seconde !');

                } else {
                    if(!raison){
                        return message.channel.send('Vous devez indiquer une raison du ban temporaire !');

                    } else{
                        message.guild.members.ban(utilisateur.id);
                        setTimeout(function() {
                            message.guild.members.unban(utilisateur.id)
                        }, temps * 1000)
                    }
                }
                const monembed = new Discord.MessageEmbed()
	            .setColor('#0099ff')
	            .setTitle('Avertissements')
	            .setAuthor( utilisateur, "A banni temporairement ", mentions)
                .setDescription('Raison du warn et nombre de warn du joueur')
	            .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Raison du warn', value: raison },
                    { name: 'Nombre de warn', value: bdd["warn"][utilisateur] },
                    { name: '\u200B', value: '\u200B' },
	            )
	            .setTimestamp()
	            .setFooter('Attention au bout de 3 c\'est le ban !');

            message.channel.send(monembed);   
            }
        }
    }






})



function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur s'est produite");

    });
}








bot.login(token.token);