import { readFileSync } from 'fs'
import { PNG } from 'pngjs'

const data = readFileSync('public/assets/PixelOffice/PixelOfficeAssets.png')
const png = PNG.sync.read(data)
const { width, height } = png

const isOpaque = (x, y) => {
  const idx = (y * width + x) * 4
  return png.data[idx + 3] > 10
}

const visited = new Uint8Array(width * height)
const sprites = []

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (visited[y * width + x] || !isOpaque(x, y)) continue
    let minX = x, minY = y, maxX = x, maxY = y
    const stack = [[x, y]]
    while (stack.length) {
      const [cx, cy] = stack.pop()
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue
      if (visited[cy * width + cx] || !isOpaque(cx, cy)) continue
      visited[cy * width + cx] = 1
      minX = Math.min(minX, cx)
      minY = Math.min(minY, cy)
      maxX = Math.max(maxX, cx)
      maxY = Math.max(maxY, cy)
      stack.push([cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1])
    }
    const w = maxX - minX + 1
    const h = maxY - minY + 1
    if (w >= 4 && h >= 4) {
      sprites.push({ x: minX, y: minY, w, h })
    }
  }
}

sprites.sort((a, b) => a.y - b.y || a.x - b.x)
sprites.forEach(s => {
  console.log(`x:${s.x} y:${s.y} w:${s.w} h:${s.h}`)
})
