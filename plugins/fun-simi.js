import fetch from 'node-fetch';

const handler = async (m, { text, command, args, usedPrefix }) => {
  if (!text) {
    return m.reply(`*• Ingresa un texto*\n\n*Ejemplo:*\n*${usedPrefix + command}* Hola bot`);
  }
  
  await m.react('📩');

  try {
    const apiBingia = await fetch(`https://delirius-apiofc.vercel.app/ia/bingia?query=${encodeURIComponent(text)}`);
    const resBingia = await apiBingia.json();

    if (resBingia.status) {
      m.reply(resBingia.data); 
    } else {
      const apiChatGPT = await fetch(`https://delirius-apiofc.vercel.app/ia/chatgpt?q=${encodeURIComponent(text)}`);
      const resChatGPT = await apiChatGPT.json();

      if (resChatGPT.status) {
        m.reply(resChatGPT.data);
      } else {
        console.log("Error en la respuesta de la API de ChatGPT");
      }
    }
  } catch (error) {
    await m.react('❌');
  }
};

handler.help = ['simi'];
handler.tags = ['fun'];
handler.command = /^((sim)?simi|alexa|cortana|bot)$/i;

export default handler;
