import React, {FC, useContext, useEffect, useState} from "react"
import {Helmet} from "react-helmet"
import "./ChartPage.scss"
import {MenuBarContext} from "../../_contexts/MenuBar"
import {useLocalStringState} from "../../_hooks/localstore"
import SymbolList from "./SymbolList"
import MarketChart from "../../_components/MarketChart/MarketChart"
import {useWindowSize} from "../../_hooks/size"
import {Panel, PanelContainer, PanelWithTitle} from "../../_components/Framework/Framework"

const ChartPage: FC = () => {

    const [asset, setAsset] = useState<string>("")
    useLocalStringState(setAsset, asset, "chartSymbol")

    const menuBar = useContext(MenuBarContext)
    useEffect(() => {
        menuBar.setName("Terminal")
        menuBar.setActions([])
    }, [])

    const size = useWindowSize()

    return (
        <div id="realtime">
            <Helmet>
                <title>{asset ? asset.split(":").pop() : "Chart"}</title>
            </Helmet>
            <PanelContainer>
                <Panel>
                    <MarketChart
                        width={(size.width !== undefined) ? size.width - 420 : 1280}
                        height={(size.height !== undefined) ? size.height - 162 : 720}
                        symbol={asset}
                    />
                </Panel>
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

export default ChartPage
