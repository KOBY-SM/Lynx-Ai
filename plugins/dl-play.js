import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import yts from 'yt-search'; // Importamos yt-search

// Reemplazar __dirname para que sea válido en módulos ES
const __dirname = path.resolve(); // Esto te dará la ruta absoluta del directorio

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa el nombre del video que deseas buscar`, m);

  await m.react('🕓');

  try {
    // Usamos yt-search para buscar el video en YouTube
    const { videos } = await yts(text); // 'videos' contiene la lista de resultados de búsqueda
    if (!videos.length) {
      return conn.reply(m.chat, '❌ No se encontraron resultados en YouTube para tu búsqueda.', m);
    }

    // Obtenemos el primer video de los resultados
    const video = videos[0];
    const videoUrl = video.url;
    const title = video.title; // Título del video
    const thumbnail = video.thumbnail; // Miniatura del video
    const duration = video.timestamp; // Duración del video

    // Hacer la petición a la API para obtener el enlace de descarga
    let api = await (await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${videoUrl}`)).json();

    // Verificar que la respuesta contiene los datos esperados
    if (!api || !api.data || !api.data.dl) {
      return conn.reply(m.chat, '❌ No se pudo obtener el enlace de descarga. Por favor verifica el enlace de YouTube.', m);
    }

    // Obtener el enlace de descarga MP4
    let dl_url = api.data.dl;

    // Asegúrate de que la carpeta tmp exista
    const tmpDir = path.join(__dirname, 'tmp'); // Cambié __dirname por la variable corregida
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // Generar nombres únicos usando un timestamp
    const timestamp = Date.now();
    const tmpMp4Path = path.join(tmpDir, `video_${timestamp}.mp4`);
    const tmpMp3Path = path.join(tmpDir, `audio_${timestamp}.mp3`);

    // Descargar el MP4
    await fetch(dl_url)
      .then(res => {
        const dest = fs.createWriteStream(tmpMp4Path);
        res.body.pipe(dest);
        return new Promise((resolve, reject) => {
          res.body.on('end', resolve);
          res.body.on('error', reject);
        });
      })
      .catch(err => {
        console.error('Error al descargar el MP4:', err);
        throw new Error('Error al descargar el video');
      });

    // Convertir MP4 a MP3
    await new Promise((resolve, reject) => {
      ffmpeg(tmpMp4Path)
        .output(tmpMp3Path)
        .audioCodec('libmp3lame')
        .on('end', () => {
          console.log('Conversión a MP3 finalizada');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error durante la conversión:', err);
          reject(err);
        })
        .run();
    });

    // Enviar imagen, título y duración antes de enviar el archivo MP3
    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: `*Título:* ${title}\n*Duración:* ${duration}\n*¡Aquí tienes tu audio!*`
      },
      { quoted: m }
    );

    // Enviar el archivo MP3
    await conn.sendMessage(m.chat, { audio: { url: tmpMp3Path }, mimetype: 'audio/mp4', caption: `*Aquí tienes tu audio*` }, { quoted: m });

    // Limpiar archivos temporales
    fs.unlinkSync(tmpMp4Path);
    fs.unlinkSync(tmpMp3Path);

    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
    conn.reply(m.chat, '❌ Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.', m);
  }
};

handler.help = ['play *<texto>*'];
handler.tags = ['downloader'];
handler.command = ['play'];
handler.register = true;

export default handler;
