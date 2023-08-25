export const BORDER_COLOR = "#2f3640"
export const AXIS_COLOR = "rgba(47,54,64,0.6)"
export const TEXT_COLOR = "#d7d7d7"
export const BACKGROUND_COLOR = "#161a25"
export const GREEN_COLOR = "#10ac84"
export const LONG_ENTRY_COLOR = "#55efc4"
export const LONG_PROFIT_COLOR = "#55efc4"
export const LONG_LOSS_COLOR = "#ff7675"
export const SHORT_ENTRY_COLOR = "#70a1ff"
export const SHORT_LOSS_COLOR = "#ff9f43"
export const SHORT_PROFIT_COLOR = "#70a1ff"
export const RED_COLOR = "#ee5253"
export const CANDLE_UP = "#006266"
export const CANDLE_DOWN = "#b53447"

export const getSymbolColor = (symbol: string): string => {

    symbol = symbol.replace("USDT", "")

    let paramSum = 0
    let paramMul = 0
    for (let i = 0; i < symbol.length; i++) {
        paramSum += symbol.charCodeAt(i) - 49
        paramMul *= symbol.charCodeAt(i) - 49
    }

    let r = Math.sin((symbol.length * 2 % 7))
    let g = (paramMul % 255) / 255
    let b = Math.sin((paramSum % 100))

    return `rgb(${r * 100 + 120},${g * 100 + 120},${b * 100 + 120})`
}

export const getIndicatorColor = (uid: string): string => {

    const parts = uid.split(":")

    const ind = parts[0]

    let indNum = 0
    for (let i = 0; i < ind.length; i++) {
        indNum += ind.charCodeAt(i)
    }

    const params = parts[1].split(",")
    let paramNum = 1
    for (let i = 0; i < params.length; i++) {
        paramNum *= parseInt(params[i]) + 1
    }

    let paramSum = 0
    for (let i = 0; i < parts[1].length; i++) {
        paramSum += parts[1].charCodeAt(i) - 49
    }

    let r = Math.sin((indNum * Math.PI % 10))
    let g = Math.cos((Math.log(paramNum) % 100))
    let b = Math.sin((paramSum % 100))

    return `rgb(${r * 60 + 140},${g * 60 + 140},${b * 60 + 140})`
}
