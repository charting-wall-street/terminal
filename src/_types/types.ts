export type TypeCandle = {
    o: number
    h: number
    l: number
    c: number
    v: number
    tv: number
    not: number
    t: number
    m: boolean
}

export type QueueSummary = {
    active: QueueItem | null
    queued: QueueItem[]
    completed: QueueItem[]
    saved: QueueItem[]
}

export type StatisticsCollection = {
    symbols: { [key: string]: Statistics[] }
}

export type QueueItem = {
    id: string
    name: string
    createdOn: number
    elapsed: number
    status: string
    hasError: boolean
    isCandidate: boolean
    config: SimConfig,
    statistics: Statistics
}

export type SimConfig = {
    version: BotVersion,
    startBlock: number
    endBlock: number
    symbols: string[]
    scenarios: number[][]
    leverage: number
    segments: number
}

export type BotVersion = {
    id: string
    name: string
    commit: string
    description: string
}

export type MainMeta = {}

export type ScenarioMeta = {
    parameters: number[]
    statistics: Statistics
}

export type AlgoDescriptor = {
    name: string
    title: string
    description: string
    entry: string
}

export type SymbolMeta = {
    symbol: string
    statistics: Statistics
}

export type SegmentMeta = {
    startBlock: number
    endBlock: number
    statistics: Statistics
}

export type Statistics = {
    winRate: number
    realized: number
    unrealized: number
    profitPerTrade: number
    numberOfTrades: number
    entryExitRatio: number
    feeProfitRatio: number
}

export interface MetaPayload<P, C> {
    meta: P
    children: C[]
}

export type BotRunParameters = {
    startBlock: number,
    endBlock: number,
    symbols: string[],
    segments: number,
    scenarios: number[][],
    leverage: number,
    name: string,
    botId: string,
}

export type BotConfig = {
    id: string
    path: string
    name: string
    description: string
    entry: string
}

export type BotConfigList = {
    bots: BotConfig[]
}

export type TradeConstraints = {
    maxPrice: number
    minPrice: number
    tickSize: number
    maxQuantity: number
    minQuantity: number
    stepSize: number
    maxNumOrders: number
    minNotional: number
}

export type AssetIdentifier = {
    broker: string
    exchange: string
    symbol: string
}

export type SymbolInfo = {
    identifier: AssetIdentifier
    pair: string
    baseAsset: string
    baseAssetPrecision: number
    quotePrecision: number
    quoteAsset: string
    constraints: TradeConstraints
    onBoardDate: number
}

export type LegacySymbolInfo = {
    symbol: string
    pair: string
    contractType: string
    pricePrecision: number
    quantityPrecision: number
    baseAssetPrecision: number
    quotePrecision: number
    quoteAsset: string
    baseAsset: string
    constraints: TradeConstraints
    deliveryDate: number
    onBoardDate: number
}

export type BrokerInfo = {
    name: string
}

export type ExchangeInfo = {
    name: string
    exchangeId: string
    brokerId: string
    lastUpdate: number
    symbols: { [key: string]: SymbolInfo }
    resolution: number[]
}

export type ExchangeList = {
    exchanges: ExchangeInfo[]
    brokerInfo: { [key: string]: BrokerInfo }
}

export type SimTimeRange = {
    lower: number
    upper: number
}

export type IndicatorListItem = { name: string, presets: number[][] }

export type Automaton = {
    instance: BotInstance
    config: AutomatonConfig
    pairs: { [key: string]: PairTradeState }
    memories: { [key: string]: BotMemory }
    restart: boolean
}

export type BotInstance = {
    id: string
    name: string
    status: string
    createdOn: number
    logs: AutomatonLog[]
}

export type AutomatonConfig = {
    version: BotVersion
    funds: number
    symbols: string[]
    parameters: number[]
    leverage: number
}

export type BotMemory = {
    floats: { [key: string]: number }
    integers: { [key: string]: number }
}

export type AutomatonLog = {
    id: string
    startTime: number
    stopTime: number
    output: string
    error: string
}

export type Order = {
    id: string
    symbol: string
    price: number
    side: string
    kind: string
    positionSide: string
    close: boolean
    time: number
    amount: number
    filled: number
}

export type PairTradeState = {
    orders: Order[],
    position: {
        long: PositionState
        short: PositionState
    },
    funds: number,
    balance: number,
    trades: any[]
}

export type PositionState = {
    entry: number,
    amount: number,
    symbol: string,
    lastUpdate: number,
    lastPrice: number
}
