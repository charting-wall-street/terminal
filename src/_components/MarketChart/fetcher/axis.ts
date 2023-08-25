import {ChartModel} from "../../../_types/charts"
import {TypeCandle} from "../../../_types/types"

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const scalePriceAxis = (deltaY: number, chart: ChartModel) => {
    const range = chart.price.visibleRange
    let add = (range.upper - range.lower) * 0.001 * deltaY
    range.lower -= add
    range.upper += add
    chart.price.auto = false
}

export const scaleTimeAxis = (deltaX: number, chart: ChartModel) => {
    const range = chart.time.visibleRange
    let add = (range.upper - range.lower) * 0.001 * deltaX
    let lower = Math.round((range.lower - add))

    // limit expand
    if ((range.upper - lower) / chart.interval > 2000) {
        lower = range.upper - 2000 * chart.interval
    }

    // limit zoom
    if (chart.showTransitions) {
        if ((range.upper - lower) / chart.resolution < 20) {
            lower = range.upper - 20 * chart.resolution
        }
    } else {
        if ((range.upper - lower) / chart.interval < 20) {
            lower = range.upper - 20 * chart.interval
        }
    }

    range.lower = lower
}

export const moveTimeAxis = (deltaX: number, chart: ChartModel) => {
    const range = chart.time.visibleRange
    const timeStep = (range.upper - range.lower) / chart.dimensions.width
    range.lower -= deltaX * timeStep
    range.upper -= deltaX * timeStep
}

export const movePriceAxisManual = (deltaY: number, chart: ChartModel) => {
    const range = chart.price.visibleRange
    const rangeDelta = range.upper - range.lower
    const step = rangeDelta / chart.dimensions.height
    range.lower += deltaY * step
    range.upper += deltaY * step
}

export const movePriceAxis = (deltaY: number, chart: ChartModel) => {
    if (!chart.price.auto) {
        movePriceAxisManual(deltaY, chart)
    } else {
        fitPriceAxis(chart)
    }
}

export const chartTimeScaleFactor = (chart: ChartModel) => {
    const range = chart.time.visibleRange
    return chart.dimensions.width / ((range.upper - range.lower) / chart.interval) / 6.0
}

export const priceTicksList = (chart: ChartModel): [number, string][] => {

    const ticks: [number, string][] = []

    const range = chart.price.visibleRange

    const delta = range.upper - range.lower

    let multiplier = 1

    while (delta * multiplier < 1) {
        multiplier *= 10
    }

    while (delta * multiplier > 10) {
        multiplier /= 10
    }

    let step = 1 / multiplier
    let lower = Math.floor(range.lower * multiplier) / multiplier

    if (delta / step < 4) {
        multiplier *= 4
        step = 1 / multiplier
    } else if (delta / step < 8) {
        multiplier *= 2
        step = 1 / multiplier
    }

    for (let i = 0; i < 20; i++) {
        const v = lower + step * i
        const y = chart.dimensions.height - (v - range.lower) / delta * chart.dimensions.height
        let s = `${parseFloat(v.toFixed(6))}`
        ticks.push([y, s])
        if (v > range.upper) {
            break
        }
    }

    return ticks

}

export const timeTicksList = (chart: ChartModel): [number, string, number][] => {
    const range = chart.time.visibleRange

    const candles = (range.upper - range.lower) / chart.interval

    let jump = 1
    if (candles > 1000) {
        jump = 120
    } else if (candles > 500) {
        jump = 60
    } else if (candles > 100) {
        jump = 20
    } else if (candles > 50) {
        jump = 10
    } else if (candles > 25) {
        jump = 5
    }

    jump *= chart.interval / 60

    let startTick = Math.floor(range.lower / 60 / jump)
    startTick *= jump * 60
    const ticks: [number, string, number][] = []
    for (let i = 0; i < 75; i++) {
        let x = (startTick - range.lower) / (range.upper - range.lower) * chart.bounds.width
        let d = (new Date())
        d.setTime(startTick * 1000)
        let s = d.toISOString().split("T")[1].split(":").slice(0, 2).join(":")
        ticks.push([Math.round(x), s, d.getTime() / 1000])
        if (startTick > range.upper) {
            break
        }
        startTick += 60 * jump
    }
    return ticks
}

export const canDisplayTransitions = (chart: ChartModel) => {
    if (!chart.showTransitions) return false
    const range = chart.time.visibleRange
    const delta = range.upper - range.lower
    return (delta / chart.resolution <= 5000)
}

export const getBlocks = (chart: ChartModel) => {
    const range = chart.time.visibleRange
    const lowerBlock = Math.floor(range.lower / chart.interval / 5000)
    const upperBlock = Math.floor(range.upper / chart.interval / 5000)
    return {lowerBlock, upperBlock}
}

export const getTransitionBlocks = (chart: ChartModel) => {
    const range = chart.time.visibleRange
    const lowerBlock = Math.floor(range.lower / chart.resolution / 5000)
    const upperBlock = Math.floor(range.upper / chart.resolution / 5000)
    return {lowerBlock, upperBlock}
}

export const blockExists = (blockNumber: number, chart: ChartModel): boolean => {
    return chart.data.buffer[blockNumber] !== undefined
}

export const blockToTime = (blockNumber: number, chart: ChartModel): number => {
    return blockNumber * 5000 * chart.interval
}

export const getBlock = (blockNumber: number, chart: ChartModel): TypeCandle[] => {
    return chart.data.buffer[blockNumber].candles
}

export const currentBlock = (chart: ChartModel): number => {
    return Math.floor((new Date()).getTime() / 1000 / chart.interval / 5000)
}

export const currentTransitionBlock = (chart: ChartModel): number => {
    return Math.floor((new Date()).getTime() / 1000 / chart.resolution / 5000)
}

export const fitPriceAxis = (chart: ChartModel) => {
    if (!chart.price.auto) {
        return
    }
    let hasData = false
    const {lowerBlock, upperBlock} = getBlocks(chart)
    const priceRange = chart.price.visibleRange
    const timeRange = chart.time.visibleRange
    let lower = 999999999
    let upper = 0
    if (blockExists(lowerBlock, chart)) {
        const candles = getBlock(lowerBlock, chart)
        let startIndex = Math.floor((timeRange.lower - blockToTime(lowerBlock, chart)) / chart.interval)
        startIndex = Math.max(0, startIndex)
        for (let i = startIndex; i < candles.length; i++) {
            const candle = candles[i]
            if (candle.t > chart.time.visibleRange.upper) break
            if (candle.m) continue
            if (candle.l < lower) lower = candle.l
            if (candle.h > upper) upper = candle.h
            hasData = true
        }
    }
    if (lowerBlock !== upperBlock && blockExists(upperBlock, chart)) {
        const candles = getBlock(upperBlock, chart)
        let startIndex = Math.floor((timeRange.lower - blockToTime(upperBlock, chart)) / chart.interval)
        startIndex = Math.max(0, startIndex)
        for (let i = startIndex; i < candles.length; i++) {
            const candle = candles[i]
            if (candle.t > chart.time.visibleRange.upper) break
            if (candle.m) continue
            if (candle.l < lower) lower = candle.l
            if (candle.h > upper) upper = candle.h
            hasData = true
        }
    }

    if (!hasData) {
        priceRange.lower = 0
        priceRange.upper = 1
    } else {
        const delta = upper - lower
        priceRange.lower = lower - delta * 0.1
        priceRange.upper = upper + delta * 0.2
    }
}
