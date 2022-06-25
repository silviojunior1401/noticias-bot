const env = require('../.env')
const moment = require('moment')
const { Telegraf } = require('telegraf')
const { default: axios } = require('axios')

const bot = new Telegraf(env.token)

bot.start(async ctx =>{
    const nome = ctx.update.message.from.first_name
    const data_unix = ctx.update.message.date
    let hora = parseInt(moment.unix(data_unix).format("HH"))
    let saudacao = ""
    let mensagem = "Seguem as notícias mais recentes:"
    if ( hora >= 18 ) {
        saudacao = "Boa noite,"
    } else if ( hora >= 12 ) {
        saudacao = "Boa tarde,"
    } else if ( hora >= 5 ) {
        saudacao = "Bom dia,"
    } else {
        saudacao = "Acordado(a) de madrugada? Vai dormir"
    }
    await ctx.replyWithMarkdown(`*${saudacao} ${nome}!*`)
    await ctx.reply(mensagem)

    try {
        const url = `https://newsapi.org/v2/top-headlines?sources=google-news-br&apiKey=${env.api}`
        const res = await axios.get(url)

        for (i in res.data.articles) {
            noticia = res.data.articles[i]
            //console.log(noticia)
            await ctx.replyWithMarkdown(`*${noticia.title}*\n\n_${noticia.description}_\n\n[Notícia](${noticia.url})`)
        }

    } catch(e) {
        console.log(e)
        await ctx.reply('Não foi possível obter as noticias, tente novamente mais tarde')
    }

    await ctx.reply(`Caso queira verificar as notícias novamente, clique em /start`)
})

bot.on('text', ctx => {
    ctx.reply(`Caso queira verificar as notícias, clique em /start`) 
})

bot.startPolling();

console.log('Bot rodando!!')