import React, {FC, useContext, useEffect, useState} from "react"
import {Helmet} from "react-helmet"
import "./AnalysisPage.scss"
import {MenuBarContext} from "../../_contexts/MenuBar"
import {useLocalStringState} from "../../_hooks/localstore"
import SymbolList from "./SymbolList"
import MarketChart from "../../_components/MarketChart/MarketChart"
import {useWindowSize} from "../../_hooks/size"
import {Panel, PanelContainer, PanelWithTitle} from "../../_components/Framework/Framework"
import AlgorithmPanel from "./panels/AlgorithmPanel"

const AnalysisPage: FC = () => {

    const [asset, setAsset] = useState<string>("")
    const [algorithm, setAlgorithm] = useState<string>("")
    useLocalStringState(setAsset, asset, "chartSymbol")

    const menuBar = useContext(MenuBarContext)
    useEffect(() => {
        menuBar.setName("Terminal")
        menuBar.setActions([])
    }, [])

    const size = useWindowSize()

    return (
        <div id="analysis">
            <Helmet>
                <title>{asset ? asset.split(":").pop() : "Undefined"} - Analysis</title>
            </Helmet>
            <PanelContainer>
                <div className="main-panel">
                    <Panel>
                        <MarketChart
                            algorithmId={algorithm}
                            width={(size.width !== undefined) ? size.width - 420 : 1280}
                            height={size.height !== undefined ? Math.min(size.height - 300, size.height * 0.6) : 640}
                            symbol={asset}
                        />
                    </Panel>
                    <PanelWithTitle title={"Algorithms"} className="tools-panel" grow={true}>
                        <AlgorithmPanel asset={asset} setAlgorithm={setAlgorithm} algorithm={algorithm}/>
                    </PanelWithTitle>
                </div>
                <PanelWithTitle title={"Symbols"} grow={true} className="symbol-list-container">
                    <SymbolList
                        asset={asset}
                        setAsset={setAsset}
                    />
                </PanelWithTitle>
            </PanelContainer>
        </div>
    )
}

export default AnalysisPage
