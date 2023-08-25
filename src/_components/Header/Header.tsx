import React, {FC, useContext} from "react"
import {MenuBarContext} from "../../_contexts/MenuBar"
import "./Header.scss"

const Header: FC = () => {
    const menuBar = useContext(MenuBarContext)
    return (
        <div id="header">
            <div className="page-descriptor">
                <div className="page-name">{menuBar.name}</div>
                <div className="page-actions">
                    {menuBar.actions.map(action => (
                        <button
                            key={action.name}
                            className={"btn-page-header" + (menuBar.selected.includes(action.name) ? " active" : "")}
                            onClick={action.onClick}
                            type="button"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="user-actions">
                <div className="user-name">
                    {menuBar.user}
                </div>
            </div>
        </div>
    )
}

export default Header
