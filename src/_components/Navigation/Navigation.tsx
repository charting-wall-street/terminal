import React, {FC} from "react"
import {Link, useLocation} from "react-router-dom"
import "./Navigation.scss"

interface ItemProps {
    name: string
    to: string
    icon: string
}

const NavigationItem: FC<ItemProps> = ({name, to, icon}) => {
    const {pathname} = useLocation()
    const path = pathname.split("/")
    let active = false
    if (path.length > 0 && "/" + path[1] === to) {
        active = true
    }

    return (
        <Link
            className={`navigation-item ${active ? "active" : ""}`}
            to={to}
        >
            <div className="navigation-icon" style={{backgroundImage: `url("icons/nav/${icon}.svg")`}}/>
            {name}
        </Link>
    )
}

const Navigation: FC = () => (
    <div id="navigation">
        <NavigationItem icon={"chart"} name={"Chart"} to={"/chart"}/>
        <NavigationItem icon={"analysis"} name={"Analysis"} to={"/analysis"}/>
    </div>
)

export default Navigation
