import React from "react"
import {Statistics, SymbolMeta, TypeCandle} from "./types"


export interface CanvasElementProps {
    chart: React.MutableRefObject<ChartModel>
    width: number
    height: number
}

export interface ChartModel {
    data: {
        buffer: { [key: number]: SegmentContainer }
        transitions: { [key: number]: SegmentContainer }
        indicator: { [name: string]: { [key: number]: IndicatorContainer } }
        tindicator: { [name: string]: { [key: number]: IndicatorContainer } }
        scenario: SymbolResults | null
        algorithm: AlgorithmResults | null
        lastScenario: string
        lastAlgorithm: string
        lastFetch: number
    },
    panels: {
        count: number
        indicators: string[]
        secondaryCount: number
        ranges: {
            [key: string]: {
                upper: number
                lower: number
                positive: boolean
                index: number
                bottom: number
            }
        }
    },
    frameTime: number
    cursor: {
        time: number
        price: number
        x: number
        y: number
        show: boolean
    }
    showTransitions: boolean
    showCandles: boolean
    indicators: string[]
    dimensions: {
        width: number
        height: number
    }
    bounds: {
        width: number
        height: number
    }
    price: {
        auto: boolean
        visibleRange: {
            lower: number
            upper: number
        }
    }
    time: {
        visibleRange: {
            lower: number
            upper: number
        }
    }
    symbol: string
    interval: number
    scenario: string
    algorithm: string
    resolution: number
}

export interface IndicatorValueDefinition {
    v: number
    m: boolean
}

export interface IndicatorValueSet {
    values: IndicatorValueDefinition[]
    continuous: boolean
    kind: string
    axis: string
}

export interface IndicatorContainer {
    series: { [key: string]: IndicatorValueSet }
}

export interface Order {
    id: string
    timeStamp: number
    side: string
    type: string
    hedge: string
    price: number
    amount: number
}

export interface Trade {
    id: string
    timeStamp: number
    side: string
    type: string
    hedge: string
    price: number
    amount: number
    realized: number
    fees: number
    position: number
    entry: number
}

export interface Segment {
    meta: {
        startBlock: number
        endBlock: number
        statistics: Statistics
    }
    orders: Order[]
    trades: Trade[]
}

export interface SymbolResults {
    segments: Segment[]
    meta: SymbolMeta
}

export interface SegmentContainer {
    candles: TypeCandle[]
    complete: boolean
    lastUpdate: number
}

export interface ChartMoveState {
    isMoving: boolean
    mouseDown: boolean
    lastDown: number
}

export interface SegmentAnnotation {
    timeFrom: number
    timeEnd: number
    priceBegin: number
    priceEnd: number
    style: string
    color: string
}

export interface PointAnnotation {
    text: string
    time: number
    price: number
    icon: string
    color: string
}

export interface EventAnnotations {
    points: PointAnnotation[]
    segments: SegmentAnnotation[]
}

export interface AlgorithmEvent {
    createdOn: number
    time: number
    price: number
    label: string
    icon: string
    color: string
    annotations: EventAnnotations | null
}

export interface AlgorithmResults {
    events: AlgorithmEvent[]
    parameters: number[][]
}
