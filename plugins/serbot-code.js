const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = await import('@whiskeysockets/baileys');

import fs from "fs";
import pino from 'pino';
import NodeCache from 'node-cache';
import { Boom } from '@hapi/boom';
import { makeWASocket } from '../lib/simple.js';

if (!global.conns) global.conns = [];
if (!global.db) loadDatabase();

async function loadDatabase() {
    if (!fs.existsSync('./storage/data/database.json')) {
        fs.writeFileSync('./storage/data/database.json', JSON.stringify({ users: {}, sessions: {}, subBots: [] }, null, 2));
    }
    global.db = JSON.parse(fs.readFileSync('./storage/data/database.json', 'utf-8'));
}

async function saveDatabase() {
    fs.writeFileSync('./storage/data/database.json', JSON.stringify(global.db, null, 2));
}

let handler = async (m, { conn: _conn, args, usedPrefix }) => {
    let parent = args[0] && args[0] === 'plz' ? _conn : global.conn;

    if (!((args[0] && args[0] === 'plz') || (await global.conn).user.jid === _conn.user.jid)) {
        return m.reply(`Este comando solo puede ser usado en el bot principal! wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`);
    }

    async function serbot() {
        let authFolderB = m.sender.split('@')[0];
        const userFolderPath = `./LynxJadiBot/${authFolderB}`;

        if (!fs.existsSync(userFolderPath)) fs.mkdirSync(userFolderPath, { recursive: true });

        args[0] && fs.writeFileSync(`${userFolderPath}/creds.json`, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'));

        const { state, saveState } = await useMultiFileAuthState(userFolderPath);
        const msgRetryCounterCache = new NodeCache();
        const { version } = await fetchLatestBaileysVersion();
        let phoneNumber = m.sender.split('@')[0];
        let reconnectAttempts = 0;

        const connectionOptions = {
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })) },
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: true,
            msgRetryCounterCache,
            defaultQueryTimeoutMs: undefined,
            version
        };

        let conn = makeWASocket(connectionOptions);

        if (!conn.authState.creds.registered) {
            if (!phoneNumber) process.exit(0);
            let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
            setTimeout(async () => {
                let codeBot = await conn.requestPairingCode(cleanedNumber);
                codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
                let txt = `🔑 *Código de Vinculación*\n\n1️⃣ Abre WhatsApp\n2️⃣ Ve a "Dispositivos vinculados"\n3️⃣ Selecciona *Vincular con el número de teléfono*\n4️⃣ Introduce este código: *${codeBot}*\n\n⚠️ _Este código solo funciona en el número que lo solicitó._`;

                await parent.reply(m.chat, txt, m);
            }, 3000);
        }

        async function attemptReconnect() {
            if (reconnectAttempts < 5) { 
                setTimeout(() => {
                    reconnectAttempts++;
                    serbot();
                }, 5000 * reconnectAttempts);
            } else {
                console.log('❌ Máximos intentos de reconexión alcanzados.');
            }
        }

        async function connectionUpdate(update) {
            try {
                const { connection, lastDisconnect, isNewLogin } = update;
                if (isNewLogin) conn.isInit = true;
                const code = lastDisconnect?.error?.output?.statusCode;

                if (code && code !== DisconnectReason.loggedOut && !conn.ws.socket) {
                    let i = global.conns.indexOf(conn);
                    if (i < 0) return console.log(await creloadHandler(true).catch(console.error));

                    delete global.conns[i];
                    global.conns.splice(i, 1);
                    fs.rmdirSync(userFolderPath, { recursive: true });

                    if (parent && m.chat) {
                        await parent.sendMessage(m.chat, { text: "❌ Conexión perdida, reconectando..." }, { quoted: m });
                    }
                    attemptReconnect();
                }

                if (connection === 'open') {
                    conn.isInit = true;
                    global.conns.push({ user: conn.user, ws: conn.ws, connectedAt: Date.now() });

                    if (reconnectAttempts > 0) {
                        reconnectAttempts = 0;
                        if (parent && m.chat) {
                            await parent.reply(m.chat, '✅ Reconexión exitosa.');
                        }
                    }

                    if (parent && m.chat) {
                        await parent.reply(m.chat, 
                            `✨ *[ Conectado Exitosamente 🔱 ]*\n\nSi se desconecta, intentará reconectarse automáticamente. Si deseas eliminar el Sub Bot, borra la sesión en dispositivos vinculados.\n\n🔗 *Únete a nuestro canal para más soporte:* https://whatsapp.com/channel/0029Vaxk8vvEFeXdzPKY8f3F`, 
                            m
                        );
                    }

                    // 🔹 **Enviar el archivo creds.json al المستخدم عند الاتصال بنجاح**
                    if (fs.existsSync(`${userFolderPath}/creds.json`)) {
                        await parent.sendMessage(m.chat, { 
                            document: fs.readFileSync(`${userFolderPath}/creds.json`), 
                            mimetype: 'application/json', 
                            fileName: 'creds.json'
                        }, { quoted: m });
                    }
                }

                if (connection === 'close') {
                    if (parent && m.chat) {
                        await parent.sendMessage(m.chat, { text: "⚠️ Se desconectó, por favor borra la sesión con */delsession*." }, { quoted: m });
                        attemptReconnect();
                    }
                }

            } catch (error) {
                console.error("❌ Error en connectionUpdate:", error);
                if (error.code === 'ECONNRESET') {
                    console.log('❌ Error ECONNRESET detectado, reconectando...');
                    attemptReconnect();
                }
            }
        }

        let creloadHandler = async function (restartConn) {
            if (restartConn) {
                try { conn.ws.close() } catch { }
                conn.ev.removeAllListeners();
                conn = makeWASocket(connectionOptions);
            }

            conn.connectionUpdate = connectionUpdate.bind(conn);
            conn.ev.on('connection.update', conn.connectionUpdate);
        };

        creloadHandler(false);
    }

    serbot();
};

handler.help = ['code'];
handler.tags = ['serbot'];
handler.command = ['co', 'Code', 'serbot', 'serbot -code'];

export default handler;