import {ChartRenderFunction} from "./types"
import {canDisplayTransitions, getBlocks, getTransitionBlocks, priceTicksList, timeTicksList} from "../fetcher/axis"
import {AXIS_COLOR} from "../../../_styles/colors"
import {drawCandles} from "./candles"
import {calcIndicators, drawIndicators, drawIndicatorUI} from "./indicators"
import {drawScenario} from "./scenario"
import {drawInterface} from "./interface"
import {drawAlgorithm} from "./algorithm"

let frameTimeSamples = 0
let frameTimeTotal = 0
let frameTimeLast = 0

export const drawCandleChart: ChartRenderFunction = (ctx, chart, mev) => {

    ctx.font = "12px Share Tech Mono"

    ctx.clearRect(0, 0, chart.bounds.width, chart.bounds.height)

    const pTicks = priceTicksList(chart)
    pTicks.forEach(t => {
        if (t[0] > chart.dimensions.height) return
        ctx.fillStyle = AXIS_COLOR
        ctx.fillRect(0, t[0], chart.dimensions.width, 1)
    })

    const ticks = timeTicksList(chart)
    ticks.forEach(t => {
        ctx.fillStyle = AXIS_COLOR
        ctx.fillRect(t[0], 0, 1, chart.dimensions.height)
    })

    const startRender = new Date()

    let {lowerBlock, upperBlock} = getBlocks(chart)
    if (canDisplayTransitions(chart)) {
        let {lowerBlock: lower, upperBlock: upper} = getTransitionBlocks(chart)
        lowerBlock = lower
        upperBlock = upper
    }

    drawCandles(ctx, chart, lowerBlock)

    if (lowerBlock !== upperBlock) {
        drawCandles(ctx, chart, upperBlock)
    }

    ctx.clearRect(0, chart.bounds.height - chart.panels.count * 75, chart.dimensions.width, 75 * chart.panels.count)

    chart.panels.ranges = {}
    chart.panels.secondaryCount = 0
    calcIndicators(ctx, chart, lowerBlock)
    if (lowerBlock !== upperBlock) {
        calcIndicators(ctx, chart, upperBlock)
    }
    drawIndicators(ctx, chart, lowerBlock)
    if (lowerBlock !== upperBlock) {
        drawIndicators(ctx, chart, upperBlock)
    }
    drawIndicatorUI(ctx, chart, lowerBlock)
    if (lowerBlock !== upperBlock) {
        drawIndicatorUI(ctx, chart, upperBlock)
    }

    drawScenario(ctx, chart, lowerBlock)
    drawAlgorithm(ctx, chart)

    frameTimeTotal += (new Date()).getTime() - startRender.getTime()
    frameTimeSamples++
    if (frameTimeSamples >= 15) {
        frameTimeLast = 1000 / (frameTimeTotal / frameTimeSamples)
        frameTimeSamples = 0
        frameTimeTotal = 0
    }
    chart.frameTime = frameTimeLast

    drawInterface(ctx, chart, mev)

}
