import {ChartModel} from "../../../_types/charts"
import {currentBlock, getBlocks} from "./axis"
import ky from "ky"
import {INCA_URL} from "../../../_helpers/env"
import {getIndicatorBlock} from "../../../_helpers/data"
import {Mutex} from "async-mutex"

let fetching = false

const INDICATOR_URL = `${INCA_URL}/indicators`
const inProgress: string[] = []
const inLock = new Mutex()


export const runIndicatorFetcher = async (chart: ChartModel) => {
    if (fetching) return
    const {lowerBlock, upperBlock} = getBlocks(chart)
    let ok = await fetchIndicatorSafely(chart, lowerBlock)
    if (ok) return
    if (lowerBlock === upperBlock) return
    await fetchIndicatorSafely(chart, upperBlock)
}

const fetchIndicatorSafely = async (chart: ChartModel, block: number): Promise<boolean> => {
    for (let i = 0; i < chart.indicators.length; i++) {
        const uid = chart.indicators[i]
        const buffer = getIndicatorBlock(chart, block, uid)
        if (buffer === undefined) {
            await fetchIndicatorBlock(chart, block, uid)
        }
    }
    return false
}

const fetchIndicatorBlock = async (chart: ChartModel, block: number, uid: string) => {

    const blockNow = currentBlock(chart)

    const release = await inLock.acquire()
    if (blockNow < block || inProgress.length >= 5 || inProgress.includes(uid)) {
        release()
        return
    }
    inProgress.push(uid)
    release()

    const uidSplit = uid.split(":")
    const ind = uidSplit[0]
    const par = uidSplit[1]
    const symbol = chart.symbol
    const interval = chart.interval
    ky.get(`${INDICATOR_URL}/${ind}?block=${block}&interval=${interval}&symbol=${symbol}&params=${par}`).json<any>()
        .then(results => {
            const bufferId = `${symbol}:${uid}`
            if (!chart.data.indicator[bufferId]) chart.data.indicator[bufferId] = {}
            chart.data.indicator[bufferId][block] = results
        })
        .catch(err => console.log(err))
        .finally(() => {
            inLock.acquire().then(release => {
                const i = inProgress.indexOf(uid)
                if (i !== -1) {
                    inProgress.splice(i, 1)
                }
                release()
            })
        })
}
