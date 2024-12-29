import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '*\`Ingresa el nombre de lo que quieres buscar\`*', m);
  }

  await m.react('🕓');
  try {
    // Buscar el video
    let res = await search(args.join(" "));
    let video = res[0];
    let img = await (await fetch(video.image)).buffer();

    // Crear el texto del mensaje
    let txt = `*\`【Y O U T U B E - P L A Y】\`*\n\n`;
    txt += `• *\`Título:\`* ${video.title}\n`;
    txt += `• *\`Duración:\`* ${secondString(video.duration.seconds)}\n`;
    txt += `• *\`Publicado:\`* ${eYear(video.ago)}\n`;
    txt += `• *\`Canal:\`* ${video.author.name || 'Desconocido'}\n`;
    txt += `• *\`Url:\`* _https://youtu.be/${video.videoId}_\n\n`;

    await conn.sendMessage(m.chat, {
      image: img,
      caption: txt,
      footer: 'Selecciona una opción:',
      buttons: [
        {
          buttonId: `.ytmp3 https://youtu.be/${video.videoId}`,
          buttonText: { displayText: '🎵 Audio' },
          type: 1,
        },
        {
          buttonId: `.ytmp4 https://youtu.be/${video.videoId}`,
          buttonText: { displayText: '🎥 Video' },
          type: 1,
        },
        {
          buttonId: `https://youtu.be/${video.videoId}`,
          buttonText: { displayText: '🌐 Ver en YouTube' },
          type: 1,
        },
      ],
      headerType: 4,
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('✖️');
    conn.reply(m.chat, '*\`Error al buscar el video.\`*', m);
  }
};

handler.help = ['play3 *<texto>*'];
handler.tags = ['dl'];
handler.command = ['play3'];

export default handler;

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return search.videos;
}

// Función para convertir segundos a formato legible
function secondString(seconds) {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
}

// Función para traducir el texto de "hace X tiempo" al español
function eYear(txt) {
  if (txt.includes('year')) return txt.replace('year', 'año').replace('years', 'años');
  if (txt.includes('month')) return txt.replace('month', 'mes').replace('months', 'meses');
  if (txt.includes('day')) return txt.replace('day', 'día').replace('days', 'días');
  if (txt.includes('hour')) return txt.replace('hour', 'hora').replace('hours', 'horas');
  if (txt.includes('minute')) return txt.replace('minute', 'minuto').replace('minutes', 'minutos');
  return txt;
}
