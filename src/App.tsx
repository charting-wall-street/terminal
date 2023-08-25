import React, {useState} from "react"
import Header from "./_components/Header/Header"
import "./App.scss"
import Navigation from "./_components/Navigation/Navigation"
import "./_styles/List.scss"
import "./_styles/Frame.scss"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {MenuBarAction, MenuBarContext, MenuBarState} from "./_contexts/MenuBar"
import ChartPage from "./views/Chart/ChartPage"
import "./_components/Framework/Framework.scss"
import "./_styles/Exchange.scss"
import AnalysisPage from "./views/Analysis/AnalysisPage"

const App = () => {

    const [menuBar, setMenuBar] = useState<MenuBarState>({
        name: "",
        user: "localhost",
        actions: [],
        selected: [],
    })

    return (
        <Router>
            <MenuBarContext.Provider value={{
                ...menuBar,
                setName: (name: string) => setMenuBar(p => ({...p, name})),
                setUser: (user: string) => setMenuBar(p => ({...p, user})),
                setActions: (actions: MenuBarAction[]) => setMenuBar(p => ({...p, actions})),
                setSelected: (selected: string[]) => setMenuBar(p => ({...p, selected})),
            }}>
                <Header/>
                <div id="app" className="root-container">
                    <Navigation/>
                    <div className="page-container">
                        <Routes>
                            <Route path="/chart" element={<ChartPage/>}/>
                            <Route path="/analysis" element={<AnalysisPage/>}/>
                        </Routes>
                    </div>
                </div>
            </MenuBarContext.Provider>
        </Router>
    )
}

export default App
