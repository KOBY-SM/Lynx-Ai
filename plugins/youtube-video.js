import fetch from 'node-fetch';
import { exec } from 'child_process';
import fs from 'fs/promises';
import { promisify } from 'util';

const execPromise = promisify(exec);
const videoLimit = 300 * 1024 * 1024;
const tempDir = './tmp';

let handler = async (m, { conn, text }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `⚠️ Debes etiquetar el mensaje que contenga el resultado de YouTube Play.`, m);
  }

  if (!m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y")) {
    return conn.reply(m.chat, `⚠️ El mensaje etiquetado no contiene un resultado de YouTube Play.`, m);
  }

  const urls = m.quoted.text.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11,})/gi
  );

  if (!urls || urls.length < 1) {
    return conn.reply(m.chat, `⚠️ No se encontraron enlaces válidos en el mensaje etiquetado.`, m);
  }

  const videoUrl = urls[0];
  await m.react('🕓');

  const apiUrls = [
    `https://api.vreden.web.id/api/ytmp4?url=${videoUrl}`,
    `https://delirius-apiofc.vercel.app/download/ytmp4?url=${videoUrl}`,
  ];

  let data = null;

  for (const apiUrl of apiUrls) {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.status && result.result?.download) {
        data = result.result;
        break;
      } else if (result.success && result.data?.download) {
        data = result.data;
        break;
      }
    } catch (error) {
      console.error(`Error al intentar con la API: ${apiUrl}`, error.message);
    }
  }

  if (!data) {
    await m.react('✖️');
  }

  await handleVideoDownload(conn, m, data);
};

const handleVideoDownload = async (conn, m, data) => {
  const { title, duration, thumbnail, download } = data;
  const downloadUrl = download?.url || download;

  const tempPath = `${tempDir}/${Date.now()}.mp4`;

  try {
    await downloadFile(downloadUrl, tempPath);

    const { size: fileSize } = await fs.stat(tempPath);

    if (fileSize > videoLimit) {
      const compressedPath = `${tempDir}/compressed_${Date.now()}.mp4`;
      await compressVideo(tempPath, compressedPath);

      const { size: compressedSize } = await fs.stat(compressedPath);

      const isLarge = compressedSize > videoLimit;
      const messageOptions = {
        caption: isLarge
          ? `⚠️ El archivo comprimido aún supera el límite permitido (${(videoLimit / 1024 / 1024).toFixed(2)} MB). Se envía como documento.\n\n🎥 *Título:* ${title}\n⏱️ *Duración:* ${duration}`
          : `🎥 *Título:* ${title}\n⏱️ *Duración:* ${duration}`,
        quoted: m,
      };

      await conn.sendMessage(
        m.chat,
        isLarge
          ? {
              document: { url: compressedPath },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
            }
          : {
              video: { url: compressedPath },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
            },
        messageOptions
      );

      await fs.unlink(tempPath);
      await fs.unlink(compressedPath);
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: tempPath },
          fileName: `${title}.mp4`,
          mimetype: 'video/mp4',
        },
        { quoted: m }
      );

      await fs.unlink(tempPath);
    }

    await m.react('✅');
  } catch (error) {
    console.error('Error al manejar el video:', error);
    await m.react('✖️');
  }
};

const downloadFile = async (url, dest) => {
  const response = await fetch(url);
  const fileStream = await fs.open(dest, 'w');
  await new Promise((resolve, reject) => {
    response.body
      .pipe(fileStream.createWriteStream())
      .on('finish', resolve)
      .on('error', reject);
  });
};

const compressVideo = async (inputPath, outputPath) => {
  const ffmpegCommand = `ffmpeg -i "${inputPath}" -vf scale=1280:-2 -c:v libx264 -crf 28 -preset fast "${outputPath}"`;
  await execPromise(ffmpegCommand);
};

handler.help = ['video'];
handler.tags = ['downloader'];
handler.customPrefix = /^(video|vídeo)$/i;
handler.command = new RegExp;

export default handler;
