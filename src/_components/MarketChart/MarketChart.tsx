import React, {FC, useEffect, useRef, useState} from "react"
import {ChartModel} from "../../_types/charts"
import PriceAxisChart from "./canvases/PriceAxisChart"
import TimeAxisChart from "./canvases/TimeAxisChart"
import CandleChart from "./canvases/CandleChart"
import {fetcher} from "./fetcher/fetcher"
import {fitPriceAxis} from "./fetcher/axis"
import {useLocalArrayState, useLocalBoolState, useLocalNumberState} from "../../_hooks/localstore"
import "./MarketChart.scss"
import ChartHeader from "./panels/ChartHeader"
import {ChartAction, IndicatorDropDown, IntervalDropDown} from "./panels/DropDowns"
import CommandLine from "./panels/CommandLine"

const secondaryIndicator = ["atr", "dema", "rsi", "atr", "sd", "dsma", "roc", "rocsd", "rocma", "volume", "macd", "rocsa", "obv", "liquid", "obvma"]

const generateChartModel = (asset: string, interval: number, width: number, height: number): ChartModel => {
    const now = new Date()
    return {
        frameTime: 0,
        data: {
            tindicator: {},
            buffer: {},
            transitions: {},
            indicator: {},
            scenario: null,
            algorithm: null,
            lastScenario: "",
            lastAlgorithm: "",
            lastFetch: now.getTime(),
        },
        panels: {
            count: 0,
            indicators: [],
            secondaryCount: 0,
            ranges: {},
        },
        cursor: {
            time: 0,
            price: 0,
            x: 0,
            y: 0,
            show: false,
        },
        indicators: [],
        showCandles: true,
        showTransitions: false,
        scenario: "",
        algorithm: "",
        dimensions: {
            width: width,
            height: height,
        },
        bounds: {
            width: width,
            height: height,
        },
        price: {
            auto: true,
            visibleRange: {
                lower: 0,
                upper: 1,
            },
        },
        time: {
            visibleRange: {
                lower: now.getTime() / 1000 - interval * 150,
                upper: now.getTime() / 1000 + interval * 50,
            },
        },
        interval: interval,
        symbol: asset,
        resolution: 60 * 60 * 24,
    }
}

interface ChartProps {
    asset: string
    interval: number
    indicators: string[]
    showCandles: boolean
    showTransitions?: boolean
    scenario: string
    algorithm: string
    highlight: number
    width: number
    height: number
}

const ChartContainer: FC<ChartProps> = ({asset, interval, indicators, showCandles, ...p}) => {
    const intervalId = useRef<any>()
    const chart = useRef<ChartModel>(generateChartModel(asset, interval, p.width, p.height))

    useEffect(() => {
        const timeRange = chart.current.time.visibleRange
        const delta = (timeRange.upper - timeRange.lower) / chart.current.interval
        const c = generateChartModel(asset, interval, p.width, p.height)
        c.time.visibleRange.upper = timeRange.upper
        c.time.visibleRange.lower = timeRange.upper - delta * c.interval
        c.indicators = indicators
        indicators.forEach(ind => {
            const name = ind.split(":")[0]
            if (secondaryIndicator.includes(name) && !c.panels.indicators.includes(name)) {
                c.panels.indicators.push(name)
                c.panels.count++
            }
        })
        c.dimensions.height = c.bounds.height - 75 * c.panels.count
        c.scenario = p.scenario
        c.algorithm = p.algorithm
        c.showTransitions = p.showTransitions || false
        c.showCandles = showCandles
        chart.current = c
    }, [interval])

    useEffect(() => {
        chart.current.data.indicator = {}
        chart.current.data.buffer = {}
        chart.current.data.transitions = {}
        chart.current.data.tindicator = {}
        chart.current.symbol = asset
    }, [asset])

    useEffect(() => {
        const c = chart.current
        c.indicators = indicators
        c.panels.indicators = []
        c.panels.count = 0
        indicators.forEach(ind => {
            const name = ind.split(":")[0]
            if (secondaryIndicator.includes(name) && !c.panels.indicators.includes(name)) {
                c.panels.indicators.push(name)
                c.panels.count++
            }
        })
        c.dimensions.height = c.bounds.height - 75 * c.panels.count
    }, [indicators])

    useEffect(() => {
        chart.current.showCandles = showCandles
    }, [showCandles])

    useEffect(() => {
        chart.current.showTransitions = p.showTransitions || false
    }, [p.showTransitions])

    useEffect(() => {
        chart.current.scenario = p.scenario
    }, [p.scenario])

    useEffect(() => {
        chart.current.algorithm = p.algorithm
    }, [p.algorithm])

    useEffect(() => {
        chart.current.bounds.width = p.width
        chart.current.bounds.height = p.height
        chart.current.dimensions.height = chart.current.bounds.height - 75 * chart.current.panels.count
        chart.current.dimensions.width = chart.current.bounds.width
    }, [p.width, p.height])

    useEffect(() => {
        if (p.highlight === 0) return
        const timeRange = chart.current.time.visibleRange
        const delta = timeRange.upper - timeRange.lower
        timeRange.lower = Math.round(p.highlight - delta / 2)
        timeRange.upper = Math.round(p.highlight + delta / 2)
        fitPriceAxis(chart.current)
    }, [p.highlight])

    useEffect(() => {
        intervalId.current = setInterval(() => fetcher(chart.current), 250)
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current)
            }
        }
    }, [])

    return (
        <table cellSpacing={0} cellPadding={0}>
            <tbody>
            <tr>
                <td><CandleChart width={p.width} height={p.height} chart={chart}/></td>
                <td><PriceAxisChart width={p.width} height={p.height} chart={chart}/></td>
            </tr>
            <tr>
                <td><TimeAxisChart width={p.width} height={p.height} chart={chart}/></td>
            </tr>
            </tbody>
        </table>
    )
}

interface Props {
    scenarioId?: string
    algorithmId?: string
    highlight?: number
    width: number
    height: number
    symbol?: string
}

const MarketChart: FC<Props> = ({scenarioId, algorithmId, highlight, ...p}) => {

    const [interval, setInterval] = useState<number>(60)
    const [indicators, setIndicators] = useState<string[]>([])
    const [showCandles, setShowCandles] = useState<boolean>(true)
    const [showTransitions, setShowTransitions] = useState<boolean>(false)

    useLocalArrayState(setIndicators, indicators, "chartIndicators")
    useLocalNumberState(setInterval, interval, "chartInterval")
    useLocalBoolState(setShowCandles, showCandles, "chartShowCandles")
    useLocalBoolState(setShowTransitions, showTransitions, "chartShowTransitions")

    if (!p.symbol) return null

    return (
        <div id={"marketChart"}>
            <ChartHeader>
                <IntervalDropDown setInterval={setInterval} interval={interval}/>
                <IndicatorDropDown setSelected={setIndicators} selected={indicators}/>
                <ChartAction
                    onClick={() => setShowCandles(p => !p)}
                    label={"Candles"}
                    active={showCandles}
                />
                <ChartAction
                    onClick={() => setShowTransitions(p => !p)}
                    label={"Transitions"}
                    active={showTransitions}
                />
                <ChartAction
                    onClick={() => setIndicators([])}
                    label={"Clear"}
                />
            </ChartHeader>
            <div className="chart-horizontal">
                <ChartContainer
                    asset={p.symbol}
                    interval={interval}
                    indicators={indicators}
                    showCandles={showCandles}
                    showTransitions={showTransitions}
                    scenario={scenarioId || ""}
                    algorithm={algorithmId || ""}
                    highlight={highlight || 0}
                    width={p.width}
                    height={p.height}
                />
            </div>
            <CommandLine
                setIndicators={setIndicators}
                indicators={indicators}
            />
        </div>
    )
}

export default MarketChart
