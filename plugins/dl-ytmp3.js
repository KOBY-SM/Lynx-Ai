import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `☁️ Ingresa un enlace de YouTube válido.`, m, rcanal);
  }

  await m.react('🕓');

  const api1 = `https://axeel.my.id/api/download/audio?url=${text}`;
  const api2 = `https://restapi.apibotwa.biz.id/api/ytmp3?url=${text}`;

  try {
    let response = await fetch(api1);
    if (!response.ok) throw new Error('Primera API falló');
    let json = await response.json();

    const metadata = json.metadata;
    const downloads = json.downloads;
    const downloadUrl = downloads.url;
    const title = metadata.title || "Archivo MP3";

    const audioResponse = await fetch(downloadUrl);
    const contentLength = audioResponse.headers.get('content-length');
    const sizeMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;

    const isLarge = sizeMB > 15;
    const messageType = isLarge ? 'document' : 'audio';
    const mimeType = 'audio/mpeg';

    await m.react('✅');
    return await conn.sendMessage(
      m.chat,
      {
        [messageType]: { url: downloadUrl },
        fileName: `${title}.mp3`,
        mimetype: mimeType,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(`⚠️ Primera API falló:`, error.message);

    try {
      let response = await fetch(api2);
      if (!response.ok) throw new Error('Segunda API falló');
      let json = await response.json();

      const metadata = json.result.metadata;
      const downloads = json.result.download;
      const downloadUrl = downloads.url;
      const title = metadata.title || "Archivo MP3";
      
      const audioResponse = await fetch(downloadUrl);
      const contentLength = audioResponse.headers.get('content-length');
      const sizeMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;

      const isLarge = sizeMB > 15; 
      const messageType = isLarge ? 'document' : 'audio';
      const mimeType = 'audio/mpeg';

      await m.react('✅');
      return await conn.sendMessage(m.chat,
        {
          [messageType]: { url: downloadUrl },
          fileName: `${title}.mp3`,
          mimetype: mimeType,
        },
        { quoted: m }
      );
    } catch (error) {
      console.error(`⚠️ Segunda API falló:`, error.message);
      await m.react('❌');
    }
  }
};

handler.help = ['ytmp3 *<url>*'];
handler.tags = ['dl'];
handler.command = ['ytmp3'];
handler.register = true;

export default handler;

