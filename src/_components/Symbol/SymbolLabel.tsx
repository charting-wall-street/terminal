import React, {FC} from "react"

interface Props {
    symbol: string
    className?: string
    showBaseCurrency?: boolean
    listItem?: boolean
}

const SymbolLabel: FC<Props> = ({symbol, listItem, className, showBaseCurrency}) => {
    let s = symbol
    let isTether = false
    if (symbol.indexOf("USDT") !== -1) {
        s = symbol.replace("USDT", "")
        isTether = true
    }
    const parts = s.split(":")
    return (
        <div className={"symbol-label " + (className !== undefined ? className : "") + (listItem ? " list-item" : "")}>
            <span className="symbol-pair">{parts[2]}</span>
            <div className="symbol-icons">
                {isTether && showBaseCurrency ? (<span title="Tether" className="symbol-icon icon-tether"/>) : null}
                <span title="Binance" className={`symbol-icon icon-${parts[0].toLowerCase()}`}/>
                {parts[1] === "PERP" ? (<span title="Futures" className={"symbol-icon icon-futures"}/>) : null}
            </div>
        </div>
    )
}

export default SymbolLabel
