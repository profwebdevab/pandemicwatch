import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0a0a0f"/>
  <rect x="20" y="20" width="472" height="472" fill="none" stroke="#00ff87" stroke-width="8" rx="24"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="#00ff87" stroke-width="14"/>
  <rect x="235" y="154" width="42" height="204" fill="#00ff87"/>
  <rect x="154" y="235" width="204" height="42" fill="#00ff87"/>
  <text x="256" y="460" text-anchor="middle" font-family="monospace" font-size="36" fill="#00ff87" opacity="0.7">PW</text>
</svg>`

const buf = Buffer.from(svg)

await Promise.all([
  sharp(buf).resize(192, 192).png().toFile('public/icons/icon-192.png'),
  sharp(buf).resize(512, 512).png().toFile('public/icons/icon-512.png'),
])

console.log('Icons generated: icon-192.png, icon-512.png')
