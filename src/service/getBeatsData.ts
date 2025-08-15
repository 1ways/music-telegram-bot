import { readFileSync } from 'node:fs'
import { Beat } from '../types/Beat'

export const getBeatsData = (): Beat[] | Error => {
    try {
        const data = readFileSync('src/data/beats.json', 'utf8')
        console.log(data)

        return JSON.parse(data)
    } catch (error) {
        return new Error(error instanceof Error ? error.message : String(error))
    }
}