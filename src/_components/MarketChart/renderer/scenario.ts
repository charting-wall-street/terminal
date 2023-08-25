import {
    LONG_ENTRY_COLOR,
    LONG_LOSS_COLOR,
    LONG_PROFIT_COLOR, SHORT_ENTRY_COLOR,
    SHORT_LOSS_COLOR,
    SHORT_PROFIT_COLOR,
} from "../../../_styles/colors"
import {CandleDrawArgs} from "./types"
import {drawCross, drawTriangleDown, drawTriangleUp} from "./shapes"
import {projectToPrice} from "../../../_helpers/data"

export const drawScenario: CandleDrawArgs = (ctx, chart, block) => {

    const scenario = chart.data.scenario
    if (scenario === null || chart.scenario.indexOf(chart.symbol) === -1) {
        return
    }
    if (scenario.segments === undefined) {
        return
    }

    ctx.lineWidth = 2
    ctx.setLineDash([])
    const timeRange = chart.time.visibleRange
    const w = chart.dimensions.width / ((timeRange.upper - timeRange.lower) / chart.interval) / 6.0
    let visible = false
    for (let i = 0; i < scenario.segments.length; i++) {

        const segment = scenario.segments[i]
        const relativeStart = segment.meta.startBlock * 60 * 5000
        const relativeEnd = segment.meta.endBlock * 60 * 5000

        // skip segments outside of viewport
        if (relativeStart > timeRange.upper) {
            continue
        }
        if (relativeEnd < timeRange.lower) {
            continue
        }

        // draw segment start and end
        const segmentStartX = (segment.meta.startBlock * 60 * 5000 - timeRange.lower) / chart.interval * 6 * w
        const segmentEndX = (segment.meta.endBlock * 60 * 5000 - timeRange.lower) / chart.interval * 6 * w

        // bracket lines
        ctx.textAlign = "left"
        ctx.strokeStyle = "rgba(114,154,183,0.23)"
        ctx.beginPath()
        ctx.moveTo(segmentStartX, 0)
        ctx.lineTo(segmentStartX, chart.dimensions.height)
        ctx.moveTo(segmentEndX, 0)
        ctx.lineTo(segmentEndX, chart.dimensions.height)
        ctx.stroke()

        // segment label
        ctx.fillStyle = "#3c6382"
        if (!visible) {
            ctx.fillText(`S${i + 1}`, 8, chart.dimensions.height - 8)
            visible = true
        } else {
            ctx.fillText(`S${i + 1}`, segmentStartX + 8, chart.dimensions.height - 8)
        }

        // plot trades if any
        if (segment.trades === null) continue
        for (let i = 0; i < segment.trades.length; i++) {
            const trade = segment.trades[i]
            if (trade.timeStamp > timeRange.upper) {
                continue
            }
            if (trade.timeStamp < timeRange.lower) {
                continue
            }

            const index = (trade.timeStamp - timeRange.lower) / chart.interval
            const x = (index * 6 - 3) * w
            const y = projectToPrice(trade.price, chart)
            const o = 3 * w

            if (trade.hedge === "LONG") {
                if (trade.side === "BUY") {
                    ctx.fillStyle = LONG_ENTRY_COLOR
                    ctx.strokeStyle = LONG_ENTRY_COLOR
                    drawCross(x, y, w, ctx)
                } else {
                    if (trade.realized + trade.fees >= 0) {
                        ctx.fillStyle = LONG_PROFIT_COLOR
                        ctx.strokeStyle = LONG_PROFIT_COLOR
                        drawTriangleUp(x, y, w, ctx)
                    } else {
                        ctx.fillStyle = LONG_LOSS_COLOR
                        ctx.strokeStyle = LONG_LOSS_COLOR
                        drawTriangleDown(x, y, w, ctx)
                    }
                }
            } else {
                if (trade.side === "BUY") {
                    if (trade.realized + trade.fees >= 0) {
                        ctx.fillStyle = SHORT_PROFIT_COLOR
                        ctx.strokeStyle = SHORT_PROFIT_COLOR
                        drawTriangleUp(x, y, w, ctx)
                    } else {
                        ctx.fillStyle = SHORT_LOSS_COLOR
                        ctx.strokeStyle = SHORT_LOSS_COLOR
                        drawTriangleDown(x, y, w, ctx)
                    }
                    drawCross(x, y, w, ctx)
                } else {
                    ctx.fillStyle = SHORT_ENTRY_COLOR
                    ctx.strokeStyle = SHORT_ENTRY_COLOR
                    drawCross(x, y, w, ctx)
                }
            }

            ctx.fillRect(o + x - 2, chart.dimensions.height - 2, 4, 2)

            let r = Math.min(20, Math.max(4, 4 * w))
            if (w > 4) {
                ctx.beginPath()
                ctx.moveTo(o + x - r, y)
                ctx.lineTo(o + x + r, y)
                ctx.stroke()
            }

        }

    }

}
