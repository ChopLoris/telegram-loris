const {Telegraf} = require('telegraf')
const fs = require('fs-extra')
const { spawn } = require('child_process')
const { createReadStream } = require('fs-extra')
const youtubedl = require('youtube-dl')
const gtts = require('node-gtts')('id')
require("dotenv").config()

function unescapeSlashes(str) {
    // add another escaped slash if the string ends with an odd
    // number of escaped slashes which will crash JSON.parse
    let parsedStr = str.replace(/(^|[^\\])(\\\\)*\\$/, "$&\\");
  
    try {
      parsedStr = JSON.parse(`"${parsedStr}"`);
    } catch(e) {
      return str;
    }
    return parsedStr ;
  }


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('paper', (ctx) => {
    fullmsg = ctx.message.text
    splitText = fullmsg.split(" ")
    splitText.shift()
    message = splitText.join(" ")
    if(message.length < 1) return ctx.reply('/paper [TEXT]')
    const added = message.replace(/(\S+\s*){1,8}/g, '$&\n')
    const fixHeight = added.split('\n').slice(0, 25).join('\n')
    spawn('convert', [
        './bahan/magernulis1blom.jpg',
        '-font',
        'Indie-Flower',
        '-size',
        '700x960',
        '-pointsize',
        '25',
        '-interline-spacing',
        '10',
        '-annotate',
        '+170+222',
        fixHeight,
        './bahan/magernulis1udah.jpg'
    ])
    .on('error', () => ctx.reply('Please try again later ...'))
    .on('exit', () => {
        ctx.replyWithPhoto({
            source: fs.createReadStream('./bahan/magernulis1udah.jpg')
        })
        const output = `${ctx.from.username} - ${ctx.message.text} > Done`;
        console.log(output)
    })
})

bot.command('sound', (ctx) => {
    fullmsg = ctx.message.text
    splitText = fullmsg.split(" ")
    splitText.shift()
    message = splitText.join(" ")
    if(message.length < 1) return ctx.reply('/sound [TEXT]')
    gtts.save('./bahan/output.mp3', message, () => {
        ctx.replyWithAudio({
            source: fs.createReadStream('./bahan/output.mp3')
        })
        console.log(`${ctx.from.username} - ${ctx.message.text} > Done`)
    })
})

bot.command('ytmp3', (ctx) => {
    fullmsg = ctx.message.text
    splitText = fullmsg.split(" ")
    splitText.shift()
    message = splitText.join(" ")
    if(message.length < 1) return ctx.reply('/sound [LINK]')
    youtubedl.getInfo(message, [], function(err, info) {
        if (err) throw err
        ctx.replyWithHTML(
            `<b>Title</b>: <i>${info.title}</i>\n`
            +`<b>Description</b>: <i>${info.title}</i>\n`
            +`<b>Format</b>: <i>MP3</i>\n`
            +`<code>Started to download...</code>`
        )
      })
    youtubedl.exec(message, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
        if (err) throw ctx.reply('Sorry, the link cannot be downloaded !')
        last = output[3].split(":")[1].substring(1)
        ctx.replyWithAudio({
            source: last
        })
        fs.unlink(last, function(err){
            if (err) {
                console.log(err)
            }
            console.log(`File ${last} been Deleted`);
        })
        console.log(`${ctx.from.username} - ${ctx.message.text} > Done`)
      })
})

bot.launch()