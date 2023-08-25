export const getScenarioId = (uid: string): string => {
    const parts = uid.split("/")
    if (parts.length < 2) {
        return ""
    }
    while (parts.length > 2) {
        parts.pop()
    }
    return parts.join("/")
}

type ResultPath = {
    segment?: number
    symbol?: string
    scenario?: number
    id: string
}

export const unpackRunId = (uid: string): ResultPath => {
    const parts = uid.split("/")
    const path: ResultPath = {
        id: parts[0],
    }
    if (parts.length > 1) {
        path.scenario = parseInt(parts[1])
    }
    if (parts.length > 2) {
        path.symbol = parts[2]
    }
    if (parts.length > 3) {
        path.segment = parseInt(parts[3])

    }
    return path
}

export const getHistoryScenarioId = (uid: string): string => {
    const path = uid.split("/")
    if (path.length < 3) return ""
    return `${path[0]}/${path[2]}/${path[1]}`
}

export const getSymbolId = (uid: string): string => {
    const parts = uid.split("/")
    if (parts.length < 3) {
        return ""
    }
    while (parts.length > 3) {
        parts.pop()
    }
    return parts.join("/")
}

export const getRunId = (uid: string): string => {
    return uid.split("/")[0]
}
