import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw m.reply(`El comando necesita una descripción para empezar a dibujar.\n\n *✧ Ejemplo:*\n${usedPrefix + command} Wooden house on snow mountainh`);
    await m.reply("")

    await conn.relayMessage(m.chat, { reactionMessage: { key: m.key, text: '👌' } }, { messageId: m.key.id })
    try {
        let url = `https://widipe.com/dalle?text=${text}`

        await conn.sendFile(m.chat, await (await fetch(url)).buffer(), 'dalle.jpg',m,rcanal)
        m.react("👌")

    } catch (e) {
        console.log(e)
        conn.reply("x")
    }
}

handler.help = ['dalle <txt>']
handler.tags = ['ai']
handler.command = /^(dalle)$/i

handler.premium = false
handler.limit = 5
handler.register = true

export default handler
