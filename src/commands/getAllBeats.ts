import { Context } from "telegraf"
import { sendBeats } from "./sendBeats"
import { getBeatsData } from "../service/getBeatsData"

export const getAllBeats = async (ctx: Context) => {
    await ctx.reply('Loading your beats...')

    const beats = getBeatsData()

    await sendBeats(beats, ctx)
}