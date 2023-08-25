export const formatShort = (v: number): string => {
    if (Math.abs(v) > 1e9) {
        return `${parseFloat((v / 1e9).toFixed(2))}B`
    } else if (Math.abs(v) > 1e6) {
        return `${parseFloat((v / 1e6).toFixed(2))}M`
    } else if (Math.abs(v) > 1e3) {
        return `${parseFloat((v / 1e3).toFixed(2))}K`
    }
    return `${parseFloat(v.toFixed(3))}`
}

export const formatDollar = (v: number): string => {
    let negative = v < 0
    let a = Math.abs(v).toFixed(0)
    if (negative) {
        return "-$" + a
    } else {
        return "$" + a
    }
}
