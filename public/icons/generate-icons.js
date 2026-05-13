// Run: node public/icons/generate-icons.js
// Generates basic SVG-based PNG icons for PWA
// For production, replace with proper icons using a tool like sharp or real design assets

const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, size, size)

  // Border
  ctx.strokeStyle = '#00ff87'
  ctx.lineWidth = size * 0.02
  ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9)

  // Circle (pulse)
  const cx = size / 2, cy = size / 2
  ctx.beginPath()
  ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2)
  ctx.strokeStyle = '#00ff87'
  ctx.lineWidth = size * 0.03
  ctx.stroke()

  // Cross / health symbol
  ctx.fillStyle = '#00ff87'
  const barW = size * 0.08, barH = size * 0.35
  ctx.fillRect(cx - barW / 2, cy - barH / 2, barW, barH)
  ctx.fillRect(cx - barH / 2, cy - barW / 2, barH, barW)

  return canvas.toBuffer('image/png')
}

;[192, 512].forEach((size) => {
  const buf = generateIcon(size)
  fs.writeFileSync(path.join(__dirname, `icon-${size}.png`), buf)
  console.log(`Generated icon-${size}.png`)
})
