import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {
let img = await (await fetch(`https://th.bing.com/th/id/R.3c44682163aece471be5e9be31853c5f?rik=ffeQ00G9XjrtnA&riu=http%3a%2f%2fcdn.wallpapersafari.com%2f3%2f96%2fzCEgo6.jpg&ehk=AG0SIiF60d%2fqhZysxXu70HHHGZOSdQ5xhUnW0SeytiI%3d&risl=&pid=ImgRaw&r=0`)).buffer()
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
let txt = `*Hola!, te invito a unirte a los grupos oficiales de del Bot para convivir con la comunidad :D*

1- 
*✰* ${group}

2- 
*✰* ${group2}

*─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ*

➠ Enlace anulado? entre aquí! 

Canal :
*✰* ${canal}

> 🤍 ${textbot}`
await conn.sendFile(m.chat, img, "Thumbnail.jpg", txt, m, null, fake)
}
handler.help = ['grupos']
handler.tags = ['main']
handler.command = /^(grupos)$/i
export default handler
