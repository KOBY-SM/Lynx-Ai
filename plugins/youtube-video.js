import fetch from 'node-fetch';

const limit = 300 * 1024 * 1024;

let handler = async (m, { conn, text }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `⚠️ Debes etiquetar el mensaje que contenga el resultado de YouTube Play.`, m);
  }

  if (!m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y")) {
    return conn.reply(m.chat, `⚠️ El mensaje etiquetado no contiene un resultado de YouTube Play.`, m);
  }

  const urls = m.quoted.text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9_-]+)/gi);

  if (!urls || urls.length < 1) {
    return conn.reply(m.chat, `⚠️ No se encontraron enlaces válidos en el mensaje etiquetado.`, m);
  }

  await m.react('🕓');

  try {
    const apiUrl = `https://restapi.apibotwa.biz.id/api/ytmp4?url=${urls[0]}`;
    const response = await fetch(apiUrl);
    const { data } = await response.json();
    const { metadata, download } = data;
    const { title, thumbnail, duration } = metadata;
    const { url: downloadUrl, filename } = download;

    const size = download.size || '300MB';

    if (Number(size.replace(/[^0-9]/g, '')) * 1024 * 1024 > limit) {
      await conn.sendMessage(m.chat,
        {
          document: { url: downloadUrl },
          fileName: filename || `${title}.mp4`,
          mimetype: 'video/mp4',
          caption: `🎥 *Título:* ${title}\n⏱️ *Duración:* ${duration.timestamp}\n📦 *Nota:* El archivo supera los 300 MB, enviado como documento.`,
        },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(m.chat,
        {
          video: { url: downloadUrl },
          fileName: filename || `${title}.mp4`,
          mimetype: 'video/mp4',
          caption: `🎥 *Título:* ${title}\n⏱️ *Duración:* ${duration.timestamp}`,
          thumbnail: { url: thumbnail },
        },
        { quoted: m }
      );
    }

    await m.react('✅');
  } catch (error) {
    console.error('Error al procesar el video:', error);
    await m.react('✖️');
  }
};

handler.help = ['Video'];
handler.tags = ['downloader'];
handler.customPrefix = /^(Video|video|vídeo|Vídeo)/i;
handler.command = new RegExp;

export default handler;
