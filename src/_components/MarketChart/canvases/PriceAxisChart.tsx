import React, {FC, useRef} from "react"
import {CanvasElementProps, ChartMoveState} from "../../../_types/charts"
import {useCanvasRenderer} from "../fetcher/hooks"
import {BORDER_COLOR} from "../../../_styles/colors"
import {fitPriceAxis, priceTicksList, scalePriceAxis} from "../fetcher/axis"
import {ChartRenderFunction} from "../renderer/types"

const draw: ChartRenderFunction = (ctx, chart, mev) => {

    ctx.textAlign = "left"
    ctx.clearRect(0, 0, 72, chart.bounds.height)
    ctx.fillStyle = BORDER_COLOR
    ctx.fillRect(0, 0, 1, chart.bounds.height)
    const ticks = priceTicksList(chart)
    ctx.fillStyle = BORDER_COLOR
    ctx.fillStyle = "#7f8fa6"
    ticks.forEach(t => {
        ctx.font = "12px Share Tech Mono"
        ctx.fillText(`${t[1]}`, 8, t[0] + 5)
    })

    if (chart.cursor.show) {
        const priceString = `${parseFloat(chart.cursor.price.toFixed(6))}`
        const w = ctx.measureText(priceString)
        ctx.fillStyle = "#1b1e23"
        ctx.strokeStyle = "#2f3640"
        ctx.fillRect(2, chart.cursor.y - 10, w.width + 8, 20)
        ctx.strokeRect(2, chart.cursor.y - 10, w.width + 8, 20)
        ctx.fillStyle = "white"
        ctx.fillText(priceString, 5, chart.cursor.y + 4)
    }

}

const PriceAxisChart: FC<CanvasElementProps> = ({chart, ...p}) => {
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
        style={{width: `${72}px`, height: `${p.height}px`}}
        onMouseMove={e => {
            if (moveState.current.mouseDown && e.movementY !== 0) {
                moveState.current.isMoving = true
                scalePriceAxis(e.movementY, chart.current)
            }
        }}
        onMouseDown={e => {
            moveState.current.mouseDown = true
            const now = (new Date()).getTime()
            if ((now - moveState.current.lastDown) < 300) {
                chart.current.price.auto = true
                fitPriceAxis(chart.current)
            }
            moveState.current.lastDown = now
        }}
        onMouseUp={() => cancelMouseDown()}
        onMouseLeave={() => {
            cancelMouseDown()
        }}
        width={72*dpr}
        height={p.height*dpr}
        ref={canvasRef}
    />
}

export default PriceAxisChart
