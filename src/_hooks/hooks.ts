import ky from "ky"
import {ALGO_URL, ATOMA_URL, INCA_URL, KIO_URL, SIMAR_URL} from "../_helpers/env"
import {
    AlgoDescriptor,
    Automaton,
    BotConfig,
    BotConfigList,
    ExchangeList,
    IndicatorListItem,
    MainMeta,
    MetaPayload,
    QueueItem,
    QueueSummary,
    ScenarioMeta,
    StatisticsCollection,
    SymbolInfo,
    SymbolMeta,
} from "../_types/types"
import {useEffect, useState} from "react"
import {unpackRunId} from "../_helpers/urls"
import {AssetIdentifierToSymbol} from "../_helpers/assets"

type HookState = {
    busy: boolean
    error?: any
}

type SymbolsState = HookState & {
    symbols: string[]
}

export const useSymbols = (): SymbolsState => {
    const {busy, error, assets} = useAssets()
    const [state, setState] = useState<SymbolsState>({busy: true, symbols: []})
    useEffect(() => {
        setState(() => ({busy, error, symbols: assets.map(a => AssetIdentifierToSymbol(a.identifier))}))
    }, [busy, error, assets])
    return state
}

type AssetsState = HookState & {
    assets: SymbolInfo[]
    assetMap: { [key: string]: SymbolInfo }
}

export const useAssets = (): AssetsState => {
    const {busy, error, info} = useExchanges()
    const [state, setState] = useState<AssetsState>({
        busy: true,
        assets: [],
        assetMap: {},
    })
    useEffect(() => {
        setState(p => ({...p, busy, error}))
    }, [busy, error])
    useEffect(() => {
        const assetList: SymbolInfo[] = []
        const assetMap: { [key: string]: SymbolInfo } = {}
        info.exchanges.forEach(exchange => {
            for (let symbol in exchange.symbols) {
                const si = exchange.symbols[symbol]
                assetList.push(si)
                assetMap[AssetIdentifierToSymbol(si.identifier)] = si
            }
        })
        assetList.sort((a, b) => {
            const {broker: brokerA, exchange: exchangeA, symbol: symbolA} = a.identifier
            const {broker: brokerB, exchange: exchangeB, symbol: symbolB} = b.identifier
            if (brokerA !== brokerB) return brokerB > brokerA ? -1 : 1
            if (exchangeA !== exchangeB) return exchangeB < exchangeA ? -1 : 1
            if (symbolA !== symbolB) return symbolB > symbolA ? -1 : 1
            return 0
        })
        setState(p => ({
            ...p, assets: assetList, assetMap, busy: false,
        }))
    }, [info])
    return state
}

type ExchangesState = HookState & {
    info: ExchangeList
}

export const useExchanges = (): ExchangesState => {
    const [state, setState] = useState<ExchangesState>({
        busy: true,
        info: {brokerInfo: {}, exchanges: []},
    })
    useEffect(() => {
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${KIO_URL}/market/info`).json<ExchangeList>()
            .then(result => {
                setState(p => ({
                    ...p, info: result, busy: false,
                }))
            })
            .catch(err => setState(p => ({...p, error: err, busy: false})))
    }, [])
    return state
}

type IntervalListState = HookState & {
    intervals: number[]
}

export const useIntervalList = (): IntervalListState => {
    const [state, setState] = useState<IntervalListState>({
        busy: true,
        intervals: [60],
    })
    useEffect(() => {
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${KIO_URL}/market/intervals`).json<{ intervals: number[] }>()
            .then(result => setState(p => ({...p, intervals: result.intervals, busy: false})))
            .catch(err => setState(p => ({...p, error: err, busy: false})))
    }, [])
    return state
}

type IndicatorListState = HookState & {
    indicators: IndicatorListItem[]
}

export const useIndicatorList = (): IndicatorListState => {
    const [state, setState] = useState<IndicatorListState>({
        busy: true,
        indicators: [],
    })
    useEffect(() => {
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${INCA_URL}/indicators`).json<{ indicators: IndicatorListItem[] }>()
            .then(result => setState(p => ({...p, indicators: result.indicators, busy: false})))
            .catch(err => setState(p => ({...p, error: err, busy: false})))
    }, [])
    return state
}

type QueueSummaryState = QueueSummary & {
    error?: any
}

export const useQueue = (delay: number = 1, filter: string = ""): QueueSummaryState => {
    const [queue, setQueue] = useState<QueueSummaryState>({
        queued: [],
        completed: [],
        active: null,
        saved: [],
        error: undefined,
    })
    useEffect(() => {
        let isDone = false
        const fetch = () => {
            ky.get(`${SIMAR_URL}/simulations?filter=${filter}`).json<QueueSummary>()
                .then(res => {
                    if (isDone) return
                    res.queued.sort((a, b) => {
                        return b.createdOn - a.createdOn
                    })
                    res.completed.sort((a, b) => {
                        return b.createdOn - a.createdOn
                    })
                    res.saved.sort((a, b) => {
                        return b.createdOn - a.createdOn
                    })
                    setQueue(res)
                    setTimeout(() => fetch(), 1000 * delay)
                })
                .catch(err => {
                    if (isDone) return
                    setQueue(p => ({...p, error: err}))
                    setTimeout(() => fetch(), 2500 * delay)
                })
        }
        fetch()
        return () => {
            isDone = true
        }
    }, [filter])
    return queue
}

type InstanceSummaryState = {
    instances: Automaton[]
    error: any
}

export const useInstances = (botId: string = ""): InstanceSummaryState => {
    const [state, setState] = useState<InstanceSummaryState>({
        instances: [],
        error: undefined,
    })
    useEffect(() => {
        let isDone = false
        const fetch = () => {
            ky.get(`${ATOMA_URL}/bots/${botId}/instances`).json<{ automatons: Automaton[] }>()
                .then(res => {
                    if (isDone) return
                    setState({instances: res.automatons, error: undefined})
                    setTimeout(() => fetch(), 5000)
                })
                .catch(err => {
                    if (isDone) return
                    setState(p => ({...p, error: err}))
                    setTimeout(() => fetch(), 10000)
                })
        }
        fetch()
        return () => {
            isDone = true
        }
    }, [botId])
    return state
}

type SummaryState = HookState & {
    summary: QueueItem
}

export const useSummary = (id: string): SummaryState => {
    const [state, setState] = useState<SummaryState>({
        busy: true,
        summary: {} as QueueItem,
    })
    useEffect(() => {
        if (id === "") return
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${SIMAR_URL}/simulations/${id}`).json<QueueItem>()
            .then(result => setState(p => ({...p, summary: result, busy: false})))
            .catch(err => setState(p => ({...p, error: err, busy: false})))
    }, [id])
    return state
}

type ScenariosState = HookState & {
    scenarios: ScenarioMeta[]
}

export const useScenarios = (id: string): ScenariosState => {
    const [state, setState] = useState<ScenariosState>({
        busy: true,
        scenarios: [],
    })
    useEffect(() => {
        if (id === "") return
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${SIMAR_URL}/simulations/${id}/meta`)
            .json<MetaPayload<MainMeta, ScenarioMeta>>()
            .then(result => setState(p => ({...p, scenarios: result.children, busy: false})))
            .catch(err => {
                setState(p => ({...p, error: err, busy: false}))
                console.log(err)
            })
    }, [id])
    return state
}

type AlgoListState = HookState & {
    algorithms: AlgoDescriptor[]
}

export const useAlgorithms = (): AlgoListState => {
    const [state, setState] = useState<AlgoListState>({
        busy: true,
        algorithms: [],
    })
    useEffect(() => {
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${ALGO_URL}/algorithms`)
            .json<{ "algorithms": AlgoDescriptor[] }>()
            .then(result => {
                const algorithms = result.algorithms
                algorithms.sort((a: AlgoDescriptor, b: AlgoDescriptor) => {
                    return a.name < b.name ? -1 : 1
                })
                setState(p => ({...p, algorithms: algorithms, busy: false}))
            })
            .catch(err => {
                setState(p => ({...p, error: err, busy: false}))
                console.log(err)
            })
    }, [])
    return state
}

type StatisticsCollectionState = HookState & {
    statistics: StatisticsCollection
}

export const useScenarioStatistics = (uid: string): StatisticsCollectionState => {
    const [state, setState] = useState<StatisticsCollectionState>({
        busy: true,
        statistics: {symbols: {}},
    })
    useEffect(() => {
        if (uid === "") return
        const {id, scenario} = unpackRunId(uid)
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${SIMAR_URL}/simulations/${id}/statistics/${scenario}`)
            .json<StatisticsCollection>()
            .then(result => setState(p => ({...p, statistics: result, busy: false})))
            .catch(err => {
                setState(p => ({...p, error: err, busy: false}))
                console.log(err)
            })
    }, [uid])
    return state
}

type ScenarioMetaState = HookState & {
    scenario: ScenarioMeta
    symbols: SymbolMeta[]
}

export const useScenarioMeta = (uid: string): ScenarioMetaState => {
    const [state, setState] = useState<ScenarioMetaState>({
        busy: true,
        scenario: {} as ScenarioMeta,
        symbols: [],
    })
    useEffect(() => {
        if (uid === "") return
        const {scenario, id} = unpackRunId(uid)
        if (scenario === undefined) return
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${SIMAR_URL}/simulations/${id}/meta?scenario=${scenario}`)
            .json<MetaPayload<ScenarioMeta, SymbolMeta>>()
            .then(result => {
                setState(p => ({...p, scenario: result.meta, symbols: result.children, busy: false}))
            })
            .catch(err => setState(p => ({...p, error: err, busy: false})))
    }, [uid])
    return state
}


type BotListState = HookState & {
    bots: BotConfig[]
}

export const useBotList = (): BotListState => {
    const [state, setState] = useState<BotListState>({
        busy: true,
        bots: [],
    })
    useEffect(() => {
        let cancelled = false
        setState(p => ({...p, error: undefined, busy: true}))
        ky.get(`${SIMAR_URL}/bots`).json<BotConfigList>()
            .then(result => {
                if (cancelled) return
                setState(p => {
                    const bots = result.bots
                    bots.sort((a, b) => {
                        return b.name < a.name ? 1 : -1
                    })
                    return ({...p, bots, busy: false})
                })
            })
            .catch(err => {
                if (cancelled) return
                setState(p => ({...p, error: err, busy: false}))
            })
        return () => {
            cancelled = true
        }
    }, [])
    return state
}
