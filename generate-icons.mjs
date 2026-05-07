// Run: node generate-icons.mjs
// Generates icon-192.png and icon-512.png using canvas
import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const r = size * 0.12

  // Background
  ctx.fillStyle = '#0e0f13'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, r)
  ctx.fill()

  // Gradient text - FORGE
  const grad = ctx.createLinearGradient(size * 0.1, size * 0.3, size * 0.9, size * 0.7)
  grad.addColorStop(0, '#c8f53e')
  grad.addColorStop(1, '#3ee8f5')
  ctx.fillStyle = grad
  ctx.font = `bold ${size * 0.38}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('F', size / 2, size / 2)

  return canvas.toBuffer('image/png')
}

try {
  writeFileSync('./public/icon-192.png', drawIcon(192))
  writeFileSync('./public/icon-512.png', drawIcon(512))
  console.log('Icons generated!')
} catch (e) {
  console.log('canvas not available - create icons manually or use a placeholder PNG')
}
