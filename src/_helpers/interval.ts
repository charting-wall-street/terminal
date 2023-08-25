export const formatInterval = (interval: number): string => {
    let symbol = "s"
    if (interval >= 60) {
        interval /= 60
        symbol = "m"
        if (interval >= 60) {
            interval /= 60
            symbol = "h"
            if (interval >= 24) {
                interval /= 24
                symbol = "d"
            }
        }
    }
    return `${interval}${symbol}`
}
