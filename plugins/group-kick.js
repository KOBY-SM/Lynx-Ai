let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
    let kickte = `🚩 Menciona al usuario que deseas eliminar.`;

    if (!m.mentionedJid[0] && !m.quoted) 
        return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    let ownerJid = m.chat.split`-`[0] + '51968382008@s.whatsapp.net'; // Aquí defines al creador del grupo

    // Si el usuario es el creador, no se puede eliminar.
    if (user === ownerJid) {
        return conn.reply(m.chat, `🚩 No puedo eliminar al propietario del grupo porque es mi creador.`, null, { mentions: [user] });
    }

    // Si no es el creador, procede a eliminar al usuario.
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove'); 
    await m.reply(`🚩 Usuario eliminado.`, m.chat, { mentions: [user] });
    await conn.reply(user, `Lo siento, acabas de ser eliminado del grupo.`, m.chat);
};

handler.help = ['kick *@user*'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar'];
handler.admin = true;
handler.group = true; 
handler.botAdmin = true;

export default handler;
