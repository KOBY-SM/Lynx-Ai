let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  switch (type) {
  case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.bienvenida = isEnable
      break
      
  case 'antiarabe':
    case 'antiArabe':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiarabe = isEnable
      break
      

  case 'antiPrivate':
    case 'antiprivado':
    case 'antipriv':
     isAll = true
        if (!isOwner) {
          global.dfail('rowner', m, conn)
          throw false
      }
      bot.antiPrivate = isEnable
      break

  case 'restrict':
    case 'restringir':
     isAll = true
        if (!isOwner) {
          global.dfail('rowner', m, conn)
          throw false
      }
      bot.restrict = isEnable
      break

 case 'autolevelup':
    case 'autonivel':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autolevelup = isEnable
      break

 case 'antibot':
    case 'antibots':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot = isEnable
      break

 case 'autoaceptar':
    case 'aceptarauto':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoAceptar = isEnable
      break

 case 'autorechazar':
    case 'rechazarauto':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoRechazar = isEnable
      break

 case 'antisubbots':
    case 'antisub':
    case 'antisubot':
    case 'antibot2':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot2 = isEnable
      break

 case 'antifake':
    case 'antifakes':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antifake = isEnable
      break

  case 'autoresponder':
    case 'autorespond':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.sAutoresponder = isEnable
      break

 case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.modoadmin = isEnable
      break

 case 'autoread':
    case 'autoleer':
    case 'autover':
      isAll = true
       if (!isROwner) {
         global.dfail('rowner', m, conn)
         throw false
      }
      global.opts['autoread'] = isEnable
      break

  case 'antiver':
    case 'antiocultar':
    case 'antiviewonce':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiver = isEnable
      break

  case 'reaction':
    case 'reaccion':
    case 'emojis':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.reaction = isEnable
      break

  case 'audios':
    case 'audiosbot':
    case 'botaudios':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.audios = isEnable
      break

  case 'antiSpam':
    case 'antispam':
    case 'antispamosos':
     isAll = true
      if (!isOwner) {
      global.dfail('rowner', m, conn)
      throw false
      }
      bot.antiSpam = isEnable
      break

  case 'antidelete': 
    case 'antieliminar': 
    case 'delete':
     if (m.isGroup) {
     if (!(isAdmin || isOwner)) {
     global.dfail('admin', m, conn)
     throw false
     }}
     chat.delete = isEnable
     break

  case 'autobio':
    case 'status':
    case 'bio':
     isAll = true
        if (!isOwner) {
          global.dfail('rowner', m, conn)
          throw false
        }
      bot.autobio = isEnable
      break

  case 'jadibotmd':
    case 'serbot':
    case 'subbots':
     isAll = true
        if (!isOwner) {
          global.dfail('rowner', m, conn)
          throw false
      }
      bot.jadibotmd = isEnable
      break

  case 'detect':
    case 'configuraciones':
    case 'avisodegp':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break

  case 'simi':
    case 'autosimi':
    case 'simsimi':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.simi = isEnable
      break

    case 'document':
    case 'documento':
    isUser = true
    user.useDocument = isEnable
    break

    case 'antilink':
    if (m.isGroup) {
    if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn);
      throw false;
     }
  }
  chat.antiLink = isEnable; 
  break;


      case 'nsfw':
      case 'modohorny':
      if (m.isGroup) {
      if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      throw false
      }
    }
    chat.nsfw = isEnable          
    break
    default:
      if (!/[01]/.test(command)) return conn.reply(m.chat, `╭───────────────✦
│ 📜 *CONFIGURACIONES DEL CHAT:*
├───────────────╮
│ ➤ Welcome: ${chat.welcome ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AutoAceptar: ${chat.autoAceptar ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AutoRechazar: ${chat.autoRechazar ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiBot: ${chat.antiBot ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiArabe: ${chat.antiarabe ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiBot2: ${chat.antiBot2 ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiFake: ${chat.antifake ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AutoResponder: ${chat.autoresponder ? '✅ Activado' : '❌ Desactivado'}
│ ➤ Autolevelup: ${chat.autolevelup ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiEliminar: ${chat.delete ? '✅ Activado' : '❌ Desactivado'}
│ ➤ SimSimi: ${chat.simi ? '✅ Activado' : '❌ Desactivado'}
│ ➤ Audios: ${chat.audios ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiVer: ${chat.antiver ? '✅ Activado' : '❌ Desactivado'}
│ ➤ Detect: ${chat.detect ? '✅ Activado' : '❌ Desactivado'}
│ ➤ ModoAdmin: ${chat.modoadmin ? '✅ Activado' : '❌ Desactivado'}
│ ➤ NSFW: ${chat.modohorny ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiLink: ${chat.antiLink ? '✅ Activado' : '❌ Desactivado'}
╰───────────────╯

╭───────────────✦
│ 🌐 *CONFIGURACIONES GLOBALES:*
├───────────────╮
│ ➤ AntiPrivado: ${bot.antiPrivate ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AutoRead: ${global.opts['autoread'] ? '✅ Activado' : '❌ Desactivado'}
│ ➤ Restrict: ${bot.restrict ? '✅ Activado' : '❌ Desactivado'}
│ ➤ Autobio: ${bot.autobio ? '✅ Activado' : '❌ Desactivado'}
│ ➤ AntiSpam: ${bot.antiSpam ? '✅ Activado' : '❌ Desactivado'}
│ ➤ JadiBotMD: ${bot.jadibotmd ? '✅ Activado' : '❌ Desactivado'}
╰───────────────╯`, m, rcanal)
      throw false
  }
await conn.sendMessage(m.chat, { 
  text: `` +
        `*▷ 𝗢𝗽𝗰𝗶𝗼𝗻 |* ${type.toUpperCase()}\n` +
        `*▷ 𝗘𝘀𝘁𝗮𝗱𝗼 |* ${isEnable ? '✅ Activado' : '❌ Desactivado'}\n` +
        `*▷ 𝗣𝗮𝗿𝗮 |* ${isAll ? '🌍 Todo el Bot' : isUser ? '👤 Este Usuario' : '💬 Este Chat'}`,
  footer: dev, 
  buttons: [
    { 
      buttonId: isEnable ? `.off ${type}` : `.on ${type}`, 
      buttonText: { displayText: isEnable ? '❌ Desactivado' : '✅ Activado' } 
    },
  ],
  viewOnce: true,
  headerType: 1
}, { quoted: estilo });
//  conn.reply(m.chat, `🚩 La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este Bot' : isUser ? '' : 'para este chat'}`, m, rcanal)
}

handler.help = ['enable *<opción>*', 'disable *<opción>*', 'on *<opción>*', 'off *<opción>*']
handler.tags = ['enable']
handler.command = ['enable', 'disable', 'on', 'off', '1', '0']

export default handler
