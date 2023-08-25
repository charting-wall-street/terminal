import React, {useEffect, useRef} from "react"
import {ChartModel} from "../../../_types/charts"
import {ChartRenderFunction} from "../renderer/types"

interface CanvasRendererProps {
    canvas: React.RefObject<HTMLCanvasElement>
    mouse?: React.RefObject<React.MouseEvent> | null
    chart: React.RefObject<ChartModel>
}

export const useCanvasRenderer = ({canvas, ...p}: CanvasRendererProps, renderer: ChartRenderFunction) => {
    const frameId = useRef(0)
    const initialized = useRef(false)
    const tick = () => {
        if (!canvas.current) return
        const context = canvas.current.getContext("2d")
        if (!context) return
        const dpr = window.devicePixelRatio || 1
        context.resetTransform()
        context.scale(dpr, dpr)
        initialized.current = true
        if (p.chart.current !== null) {
            renderer(context, p.chart.current, p.mouse?.current)
        }
        frameId.current = requestAnimationFrame(tick)
    }
    useEffect(() => {
        frameId.current = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(frameId.current)
            initialized.current = false
        }
    }, [])
}
