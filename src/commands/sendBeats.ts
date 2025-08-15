import { Context } from "telegraf"
import { Beat } from "../types/Beat"

export const sendBeats = async (beats: Beat[] | Error, ctx: Context, searchText?: string) => {
    if (!Array.isArray(beats)) {
        return ctx.reply('Failed to load beats')
    }

    if (beats.length === 0) {
        return ctx.reply('Sorry, you have no beats at the moment')
    }

    if (searchText) {
        const filteredBeats = beats.filter(beat => beat.name.includes(searchText))

        if (filteredBeats.length === 0) {
            return ctx.reply(`Can't find anything that contains: ${searchText}`)
        }

        for (const beat of filteredBeats) {
            try {
                await ctx.sendAudio(beat.fileId)
            } catch (error) {
                ctx.reply(`Failed to load ${beat.name}`)
            }
        }
    } else {
        for (const beat of beats) {
            try {
                await ctx.sendAudio(beat.fileId)
            } catch (error) {
                ctx.reply(`Failed to load ${beat.name}`)
            }
        }
    }
}