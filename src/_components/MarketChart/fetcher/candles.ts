import {ChartModel, SegmentContainer} from "../../../_types/charts"
import {currentBlock, fitPriceAxis, getBlocks} from "./axis"
import ky from "ky"
import {KIO_URL} from "../../../_helpers/env"

const MARKET_URL = `${KIO_URL}/market`

let fetching = false

export const runCandleFetcher = (chart: ChartModel) => {
    if (fetching) return
    const {lowerBlock, upperBlock} = getBlocks(chart)
    if (fetchBlockSafely(chart, lowerBlock)) return
    if (lowerBlock === upperBlock) return
    fetchBlockSafely(chart, upperBlock)
}

const fetchBlockSafely = (chart: ChartModel, block: number): boolean => {
    const buffer = chart.data.buffer[block]
    if (buffer === undefined) {
        fetchCandlesBlock(chart, block)
        return true
    } else if (!buffer.complete) {
        // return fetchBlockRefresh(chart, block)
    }
    return false
}

const fetchBlockRefresh = (chart: ChartModel, blockNumber: number): boolean => {
    const elapsed = (new Date()).getTime() / 1000 - chart.data.lastFetch
    if (elapsed > 30) {
        fetchCandlesBlock(chart, blockNumber)
        return true
    }
    return false
}

const fetchCandlesBlock = (chart: ChartModel, blockNumber: number) => {

    // get current block based on chart interval
    const blockNow = currentBlock(chart)

    // do not fetch blocks from the future or when existing request is busy
    if (blockNow < blockNumber || fetching) return

    // start fetching
    fetching = true
    ky.get(`${MARKET_URL}/${chart.symbol}?segment=${blockNumber}&interval=${chart.interval}`).json<SegmentContainer>()
        .then(results => {
            chart.data.buffer[blockNumber] = results
            fitPriceAxis(chart)
        })
        .catch(err => console.log(err))
        .finally(() => {
            fetching = false
            chart.data.lastFetch = (new Date()).getTime() / 1000
        })
}
