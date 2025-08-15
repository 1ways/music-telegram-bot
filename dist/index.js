"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const getBeatsData_1 = require("./service/getBeatsData");
const node_fs_1 = require("node:fs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => ctx.reply('Welcome 🎵\n\nSend an audio file or select any of the following commands:', telegraf_1.Markup.inlineKeyboard([
    telegraf_1.Markup.button.callback('🔍 Search', 'SEARCH'),
    telegraf_1.Markup.button.callback('🎵 Beats', 'GET_BEATS')
])));
bot.action('SEARCH', async (ctx) => {
    // This code runs when the user clicks the "Show Beats" button
    await ctx.answerCbQuery(); // Acknowledge the button click (removes loading state)
    await ctx.reply('Search...');
    // You can send files, messages, etc. here
});
bot.on('audio', async (ctx) => {
    const fileId = ctx.message.audio.file_id;
    const fileName = ctx.message.audio.file_name;
    // Get the beats data
    const beatsData = (0, getBeatsData_1.getBeatsData)();
    console.log(beatsData);
    if (!Array.isArray(beatsData)) {
        ctx.reply('Failed to load beats data');
        return;
    }
    // Add the beat to the data
    const content = [
        ...beatsData,
        {
            fileId: fileId,
            name: fileName
        }
    ];
    (0, node_fs_1.writeFile)('./data/beats.json', JSON.stringify(content), err => {
        if (err) {
            ctx.reply('Failed to upload your beat');
        }
        else {
            ctx.reply('Beat added successfully ✅');
        }
    });
});
bot.launch();
console.log('Bot is running...');
