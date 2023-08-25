import React, {FC, useState} from "react"
import "./AlgorithmPanel.scss"
import {useAlgorithms} from "../../../_hooks/hooks"
import Loader from "../../../_components/Loader/Loader"
import {AlgoDescriptor} from "../../../_types/types"
import ky from "ky"
import {ALGO_URL} from "../../../_helpers/env"

interface AlgorithmEntryProps {
    descriptor: AlgoDescriptor
    asset: string
    setAlgorithm: (algorithm: string) => void
    active: boolean
}

const AlgorithmEntry: FC<AlgorithmEntryProps> = ({descriptor, asset, setAlgorithm, active}) => {

    const [params, setParams] = useState<string>("")
    const [forceCompile, setForceCompile] = useState<boolean>(false)

    return (
        <tr className={`algo-entry ${active ? "active" : ""}`}>
            <td className="algo-title">
                {descriptor.title}
            </td>
            <td className="algo-params">
                <input type="text" value={params} onChange={e => {
                    setParams(e.target.value)
                }}/>
            </td>
            <td className="algo-actions">
                <div className={"btn-algo btn-algo-refresh " + (forceCompile ? "active" : "")}
                     onClick={() => setForceCompile(p => !p)}></div>
                <div className="btn-algo btn-algo-start"
                     onClick={() => setAlgorithm(`${descriptor.name}:${params}:${forceCompile ? "force" : ""}:${Math.random()}`)}></div>
            </td>
        </tr>
    )

}

interface AlgorithmPanelProps {
    asset: string
    setAlgorithm: (algorithm: string) => void
    algorithm: string
}

const AlgorithmPanel: FC<AlgorithmPanelProps> = ({asset, setAlgorithm, algorithm}) => {

    const {algorithms, busy} = useAlgorithms()

    return (
        <div className="algorithm-panel">
            {busy ? <Loader/> : (algorithms.length === 0 ? (
                    <div style={{padding: "10px"}}>No entries</div>
                ) : (
                    <table className="algorithm-list">
                        <tbody>
                        {algorithms.map((a, index) => (
                            <AlgorithmEntry setAlgorithm={setAlgorithm} asset={asset} key={a.name}
                                            descriptor={a} active={algorithm === a.name}/>
                        ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    )
}

export default AlgorithmPanel