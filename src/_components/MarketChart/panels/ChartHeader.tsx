import React, {FC} from "react"
import "./ChartHeader.scss"

const ChartHeader: FC = ({children}) => {
    return (
        <div className="chart-header">
            <div className="chart-actions">
                {children}
            </div>
        </div>
    )
}

export default ChartHeader
