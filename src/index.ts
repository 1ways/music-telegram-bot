import { Telegraf, Markup, Context } from 'telegraf'
import { getBeatsData } from './service/getBeatsData'
import { writeFile } from 'node:fs'
import dotenv from 'dotenv'
import { sendBeats } from './commands/sendBeats'
import { getAllBeats } from './commands/getAllBeats'
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN!)
let isSearching = false

// Show commands when user starts the bot
bot.start(async ctx => {
    await ctx.reply(
        'Welcome 🎵\n\nSend an audio file or select any of the following commands:',
        Markup.inlineKeyboard([
            Markup.button.callback('🔍 Search', 'SEARCH'),
            Markup.button.callback('🎵 Beats', 'GET_BEATS')
        ])
    )

    ctx.reply(
        "Choose an option:",
        Markup.keyboard([
            ['🔍 Search', '🎵 Beats']
        ])
            .resize()
    )
})

// Searching beat logic
bot.action('SEARCH', async (ctx) => {
    await ctx.answerCbQuery()
    ctx.reply('Send any beat name you want to search for:')
})

// Get all beats
bot.action('GET_BEATS', async (ctx) => {
    await ctx.answerCbQuery()
    await getAllBeats(ctx)
})

bot.on('text', async ctx => {
    if (ctx.message.text === '🎵 Beats') {
        await getAllBeats(ctx)
        return
    } else if (ctx.message.text === '🔍 Search') {
        ctx.reply('Send any beat name you want to search for:')
        isSearching = true
        return
    }

    if (isSearching) {
        const beats = getBeatsData()

        const searchText = ctx.message.text.toLowerCase()

        await sendBeats(beats, ctx, searchText)

        isSearching = false
    } else {
        ctx.reply("If you want to search for a beat click the ( 🔍 Search ) button")
    }
})

// When user sends audio file
bot.on('audio', async ctx => {
    const fileId = ctx.message.audio.file_id
    const fileName = ctx.message.audio.file_name

    // Get the beats data
    const beatsData = getBeatsData()

    if (!Array.isArray(beatsData)) {
        ctx.reply('Failed to load beats data')
        return
    }

    // Add the beat to the data
    const content = [
        ...beatsData,
        {
            fileId: fileId,
            name: fileName
        }
    ]

    writeFile('src/data/beats.json', JSON.stringify(content), err => {
        if (err) {
            ctx.reply('Failed to upload your beat')
        } else {
            ctx.reply('Beat added successfully ✅')
        }
    })
})

bot.launch()
console.log('Bot is running...')