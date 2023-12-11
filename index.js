/*---------- discordBot Setting S ----------*/
    
    //기본 설정
    const { Client, Intents, MessageEmbed } = require('discord.js');
    require('dotenv').config();

    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
        partials: ["CHANNEL"]
    });

    client.on('ready', () => {
        console.log(`로그인 된 봇 계정: ${client.user.tag}`);
        client.user.setActivity('슬래시 명령어(/) 지원', { type: 'PLAYING' });
    });

    //슬래시 명령어
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');

    const commands = [
        {
            name: 'enko',
            description: '한글 영타 자동변환 설정을 활성화 또는 비활성화합니다.',
            type: 1,
        },
        {
            name: '자동번역',
            description: '지원하는 언어 자동번역 설정을 활성화 또는 비활성화합니다.',
            type: 1,
        },
        {
            name: '청소',
            description: '메시지를 삭제합니다.',
            options: [
                {
                    name: '숫자',
                    description: '삭제할 메시지의 개수(1~100)를 입력하세요.',
                    type: 4, // 타입: 정수
                    required: true
                }
            ]
        },
        {
            name: '프로필',
            description: '사용자의 프로필 정보를 확인합니다.',
            options: [
                {
                    name: '사용자',
                    description: '프로필을 확인할 사용자를 선택하세요.',
                    type: 6, // 타입: 사용자
                    required: false
                }
            ]
        },
        {
            name: '번역',
            description: '텍스트를 다른 언어로 번역합니다.',
            options: [                
                {
                    name: '텍스트',
                    description: '번역할 텍스트를 입력하세요.',
                    type: 3, // 타입: 문자열
                    required: true
                },{
                    name: '언어',
                    description: '번역될 언어를 입력하세요.',
                    type: 3, // 타입: 문자열
                    required: true
                }
            ]
        }
    ];

    const clientId = process.env.CLIENT_ID;
    const token = process.env.TOKEN;
    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
      try {
        await rest.put(Routes.applicationCommands(clientId), {
          body: commands
        });
        console.log('슬래시 커멘드 적용 성공');
      } catch (error) {
        console.error(error);
      }
    })();
/*---------- discordBot Setting E----------*/

// API 변경으로 인한 챗지피티 미작동
/*---------- openAI(chatGPT) Variable S ----------*/    
    // const { Configuration, OpenAIApi } = require("openai");
    // const configuration = new Configuration({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });
    // const openai = new OpenAIApi(configuration);
/*---------- openAI(chatGPT) Variable E----------*/

/*---------- inko(한글영타변환) Variable S ----------*/
    const inko = new (require("inko").Inko)();
    const senderEnko = new Set();
    function isNotHaveSingle(string) {
      return string.split("").every(char => {
        return (!(char >= "ㄱ" && char <= "ㅢ") || isException(char));
      });
    }
    function isException(char) {
      return char;
    }
/*---------- inko(한글영타변환) Variable E ----------*/

/*---------- nmt(papago) Variable S ----------*/
    const axios = require('axios');
    const senderPapago = new Set();
    let lang={"ko":"한국어","ja":"일본어","zh-CN":"중국어 간체","zh-TW":"중국어 번체","en":"영어","fr":"프랑스어","de":"독일어","ru":"러시아어","es":"스페인어","vi":"베트남어","id":"인도네시아어","th":"태국어"};    //번역어
    function getKeyOrValue(msg) {
        if (lang.hasOwnProperty(msg)) {
            return msg;
        } else {
            for (let key in lang) {
                if (lang[key] == msg) {
                    return key;
                }
            }
        }                                    
        return null;
    }
/*---------- nmt(papago) Variable E ----------*/

client.on('messageCreate', async (message) => { 

    // 사용자에게만 반응
    if (message.author.bot || message.reference) {
        return;
    }

    // 메세지가 이모지일 경우 확대
    if(message.content.match(/^<a?:.+?:\d+>$/)){
        if(message.content.split(":").length == 3){
            await message.delete();
            const emojiId = message.content.split(":")[2].split(">")[0];
            const isAnimated = message.content.includes("<a:");
            const link = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`;  
            const embed = new MessageEmbed()
                .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }), '')
                .setColor(message.member.roles.color?.hexColor || "#4194C3")      
                .setImage(link);
            await message.channel.send({ embeds: [embed] });
        }
        return;

    // 메세지가 이모지가 아닐 경우
    }else{        

        const content = message.content.toLowerCase();
        const prefix = process.env.PREFIX;
        const subPrefix = process.env.SUB_PREFIX;

        // 일반 명령어
        if (content.startsWith(prefix) || content.startsWith(subPrefix)) {
            const args = content.slice(content.startsWith(prefix) ? prefix.length : subPrefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            try{
                
                // enko 일반 명령어
                const enkoCommands = ['eng', 'enko', 'kor', 'ko', 'en'];
                if (enkoCommands.includes(command)) {
                    if (senderEnko.has(message.author.id)) {
                        senderEnko.delete(message.author.id);
                        await message.reply(`${message.author} 한글 영타 자동변환 비활성화`);
                    } else {
                        senderEnko.add(message.author.id);
                        await message.reply(`${message.author} 한글 영타 자동변환 활성화\n(명령어 재입력시 비활성화)`);
                    }
                }

                // API 변경으로 인한 챗지피티 미작동 (추후 수정 필요)
                // const gptCommands = ['gpt', '지피티', 'wlvlxl', '헷'];
                // if (gptCommands.includes(command)) {
                //     await message.channel.sendTyping();
                //     let ConvoLog = [{ role: "system", content: "Discord Chat Bot" }];
                //     let prevMsgs = await message.channel.messages.fetch({ limit: 20 });
                //     prevMsgs.reverse();
                //     prevMsgs.forEach((m) => {
                //         if (m.author.id !== client.user.id && message.author.bot) return;
                //         if (m.author.id !== message.author.id) return;
                //         ConvoLog.push({
                //             role: "user",
                //             content: m.content
                //                 .replace(`${prefix}${command} ${args[0]}`, "")
                //                 .replace(`${subPrefix}${command} ${args[0]}`, ""),
                //         });
                //     });
                //     const response = await openai.createChatCompletion({
                //         model: "gpt-3.5-turbo",
                //         messages: ConvoLog,
                //     });
                //     message.channel.send("[chatGPT] " + response.data.choices[0].message.content);
                // }

            } catch (e) {
                await message.channel.send("오류가 발생하였습니다.\n\n" + e);
            }
        } 

        // 한글 영타 자동 변환
        if (senderEnko.has(message.author.id)) {
            if ((/[a-z]+/).test(message.content)) {
                const refined = inko.en2ko(inko.ko2en(message.content));
                if (isNotHaveSingle(refined) || isException(refined)) {
                    await message.delete();
                    const embed = new MessageEmbed()
                        .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }), '')
                        .setColor(message.member.roles.color?.hexColor || "#4194C3")
                        .setTitle("")
                        .setDescription(refined);
                    await message.channel.send({ embeds: [embed] });
                }
            }
            return;
        }

        // 한글이 아닐경우 자동 번역
        if (senderPapago.has(message.author.id)) {
            if ((/[^ㄱ-ㅎㅏ-ㅣ가-힣]+/).test(message.content)) {
                let encodedText = encodeURIComponent(message.content);
                const response = await axios.post("https://openapi.naver.com/v1/papago/n2mt", `source=auto&target=ko&text=${encodedText}`, {
                    headers: {
                        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                const result = response.data.message.result;
                const embed = new MessageEmbed()
                    .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }), '')
                    .setColor(message.member.roles.color?.hexColor || "#4194C3")
                    .setTitle(lang[result.srcLangType] + " => " + lang[result.tarLangType] + " 자동번역")
                    .setDescription(result.translatedText);
                await message.delete();
                await message.channel.send({ embeds: [embed] });
            }
            return;
        }

    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    if (!interaction.guild) return interaction.reply('개인 메시지(DM)에서는 사용할 수 없습니다.');

    const { commandName, options, member } = interaction;
    
    try {
        
        // 한타
        if (commandName == 'enko') {
            if (senderEnko.has(interaction.user.id)) {
                senderEnko.delete(interaction.user.id);
                await interaction.reply(`${interaction.user} 한글 영타 자동변환 비활성화`);
            } else {
                senderEnko.add(interaction.user.id);
                await interaction.reply(`${interaction.user} 한글 영타 자동변환 활성화\n(명령어 재입력시 비활성화)`);
            }
        }

        // 자동번역
        if (commandName == '자동번역') {
            if (senderPapago.has(interaction.user.id)) {
                senderPapago.delete(interaction.user.id);
                await interaction.reply(`${interaction.user} 자동번역 비활성화`);
            } else {
                senderPapago.add(interaction.user.id);
                await interaction.reply(`${interaction.user} 자동번역 활성화\n(명령어 재입력시 비활성화)`);
            }
        }

        // 채팅청소
        if (commandName == '청소') {
            const amount = options.getInteger('숫자');
            if (amount < 1 || amount > 100) {
                return interaction.reply('1부터 100까지의 숫자만 입력할 수 있습니다.');
            }
            if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
                try {
                    const messages = await interaction.channel.messages.fetch({ limit: amount });
                    const userMessages = messages.filter(msg => msg.author.id == interaction.user.id);

                    if (userMessages.size == 0) {
                        await interaction.reply(`최근 채팅 ${amount}개 중 ${interaction.user} 님의 채팅이 없습니다.`);
                    } else {
                        await interaction.channel.bulkDelete(userMessages);
                        await interaction.reply(`최근 채팅 ${amount}개 중 ${interaction.user} 님의 메시지 ${userMessages.size}개를 삭제했습니다.`);
                    }

                    // 삭제한 후 5초 후에 응답 삭제
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 5000);
                } catch (e) {
                    await interaction.reply(`메시지를 삭제할 수 없습니다.`);
                }
            } else {
                try {
                    await interaction.channel.bulkDelete(amount);
                    await interaction.reply(`${amount}개의 메시지를 삭제했습니다`);

                    // 삭제한 후 5초 후에 응답 삭제
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 5000);
                } catch (e) {
                    await interaction.reply(`메시지를 삭제할 수 없습니다.`);
                }
            }
        }


        // 프로필
        if (commandName == '프로필') {
            const user = options.getUser('사용자') || interaction.user;
            const joinDate = user.createdAt;
            const joinDays = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
            const member = interaction.guild.members.cache.get(user.id);
            const joinGuildDate = member.joinedAt;
            const joinGuildDays = Math.floor((new Date() - joinGuildDate) / (1000 * 60 * 60 * 24));
            const serverName = interaction.guild.name;
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = ('0' + (date.getMonth() + 1)).slice(-2);
                const day = ('0' + date.getDate()).slice(-2);
                const hours = ('0' + date.getHours()).slice(-2);
                const minutes = ('0' + date.getMinutes()).slice(-2);
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            };
            const formattedJoinDate = formatDate(joinDate);
            const formattedJoinGuildDate = formatDate(joinGuildDate);  
            const embed = new MessageEmbed()
                .setAuthor(user.tag)
                .setColor(interaction.member.roles.color?.hexColor || "#4194C3")
                .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addField(`계정 생성`, `${formattedJoinDate}\n(가입한지 ${joinDays}일 째)`, true)
                .addField(`${serverName} 참가`, `${formattedJoinGuildDate}\n(참가한지 ${joinGuildDays}일 째)`, true);

            await interaction.reply({ embeds: [embed] });
        }

        // 번역
        if (commandName == '번역') {
            const targetLanguage = options.getString('언어');
            const text = options.getString('텍스트');

            if (!targetLanguage || !text) {
                return interaction.editReply('언어와 텍스트를 모두 입력해야 합니다.');
            }

            const target = getKeyOrValue(targetLanguage);
            if (!target) {
                return interaction.editReply('번역을 지원하지 않는 언어입니다.');
            }

            await interaction.deferReply({ ephemeral: false }); // 모든 사용자에게 응답 공개
            const encodedText = encodeURIComponent(text);

            try {
                const response = await axios.post("https://openapi.naver.com/v1/papago/n2mt", `source=auto&target=${target}&text=${encodedText}`, {
                    headers: {
                        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                const result = response.data.message.result;
                const embed = new MessageEmbed()
                    .setTitle(lang[result.srcLangType] + " => " + lang[result.tarLangType] + " 번역 결과")
                    .setColor(interaction.member.roles.color?.hexColor || "#4194C3")
                    .setDescription(result.translatedText);
                await interaction.editReply({ embeds: [embed] });
            } catch (e) {
                const embed = new MessageEmbed()
                    .setTitle("번역 오류")
                    .setColor(interaction.member.roles.color?.hexColor || "#4194C3")
                    .setDescription("번역을 지원하지 않는 언어거나,\n텍스트의 언어와 동일한 언어로는 번역할 수 없습니다.");
                await interaction.editReply({ embeds: [embed] });
            }
        }

    } catch (e) {
        await interaction.reply('오류가 발생하였습니다.\n'+e);
    }
});

client.login(token);
