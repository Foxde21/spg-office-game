#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

function readPNGSize(buffer) {
  if (buffer.length < 24) throw new Error('Invalid PNG')
  // IHDR chunk contains width/height; search for it
  for (let i = 8; i < buffer.length - 8; i++) {
    if (buffer[i] === 73 && buffer[i + 1] === 72 && buffer[i + 2] === 68 && buffer[i + 3] === 82) {
      const w = buffer.readUInt32BE(i + 4)
      const h = buffer.readUInt32BE(i + 8)
      return { width: w, height: h }
    }
  }
  throw new Error('IHDR chunk not found')
}

const inputArg = (process.argv[2] || '')
const inputPath = inputArg.toString().trim()
if (!inputPath) {
  console.error('Usage: node scripts/gen-atlas-single-frame.mjs <path-to-png>')
  process.exit(1)
}

const abs = path.resolve(inputPath)
if (!existsSync(abs)) {
  console.error('Input file not found:', abs)
  process.exit(2)
}

const buf = readFileSync(abs)
let size
try {
  size = readPNGSize(buf)
} catch (e) {
  console.error('Failed to read PNG size:', e.message)
  process.exit(3)
}

const imageFile = path.basename(abs)
const atlas = {
  textures: [
    {
      image: imageFile,
      frames: [
        {
          filename: 'sheet',
          frame: { x: 0, y: 0, w: size.width, h: size.height }
        }
      ]
    }
  ]
}

const outPath = path.join(path.dirname(abs), 'PixelOfficeAssetsAtlas.json')
writeFileSync(outPath, JSON.stringify(atlas, null, 2), 'utf8')
console.log('Atlas written to', outPath)
