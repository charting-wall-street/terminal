import {ChartModel} from "../_types/charts"
import {canDisplayTransitions} from "../_components/MarketChart/fetcher/axis"

export const getIndicatorBlock = (chart: ChartModel, block: number, uid: string) => {
    const bufferId = `${chart.symbol}:${uid}`
    return chart.data.indicator[bufferId]?.[block]
}

export const getTIndicatorBlock = (chart: ChartModel, block: number, uid: string) => {
    const bufferId = `${chart.symbol}:${uid}`
    return chart.data.tindicator[bufferId]?.[block]
}


interface ChartBlockProperties {
    transition: boolean
    exists: boolean
    interval: number
    startTime: number
    leftIndex: number
    rightIndex: number
    stretch: number
}

export const getBlockProps = (chart: ChartModel, block: number): ChartBlockProperties => {
    let transition = false
    let exists = true
    if (chart.showTransitions && canDisplayTransitions(chart)) {
        transition = true
        if (chart.data.transitions[block] === undefined) exists = false
    } else {
        if (chart.data.buffer[block] === undefined) exists = false
    }
    const interval = transition ? chart.resolution : chart.interval
    const startTime = 5000 * block * interval
    const timeRange = chart.time.visibleRange
    const leftIndex = Math.max(0, Math.floor((timeRange.lower - startTime) / interval))
    const rightIndex = Math.min(5000, Math.ceil((timeRange.upper - startTime) / interval))
    const stretch = chart.dimensions.width / ((timeRange.upper - timeRange.lower) / interval) / 6.0
    return {
        transition,
        exists,
        interval,
        startTime,
        leftIndex,
        rightIndex,
        stretch,
    }
}

export const projectToPrice = (yy: number, chart: ChartModel): number => {
    const priceRange = chart.price.visibleRange
    const span = priceRange.upper - priceRange.lower
    return chart.dimensions.height - (yy - priceRange.lower) / span * chart.dimensions.height
}
