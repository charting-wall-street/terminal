import {ChartModel, SegmentContainer} from "../../../_types/charts"
import {canDisplayTransitions, currentTransitionBlock, fitPriceAxis, getTransitionBlocks} from "./axis"
import ky from "ky"
import {KIO_URL} from "../../../_helpers/env"

const MARKET_URL = `${KIO_URL}/market`

let fetching = false

export const runTransitionFetcher = (chart: ChartModel) => {
    if (fetching) return
    if (!chart.showTransitions) return
    if (!canDisplayTransitions(chart)) return
    const {lowerBlock, upperBlock} = getTransitionBlocks(chart)
    if (fetchBlockSafely(chart, lowerBlock)) return
    if (lowerBlock === upperBlock) return
    fetchBlockSafely(chart, upperBlock)
}

const fetchBlockSafely = (chart: ChartModel, block: number): boolean => {
    const buffer = chart.data.transitions[block]
    if (buffer === undefined) {
        fetchTransitionBlock(chart, block)
        return true
    }
    return false
}

const fetchTransitionBlock = (chart: ChartModel, blockNumber: number) => {

    // get current block based on chart interval
    const blockNow = currentTransitionBlock(chart)

    // do not fetch blocks from the future or when existing request is busy
    if (blockNow < blockNumber || fetching) return

    // start fetching
    fetching = true
    ky.get(`${MARKET_URL}/t/${chart.symbol}?segment=${blockNumber}&resolution=${chart.resolution}&interval=${chart.interval}`).json<SegmentContainer>()
        .then(results => {
            chart.data.transitions[blockNumber] = results
            fitPriceAxis(chart)
        })
        .catch(err => console.log(err))
        .finally(() => {
            fetching = false
            chart.data.lastFetch = (new Date()).getTime() / 1000
        })
}
