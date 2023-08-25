import {BACKGROUND_COLOR, CANDLE_DOWN, CANDLE_UP} from "../../../_styles/colors"
import {CandleDrawArgs} from "./types"
import {getBlockProps, projectToPrice} from "../../../_helpers/data"

export const drawCandles: CandleDrawArgs = (ctx, chart, block) => {

    if (!chart.showCandles) return

    const {interval, transition, exists, stretch, leftIndex, rightIndex} = getBlockProps(chart, block)
    if (!exists) return

    const candles = transition ? chart.data.transitions[block].candles : chart.data.buffer[block].candles
    const timeRange = chart.time.visibleRange

    // draw block line
    const startTime = 5000 * block * interval
    const blockX = (startTime - timeRange.lower) / interval * 6 * stretch
    ctx.setLineDash([])
    ctx.strokeStyle = "rgba(54,83,128,0.5)"
    ctx.fillStyle = "rgb(54,83,128)"
    ctx.lineWidth = 3
    ctx.textAlign = "left"
    ctx.fillText(`Block ${block}`, blockX + 5, chart.dimensions.height - 8)
    ctx.beginPath()
    ctx.moveTo(blockX - 3 * stretch, 0)
    ctx.lineTo(blockX - 3 * stretch, chart.dimensions.height)
    ctx.stroke()

    // draw candles
    ctx.lineWidth = 1
    for (let i = leftIndex; i < rightIndex; i++) {

        const candle = candles[i]

        if (candle.t > (timeRange.upper + interval)) {
            break
        }

        const openY = projectToPrice(candle.o, chart)
        const closeY = projectToPrice(candle.c, chart)
        const highY = projectToPrice(candle.h, chart)
        const lowY = projectToPrice(candle.l, chart)

        let bottom = openY
        let top = closeY
        let up = false
        if (top < bottom) {
            up = true
            let tmp = top
            top = bottom
            bottom = tmp
            ctx.fillStyle = CANDLE_UP
        } else {
            ctx.fillStyle = CANDLE_DOWN
        }

        const index = (candle.t - timeRange.lower) / interval

        const w = stretch
        if (w > 3) {
            ctx.fillRect((index * 6) * w, lowY, 1, highY - lowY)
            ctx.fillStyle = BACKGROUND_COLOR
            ctx.fillRect((index * 6 - 2.5) * w, bottom, 5 * w, top - bottom)
            ctx.strokeStyle = up ? CANDLE_UP : CANDLE_DOWN
            ctx.strokeRect((index * 6 - 2.5) * w, bottom, 5 * w, top - bottom)
        } else if (w > 0.75) {
            ctx.fillRect((index * 6) * w, lowY, 1, highY - lowY)
            ctx.fillStyle = BACKGROUND_COLOR
            ctx.fillRect((index * 6 - 2) * w, bottom, 4 * w, top - bottom)
            ctx.strokeStyle = up ? CANDLE_UP : CANDLE_DOWN
            ctx.strokeRect((index * 6 - 2) * w, bottom, 4 * w, top - bottom)
        } else {
            ctx.fillRect(Math.round((index * 6 + 2) * w), lowY, 1, highY - lowY)
        }
    }

    const hoverIndex = Math.round((chart.cursor.time - startTime) / interval)
    if (hoverIndex >= 0 && hoverIndex < 5000) {
        ctx.font = "14px Share Tech Mono"
        ctx.textAlign = "left"
        ctx.fillStyle = "white"
        const symbol = chart.symbol.split(":")
        const c = candles[hoverIndex]
        const price = c.m ? "" : `${c.o} ${c.h} ${c.l} ${c.c}`
        ctx.fillText(`${symbol[2]}, ${symbol[0]} (${symbol[1]}) ${price}`, 8, 44+20)
    }

}
