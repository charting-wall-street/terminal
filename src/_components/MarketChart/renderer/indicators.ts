import {getBlockProps, getIndicatorBlock, getTIndicatorBlock, projectToPrice} from "../../../_helpers/data"
import {BORDER_COLOR, getIndicatorColor} from "../../../_styles/colors"
import {CandleDrawArgs} from "./types"


export const calcIndicators: CandleDrawArgs = (ctx, chart, block) => {

    const {transition, exists, leftIndex, rightIndex} = getBlockProps(chart, block)
    if (!exists) return

    chart.indicators.forEach(uid => {

        const name = uid.split(":")[0]

        const indicator = transition ? getTIndicatorBlock(chart, block, uid) : getIndicatorBlock(chart, block, uid)
        if (indicator === undefined) return

        const values = indicator.series
        const secondary = chart.panels.indicators.includes(name)
        if (!secondary) return

        let maxVal = 0
        let minVal = 1e16
        const sister = chart.panels.ranges[name]
        let secondaryIndex = -1
        if (sister !== undefined) {
            maxVal = sister.upper
            minVal = sister.lower
            secondaryIndex = sister.index
        } else {
            secondaryIndex = chart.panels.secondaryCount
            chart.panels.secondaryCount++
        }

        let exists = false
        for (let key in values) {
            for (let i = leftIndex; i < rightIndex; i++) {
                if (values[key].values[i].m) {
                    continue
                }
                exists = true
                if (values[key].values[i].v > maxVal) {
                    maxVal = values[key].values[i].v
                }
                if (values[key].values[i].v < minVal) {
                    minVal = values[key].values[i].v
                }
            }
        }
        if (!exists) {
            minVal = 0
        }

        chart.panels.ranges[name] = {
            lower: minVal,
            upper: maxVal,
            positive: minVal >= 0,
            index: secondaryIndex,
            bottom: chart.bounds.height - secondaryIndex * 75,
        }
    })

}

export const drawIndicators: CandleDrawArgs = (ctx, chart, block) => {

    const {interval, transition, exists, startTime, leftIndex, rightIndex, stretch} = getBlockProps(chart, block)
    if (!exists) return

    ctx.lineWidth = 1

    chart.indicators.forEach(uid => {

        const indicator = transition ? getTIndicatorBlock(chart, block, uid) : getIndicatorBlock(chart, block, uid)
        const indicatorName = uid.split(":")[0]
        if (indicator === undefined) return

        const timeRange = chart.time.visibleRange

        const values = indicator.series
        const secondary = chart.panels.indicators.includes(indicatorName)

        if (secondary) {
            const {bottom, positive, lower, upper} = chart.panels.ranges[indicatorName]
            ctx.fillStyle = BORDER_COLOR
            ctx.fillRect(0, bottom - 75, chart.dimensions.width, 1)
            if (!positive) {
                ctx.fillRect(0, bottom - (0 - lower) / (upper - lower) * 75, chart.dimensions.width, 1)
            }
        }

        ctx.strokeStyle = getIndicatorColor(uid)

        for (let key in values) {
            ctx.beginPath()

            let firstPoint = true

            for (let i = leftIndex; i < rightIndex; i++) {

                const ind = values[key].values[i]
                const ts = startTime + i * interval

                if (ts > (timeRange.upper + interval)) {
                    break
                }

                if (ind.m) {
                    if (!firstPoint) {
                        ctx.stroke()
                        firstPoint = true
                    }
                    continue
                }

                const index = (ts - timeRange.lower) / interval
                let y = projectToPrice(ind.v, chart)
                if (secondary) {
                    const {bottom, lower, upper} = chart.panels.ranges[indicatorName]
                    y = bottom - 7 - (ind.v - lower) / (upper - lower) * 60
                } else if (y > chart.dimensions.height) {
                    continue
                }
                const x = index * 6 * stretch

                if (firstPoint) {
                    firstPoint = false
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            }
            if (!firstPoint) {
                ctx.stroke()
            }
        }
    })
}


export const drawIndicatorUI: CandleDrawArgs = (ctx, chart, block) => {

    const {interval, transition, exists, startTime} = getBlockProps(chart, block)
    if (!exists) return

    let primaryIndex = 0
    const subIndices: { [key: string]: number } = {}

    chart.indicators.forEach(uid => {

        const indicator = transition ? getTIndicatorBlock(chart, block, uid) : getIndicatorBlock(chart, block, uid)
        const indicatorName = uid.split(":")[0]
        if (indicator === undefined) return

        let subIndex = 0
        if (subIndices[indicatorName] === undefined) {
            subIndices[indicatorName] = 1
        } else {
            subIndex = subIndices[indicatorName]
            subIndices[indicatorName]++
        }

        ctx.font = "12px Share Tech Mono"
        ctx.strokeStyle = getIndicatorColor(uid)

        const values = indicator.series
        const secondary = chart.panels.indicators.includes(indicatorName)

        const hoverIndex = Math.round((chart.cursor.time - startTime) / interval)
        let hoverValues = ""

        if (!secondary) {
            primaryIndex++
        }

        for (let key in values) {
            if (hoverIndex >= 0 && hoverIndex < 5000) {
                const value = values[key].values[hoverIndex]
                if (value.m) {
                    hoverValues += ` ${key}`
                    continue
                }
                let f = value.v
                if (f > 1e10) {
                    f = Math.round(value.v)
                } else {
                    f = parseFloat(value.v.toFixed(20).substring(0, 10))
                }
                hoverValues += ` ${key}: ${f}`
            }
        }

        if (hoverValues.length > 0) {
            ctx.fillStyle = getIndicatorColor(uid)
            ctx.textAlign = "left"
            const uidParts = uid.split(":")
            const label = `${uidParts[0]} (${uidParts[1]}) |${hoverValues}`
            const tw = ctx.measureText(label).width
            if (secondary) {
                const {bottom, lower, upper} = chart.panels.ranges[indicatorName]
                ctx.clearRect(8, bottom - 71 + subIndex * 13, tw + 4, 14)
                ctx.fillText(label, 8, bottom - 60 + subIndex * 13)
                if (subIndex === 0) {
                    ctx.textAlign = "right"
                    ctx.fillText(`${upper.toFixed(3)}`, chart.dimensions.width - 4, bottom - 75 + 14)
                    ctx.fillText(`${lower.toFixed(3)}`, chart.dimensions.width - 4, bottom - 6)
                }
            } else {
                ctx.clearRect(8, 38 + 24 + 20 + 14 * (primaryIndex - 1) - 12, tw + 4, 14)
                ctx.fillText(label, 8, 38 + 24 + 20 + 14 * (primaryIndex - 1))
            }
        }
    })
}
