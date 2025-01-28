import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!global.db.data.chats[m.chat].nsfw) {
    return conn.reply(m.chat, `🚩 El grupo no admite contenido *Nsfw.*\n\n> Para activarlo un *Administrador* debe usar el comando */on nsfw*`, m, rcanal);
}
  await m.react('🕓');  // Reacción para indicar que está procesando

  if (!text) throw 'Proporcióname un enlace de video para descargar.';

  try {
    // Creamos la URL de la API con el enlace proporcionado
    const apiUrl = `https://dark-core-api.vercel.app/api/download/xvideo?key=user1&url=${encodeURIComponent(text)}`;

    // Realizamos la solicitud a la API
    const response = await fetch(apiUrl);

    // Verificamos si la respuesta es exitosa
    if (response.ok) {
      const data = await response.json();

      if (data.success && data.results && data.results.VideoUrlHigh) {
        const videoUrl = data.results.VideoUrlHigh;

        await conn.sendMessage(m.chat, { 
          video: { url: videoUrl }, 
          mimetype: 'video/mp4' 
        }, { quoted: m });

        await m.react('✅');  // Reacción de éxito
      } else {
        throw new Error('No se encontraron resultados');
      }
    } else {
      throw new Error('Error al realizar la solicitud');
    }
  } catch (error) {
    await m.react('❌');  // Reacción de error
    m.reply(`❌ *Error:* ${error.message || 'Ocurrió un error desconocido'}`);
  }
};

handler.help = ['xvideo'];
handler.command = ['xvideo', 'xvideodownload'];
handler.register = true;

export default handler;
