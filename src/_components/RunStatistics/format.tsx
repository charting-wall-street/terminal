import {Statistics} from "../../_types/types"
import React from "react"
import "./RunStatistics.scss"

export const formatStatistics = (stats: Statistics) => {
    if (stats.entryExitRatio === 0) {
        return (
            <div>
                No trades
            </div>
        )
    } else {
        return (
            <div className="statistics-info">
                <div>
                    W {(stats.winRate).toFixed(1)}
                </div>
                <div>
                    N {stats.numberOfTrades}
                </div>
                <div>
                    PPT {(stats.profitPerTrade*100).toFixed(1)}
                </div>
                <div className={stats.realized < 0 ? "text-red" : "text-green"}>
                    RLZ {(stats.realized * 100).toFixed(0)}
                </div>
                {stats.realized !== stats.unrealized ? (
                    <div className={stats.realized < 0 ? "text-red" : "text-green"}>
                        UNZ {(stats.unrealized * 100).toFixed(0)}
                    </div>
                ) : null}
                {stats.feeProfitRatio > 0.05 ? (
                    <div style={{color: "#ee5253"}}>
                        FEE {(stats.feeProfitRatio * 100).toFixed(0)}
                    </div>
                ) : null}
            </div>
        )
    }
}
