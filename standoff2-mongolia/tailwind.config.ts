import type { Config } from 'tailwindcss'
const config: Config = { content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'], theme:{ extend:{ colors:{ bg:'#080A0F', panel:'#10141D', panel2:'#171D29', red:'#FF3A2F' }, fontFamily:{ barlow:['var(--font-barlow)'], mono:['var(--font-mono)'] } } }, plugins:[] }
export default config
