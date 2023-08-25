// formats floats to dollar value
export const toUSD = (v: number, precision: number = 3) => {
    let vs = v.toFixed(precision)
    if (vs[0] === "-") {
        return `-$${vs.slice(1)}`
    } else {
        return `$${vs}`
    }
}
