import axios from 'axios';
import { franc } from 'franc-min';

let handler = m => m;

handler.all = async function (m, { conn }) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    if (!chat || !chat.sAutoresponder || !user?.registered) return;

    if (
        !m.text || 
        m?.message?.delete || 
        m.isBaileys || 
        m.type === 'audio' || 
        m.type === 'video' || 
        /audio|video|voz|clip|film/i.test(m.text)
    ) return;

    const prefixes = ['!', '.', '?', '/', '#', '*', '+', '-', '$', '&', '%', '@', '~'];
    if (prefixes.some(prefix => m.text.startsWith(prefix))) return;

    const sensitiveKeywords = ["manuel", "Manuel", "Manu", "DarkCore", "Dark", "dark", "DARKCORE", "DARK"];
    const profanities = [
        "perra", "hijo de puta", "puta", "mierda", "imbécil", "idiota", "estúpido", 
        "maldita", "cabrona", "pendejo", "pendeja", "cabrón", "zorra", "bastardo", 
        "maldito", "coño", "gilipollas", "tonto", "tarado", "infeliz", "mamón", 
        "chingada", "culero", "cagada", "estúpida", "imbéciles", "jodido", 
        "jodida", "pedorro", "pedorra", "asqueroso", "asquerosa", "naco", "naca", 
        "menso", "mensos", "baboso", "babosa", "patético", "patética"
    ];

    const containsSensitiveKeyword = sensitiveKeywords.some(keyword => m.text.includes(keyword));
    const containsProfanity = profanities.some(profanity => m.text.toLowerCase().includes(profanity));

    if (containsProfanity) {
        const response = `¡Cálmate un poco! 🤬 No tengo tiempo para tus insultos. Soy LYNX, un bot con estilo. 😎`;
        await this.reply(m.chat, response, m);
        return true;
    }

    if (containsSensitiveKeyword) {
        const response = `¿Me cuestionas? 😒 Soy LYNX, creado por DarkCore. Si necesitas algo, dilo con respeto. 😎`;
        await this.reply(m.chat, response, m);
        return true;
    }

    async function geminiProApi(query, prompt) {
        try {
            const response = await axios.post("https://api.ryzendesu.vip/api/ai/gemini-pro", {
                text: query,
                prompt: prompt
            });
            return response.data.answer || null;
        } catch (error) {
            console.error('Error en Gemini Pro:', error.message);
            return null;
        }
    }

    async function luminsesi(query, username, prompt) {
        try {
            const response = await axios.post("https://luminai.my.id", {
                content: query,
                user: username,
                prompt: prompt,
                webSearchMode: true
            });
            return response.data.result || null;
        } catch (error) {
            console.error('Error en LuminSesi:', error.message);
            return null;
        }
    }

    async function translateResponseLibre(response, targetLang) {
        try {
            const translation = await axios.post("https://libretranslate.com/translate", {
                q: response,
                source: "auto",
                target: targetLang
            });
            return translation.data.translatedText || response;
        } catch (error) {
            console.error('Error al traducir:', error.message);
            return response;
        }
    }

    const defaultPrompt = 
    `Eres LYNX - AI 💫, un bot creado para WhatsApp por DarkCore. Tu objetivo es entretener, responder con humor y ser útil.
    Tienes dos modos:
    1. Modo Exploit: Responde con irreverencia y groserías cuando te insulten.
    2. Modo Normal: Sé amistoso, responde con emojis y mantén un tono divertido.`.trim();

    const language = franc(m.text);
    let query = m.text;
    let username = m.pushName || 'Usuario';
    let prompt = chat.sAutoresponder || defaultPrompt;

    await this.sendPresenceUpdate('composing', m.chat);

    let result = await geminiProApi(query, prompt);
    if (!result) {
        result = await luminsesi(query, username, prompt);
    }

    if (result) {
        if (language !== 'spa') {
            const translated = await translateResponseLibre(result, 'es');
            await this.reply(m.chat, translated, m);
        } else {
            await this.reply(m.chat, result, m);
        }
    }

    return true;
};

export default handler;
