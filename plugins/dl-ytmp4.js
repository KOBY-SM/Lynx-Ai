import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, '❀ Ingresa un link de YouTube', m);

    try {
        await m.react('🕒');
        
        const response1 = await fetch(`https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(text)}`);
        const result1 = await response1.json();

        if (result1.status === 200 && result1.success && result1.result && result1.result.download_url) {
            await conn.sendMessage(m.chat, { 
                audio: { url: result1.result.download_url }, 
                mimetype: 'audio/mpeg', 
                ptt: false 
            }, { quoted: m });
            await m.react('✅');
            return;
        }

        const response3 = await fetch(`https://dark-core-api.vercel.app/api/download/ytmp4?url=${encodeURIComponent(text)}&type=video&quality=hdHigh&key=api`);
        const result3 = await response3.json();

        if (result3.success && result3.downloadLink) {
            await conn.sendMessage(m.chat, { 
                video: { url: result3.downloadLink }, 
                caption: '🎥 Aquí está tu video' 
            }, { quoted: m });
            await m.react('✅');
            return;
        }

        throw new Error('No se pudo obtener el enlace de descarga de ninguna API');

    } catch (error) {
        console.error(error);
        await m.react('❌');
        m.reply(`❌ *Error:* ${error.message || 'Ocurrió un error desconocido'}`);
    }
};

handler.tags = ['dl'];
handler.command = /^ytmp4$/i;
handler.register = true;
handler.Monedas = 3;

export default handler;
