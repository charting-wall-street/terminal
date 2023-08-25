import React, {FC, useRef} from "react"
import {CanvasElementProps, ChartMoveState} from "../../../_types/charts"
import {fitPriceAxis, monthNames, scaleTimeAxis, timeTicksList} from "../fetcher/axis"
import {useCanvasRenderer} from "../fetcher/hooks"
import {BORDER_COLOR} from "../../../_styles/colors"
import {ChartRenderFunction} from "../renderer/types"

const draw: ChartRenderFunction = (ctx, chart, mev) => {
    ctx.clearRect(0, 0, chart.bounds.width, chart.bounds.height)
    ctx.fillStyle = BORDER_COLOR
    ctx.fillRect(0, 0, chart.bounds.width, 1)
    const range = chart.time.visibleRange
    const ticks = timeTicksList(chart)
    let dayTick = (Math.floor(range.lower / 60 / 60 / 24) - 1) * 60 * 60 * 24
    let d = (new Date())
    d.setTime(dayTick * 1000)
    let monthLabel = d.getUTCMonth()
    let yearLabel = d.getUTCFullYear()
    ctx.textAlign = "center"
    ctx.font = "11px Share Tech Mono"
    ctx.fillStyle = "#7f8fa6"
    ticks.forEach(t => {
        const x = t[0]
        ctx.fillText(`${t[1]}`, x, 16)
        const d = new Date()
        d.setTime(t[2] * 1000)
        let nextMonthLabel = d.getUTCMonth()
        let nextYearLabel = d.getUTCFullYear()
        if (nextYearLabel !== yearLabel) {
            yearLabel = nextYearLabel
            monthLabel = nextMonthLabel
            ctx.fillText(`${yearLabel}`, x, 32)
        } else if (nextMonthLabel !== monthLabel) {
            monthLabel = nextMonthLabel
            ctx.fillText(`${monthNames[monthLabel]}`, x, 32)
        } else {
            ctx.fillText(`${d.getUTCDate()}`, x, 32)
        }
    })

    if (chart.cursor.show) {
        const ts = new Date(chart.cursor.time * 1000).toISOString()
        let parts = ts.split("T")
        const time = parts[1].substring(0, 5)
        const date = parts[0]
        let w1 = ctx.measureText(time)
        let w2 = ctx.measureText(date)
        ctx.fillStyle = "#1b1e23"
        const padding = 8
        ctx.fillRect(chart.cursor.x - w1.width / 2 - padding, 1, w1.width + 2 * padding, 20)
        ctx.fillRect(chart.cursor.x - w2.width / 2 - padding, 20, w2.width + 2 * padding, 20)
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.fillText(time, chart.cursor.x, 16)
        ctx.fillText(date, chart.cursor.x, 18 + 16)
    }

}

const TimeAxisChart: FC<CanvasElementProps> = ({chart, ...p}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const moveState = useRef<ChartMoveState>({
        isMoving: false,
        mouseDown: false,
        lastDown: 0,
    })
    useCanvasRenderer({
        canvas: canvasRef,
        chart: chart,
    }, draw)
    const cancelMouseDown = () => {
        moveState.current.mouseDown = false
        moveState.current.isMoving = false
    }
    const dpr = window.devicePixelRatio || 1
    return <canvas
        style={{width: `${p.width}px`, height: `${36}px`}}
        onMouseMove={e => {
            if (moveState.current.mouseDown && e.movementX !== 0) {
                moveState.current.isMoving = true
                scaleTimeAxis(e.movementX, chart.current)
                fitPriceAxis(chart.current)
            }
        }}
        onMouseDown={e => {
            moveState.current.mouseDown = true
        }}
        onMouseUp={() => cancelMouseDown()}
        onMouseLeave={() => {
            cancelMouseDown()
        }}
        width={p.width * dpr}
        height={36 * dpr}
        ref={canvasRef}
    />
}

export default TimeAxisChart
