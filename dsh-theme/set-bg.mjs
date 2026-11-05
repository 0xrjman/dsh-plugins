import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const file = fileURLToPath(new URL('./client.js', import.meta.url))
const [arg] = process.argv.slice(2)
if (!arg) {
  console.log('usage: node set-bg.mjs <image-path>')
  process.exit(1)
}

const ext = (arg.match(/\.([a-z0-9]+)$/i) || [null, 'jpg'])[1].toLowerCase()
const mime = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }[ext] ?? 'image/jpeg'
const url = 'data:' + mime + ';base64,' + readFileSync(arg).toString('base64')
const css = 'body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:url("' + url + '") center/cover no-repeat fixed;opacity:.85}'

let src = readFileSync(file, 'utf8')
const start = src.indexOf('const WALLPAPER_CSS = ')
const open = src.indexOf('`', start)
const end = src.indexOf('`', open + 1)
if (start < 0 || open < 0 || end < 0) {
  console.log('set-bg.mjs: no WALLPAPER_CSS constant found in ' + file)
  process.exit(1)
}
writeFileSync(file, src.slice(0, start) + 'const WALLPAPER_CSS = `' + css + '`' + src.slice(end + 1))
console.log('client.js WALLPAPER_CSS updated from ' + arg + ' (' + url.length + ' char data URL)')
