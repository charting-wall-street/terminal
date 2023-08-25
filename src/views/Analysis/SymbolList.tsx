import React, {FC, useEffect, useState} from "react"
import "./SymbolList.scss"
import {useSymbols} from "../../_hooks/hooks"
import SymbolLabel from "../../_components/Symbol/SymbolLabel"

interface Props {
    setAsset: (a: string) => void
    asset: string
}

const SymbolList: FC<Props> = ({asset, setAsset}) => {

    const [filtered, setFiltered] = useState<string[]>([])
    const [search, setSearch] = useState<string>("")

    const {symbols} = useSymbols()

    useEffect(() => {
        setFiltered(symbols.filter(v => {
            let needle = search.toLowerCase().replaceAll(" ", "")
            return v.toLowerCase().indexOf(needle) !== -1
        }))
    }, [search, symbols])

    return (
        <div className="symbol-list">
            <div className="list-header">
                <input
                    placeholder="Search"
                    className="symbol-search"
                    type="text"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                    }}
                />
            </div>
            <div className="list-container">
                {filtered.map(s => (
                    <div
                        key={s}
                        onClick={() => setAsset(s)}
                        className={`symbol-label list-entry ${asset === s ? "active" : ""}`}
                    >
                        <SymbolLabel listItem={true} symbol={s}/>
                    </div>
                ))}
            </div>
        </div>
    )


}

export default SymbolList
