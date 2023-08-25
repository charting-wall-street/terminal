import {FreeDrawArgs} from "./types"
import {AlgorithmEvent, PointAnnotation} from "../../../_types/charts"
import {LONG_LOSS_COLOR, LONG_PROFIT_COLOR, TEXT_COLOR} from "../../../_styles/colors"
import {drawBottom, drawHorizontalMarker, drawTop, drawTriangleDown, drawTriangleUp, drawVerticalMarker} from "./shapes"
import {projectToPrice} from "../../../_helpers/data"

export const drawAlgorithm: FreeDrawArgs = (ctx, chart) => {

    const scenario = chart.data.algorithm
    if (scenario === null) {
        return
    }

    ctx.lineWidth = 2
    ctx.setLineDash([])
    const timeRange = chart.time.visibleRange
    const w = chart.dimensions.width / ((timeRange.upper - timeRange.lower) / chart.interval) / 6.0

    const plotPoint = (point: AlgorithmEvent | PointAnnotation) => {

        const index = (point.time - timeRange.lower) / chart.interval
        const x = (index * 6 - 3) * w
        const y = projectToPrice(point.price, chart)
        switch (point.color) {
            case "green":
                ctx.fillStyle = LONG_PROFIT_COLOR
                ctx.strokeStyle = LONG_PROFIT_COLOR
                break
            case "red":
                ctx.fillStyle = LONG_LOSS_COLOR
                ctx.strokeStyle = LONG_LOSS_COLOR
                break
            default:
                ctx.fillStyle = TEXT_COLOR
                ctx.strokeStyle = TEXT_COLOR
        }

        switch (point.icon) {
            case "up":
                drawTriangleUp(x, y, w, ctx)
                break
            case "down":
                drawTriangleDown(x, y, w, ctx)
                break
            case "h":
                drawHorizontalMarker(x, y, w, ctx)
                break
            case "v":
                drawVerticalMarker(x, y, w, ctx)
                break
            case "top":
                drawTop(x, y, w, ctx)
                break
            case "bottom":
                drawBottom(x, y, w, ctx)
                break
            default:
                drawHorizontalMarker(x, y, w, ctx)
                break
        }
    }

    scenario.events.forEach((event: AlgorithmEvent) => {

        const o = 3 * w

        if (event.annotations !== null) {

            event.annotations.segments.forEach(line => {

                const isVisible = line.timeEnd < timeRange.lower || line.timeFrom > timeRange.upper
                if (isVisible && line.style.indexOf("line") === -1)
                    return

                const i1 = (line.timeFrom - timeRange.lower) / chart.interval
                const i2 = (line.timeEnd - timeRange.lower) / chart.interval + 1
                const y1 = projectToPrice(line.priceBegin, chart)
                const y2 = projectToPrice(line.priceEnd, chart)
                const x1 = (i1 * 6 - 3) * w
                const x2 = (i2 * 6 - 3) * w

                switch (line.style) {
                    case "region":
                        ctx.fillStyle = line.color
                        ctx.strokeStyle = line.color
                        ctx.beginPath()
                        ctx.moveTo(x1, y1)
                        ctx.lineTo(x2, y1)
                        ctx.lineTo(x2, y2)
                        ctx.lineTo(x1, y2)
                        ctx.moveTo(x1, y1)
                        ctx.globalAlpha = 0.2
                        ctx.fill()
                        ctx.globalAlpha = 1
                        break
                    case "solid-segment":
                        ctx.strokeStyle = line.color
                        ctx.beginPath()
                        ctx.moveTo(x1, y1)
                        ctx.lineTo(x2, y2)
                        ctx.globalAlpha = 0.2
                        ctx.stroke()
                        ctx.globalAlpha = 1
                        break
                    case "solid-line":
                        const slope = (y2 - y1) / (x2 - x1)
                        const b = y1 - slope * x1
                        ctx.strokeStyle = line.color
                        ctx.beginPath()
                        ctx.moveTo(0, b)
                        const r = chart.dimensions.width
                        ctx.lineTo(r, slope * r + b)
                        ctx.globalAlpha = 0.2
                        ctx.stroke()
                        ctx.globalAlpha = 1
                        break
                    default:
                        ctx.strokeStyle = line.color
                        ctx.beginPath()
                        ctx.moveTo(x1, y1)
                        ctx.lineTo(x2, y2)
                        ctx.stroke()


                }
            })

            event.annotations.points.forEach(point => {
                plotPoint(point)
            })
        } else {
            plotPoint(event)
        }


    })

}
