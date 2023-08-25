import {canDisplayTransitions} from "../fetcher/axis"
import {ChartRenderFunction} from "./types"

export const drawInterface: ChartRenderFunction = (ctx, chart, mev) => {


    ctx.font = "12px Share Tech Mono"
    const debugInfo: [string, string][] = []

    if (chart.frameTime < 30) {
        debugInfo.push([
            `${(chart.frameTime).toFixed(0)} FPS`,
            "orange",
        ])
    }

    if (chart.showTransitions) {
        debugInfo.push([
            `Transitions: ${canDisplayTransitions(chart) ? "Yes" : "Too far"}`,
            "white",
        ])
    }

    ctx.textAlign = "right"
    debugInfo.forEach(([msg, color], i) => {
        ctx.fillStyle = color
        ctx.fillText(msg, chart.dimensions.width - 10, 20 + i * 16)
    })

    // show cursor axis
    if (chart.cursor.show) {
        ctx.setLineDash([5])
        ctx.lineWidth = 1
        ctx.strokeStyle = "rgba(200,200,200)"

        // horizontal line
        ctx.beginPath()
        ctx.moveTo(0, chart.cursor.y)
        ctx.lineTo(chart.bounds.width, chart.cursor.y)
        ctx.stroke()

        // vertical line
        ctx.beginPath()
        ctx.moveTo(chart.cursor.x, 0)
        ctx.lineTo(chart.cursor.x, chart.bounds.height)
        ctx.stroke()

    }

}
