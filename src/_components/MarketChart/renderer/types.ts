import {ChartModel} from "../../../_types/charts"
import React from "react"

export type CandleDrawArgs = (
    ctx: CanvasRenderingContext2D,
    chart: ChartModel,
    block: number,
) => void

export type FreeDrawArgs = (
    ctx: CanvasRenderingContext2D,
    chart: ChartModel,
) => void

export type ChartRenderFunction = (
    ctx: CanvasRenderingContext2D,
    chart: ChartModel,
    mev?: React.MouseEvent | null
) => void
