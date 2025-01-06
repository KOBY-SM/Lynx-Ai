import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `☁️ Ingresa un enlace de YouTube válido.`, m,rcanal);
  }

  await m.react('🕓');

  const apiUrl = `https://axeel.my.id/api/download/audio?url=${text}`;

  try {
    const response = await fetch(apiUrl);
    const json = await response.json();
    const metadata = json.metadata;
    const downloads = json.downloads;
    const downloadUrl = downloads.url;
    const title = metadata.title || "Archivo MP3";

    const audioResponse = await fetch(downloadUrl);
    const contentLength = audioResponse.headers.get('content-length');
    const sizeMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;

    const isLarge = sizeMB > 15; // Límite de tamaño en MB
    const messageType = isLarge ? 'document' : 'audio';
    const mimeType = 'audio/mpeg';

    await m.react('✅');
    await conn.sendMessage(m.chat,
      {
        [messageType]: { url: downloadUrl },
        fileName: `${title}.mp3`,
        mimetype: mimeType,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(`⚠️ Error:`, error.message);
    await m.react('❌');
  }
};

handler.help = ['ytmp3 *<url>*'];
handler.tags = ['dl'];
handler.command = ['ytmp3'];
handler.register = true;
export default handler;
