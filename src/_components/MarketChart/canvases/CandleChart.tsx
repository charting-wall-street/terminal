import React, {FC, useRef} from "react"
import noScroll from "no-scroll"
import {CanvasElementProps, ChartMoveState} from "../../../_types/charts"
import {fitPriceAxis, movePriceAxis, moveTimeAxis, scaleTimeAxis} from "../fetcher/axis"
import {useCanvasRenderer} from "../fetcher/hooks"
import {drawCandleChart} from "../renderer/pipeline"


const CandleChart: FC<CanvasElementProps> = ({chart, ...p}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouse = useRef<React.MouseEvent | null>(null)
    const moveState = useRef<ChartMoveState>({
        isMoving: false,
        mouseDown: false,
        lastDown: 0,
    })

    useCanvasRenderer({
        canvas: canvasRef,
        chart: chart,
        mouse: mouse,
    }, drawCandleChart)

    const cancelMouseDown = () => {
        moveState.current.mouseDown = false
        moveState.current.isMoving = false
    }

    const dpr = window.devicePixelRatio || 1

    return <canvas
        id="candleChart"
        style={{width: `${p.width}px`, height: `${p.height}px`}}
        onMouseMove={e => {
            mouse.current = e
            if (moveState.current.mouseDown && (e.movementX !== 0 || e.movementY !== 0)) {
                moveState.current.isMoving = true
                chart.current.cursor.show = false
                moveTimeAxis(e.movementX, chart.current)
                movePriceAxis(e.movementY, chart.current)
            } else {
                chart.current.cursor.show = true
            }
            if (canvasRef.current !== null) {
                const bounds = canvasRef.current.getBoundingClientRect()
                const mouseX = e.pageX - bounds.left
                const mouseY = e.pageY - bounds.top
                const dim = chart.current.dimensions
                const timeRange = chart.current.time.visibleRange
                const time = timeRange.lower + (timeRange.upper - timeRange.lower) * (mouseX / dim.width)
                const priceRange = chart.current.price.visibleRange
                const price = priceRange.lower + (priceRange.upper - priceRange.lower) * (1 - (mouseY / dim.height))
                const cursor = chart.current.cursor
                cursor.time = Math.round(time)
                cursor.price = price
                cursor.x = mouseX
                cursor.y = mouseY
            }
        }}
        onMouseDown={e => {
            moveState.current.mouseDown = true
        }}
        onMouseUp={() => cancelMouseDown()}
        onMouseLeave={() => {
            cancelMouseDown()
            mouse.current = null
            chart.current.cursor.show = false
            noScroll.off()
        }}
        onMouseEnter={() => {
            chart.current.cursor.show = true
            noScroll.on()
        }}
        onWheel={e => {
            scaleTimeAxis(e.deltaY, chart.current)
            fitPriceAxis(chart.current)
        }}
        width={p.width * dpr}
        height={p.height * dpr}
        ref={canvasRef}
    />
}

export default CandleChart
