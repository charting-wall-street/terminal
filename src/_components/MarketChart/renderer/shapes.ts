const triangleSize = 5

export const drawCross = (x: number, y: number, w: number, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    ctx.beginPath()
    ctx.moveTo(o + x - 4, y - 4)
    ctx.lineTo(o + x + 4, y + 4)
    ctx.moveTo(o + x + 4, y - 4)
    ctx.lineTo(o + x - 4, y + 4)
    ctx.stroke()
}

export const drawHorizontalMarker = (x: number, y: number, w: number, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    ctx.beginPath()
    ctx.moveTo(o + x - 4, y)
    ctx.lineTo(o + x + 4, y)
    ctx.stroke()
}

export const drawVerticalMarker = (x: number, y: number, w: number, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    ctx.beginPath()
    ctx.moveTo(o + x, y - 4)
    ctx.lineTo(o + x, y + 4)
    ctx.stroke()
}

export const drawText = (x: number, y: number, w: number, t: string, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    ctx.textAlign = "center"
    ctx.font = "10px Share Tech Mono"
    ctx.fillText(t, o + x, y - 4)
}
export const drawTop = (x: number, y: number, w: number, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    ctx.beginPath()
    ctx.moveTo(o + x - 4, y - 4)
    ctx.lineTo(o + x, y)
    ctx.lineTo(o + x + 4, y - 4)
    ctx.stroke()
}
export const drawBottom = (x: number, y: number, w: number, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    ctx.beginPath()
    ctx.moveTo(o + x - 4, y + 4)
    ctx.lineTo(o + x, y)
    ctx.lineTo(o + x + 4, y + 4)
    ctx.stroke()
}

export const drawTriangleUp = (x: number, y: number, w: number, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    y -= 1
    ctx.beginPath()
    ctx.moveTo(o + x + triangleSize, y + triangleSize)
    ctx.lineTo(o + x - triangleSize, y + triangleSize)
    ctx.lineTo(o + x, y - triangleSize)
    ctx.lineTo(o + x + triangleSize, y + triangleSize)
    ctx.fill()
}

export const drawTriangleDown = (x: number, y: number, w: number, ctx: CanvasRenderingContext2D) => {
    const o = 3 * w
    y += 1
    ctx.beginPath()
    ctx.moveTo(o + x - triangleSize, y - triangleSize)
    ctx.lineTo(o + x + triangleSize, y - triangleSize)
    ctx.lineTo(o + x, y + triangleSize)
    ctx.lineTo(o + x - triangleSize, y - triangleSize)
    ctx.fill()
}
