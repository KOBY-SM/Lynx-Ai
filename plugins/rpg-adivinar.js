let guessGame = {}

let handler = async (m, { conn }) => {
  let name = conn.getName(m.sender)
  
  if (guessGame[m.sender]) {
    return conn.reply(m.chat, `🚩 ${name}, ya estás en una partida de adivinanza! Espera que termine para jugar otra.`, m)
  }

  const numeroSecreto = Math.floor(Math.random() * 100) + 1 // Genera un número entre 1 y 100
  guessGame[m.sender] = { numeroSecreto, intentos: 5 }

  conn.reply(m.chat, `🚩 Hola ${name}, he elegido un número entre 1 y 100. Tienes 5 intentos para adivinarlo. ¡Buena suerte!`, m)

  // Ahora esperamos una respuesta del usuario
  const msgHandler = async (msg) => {
    if (msg.body.startsWith('!adivinar')) { // Asegúrate de que el mensaje sea un intento de adivinanza
      const userGuess = parseInt(msg.body.split(' ')[1]) // Extrae el número del mensaje
      if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        return conn.reply(m.chat, "🚩 Por favor, ingresa un número válido entre 1 y 100.", m)
      }

      // Verifica si adivinó correctamente
      if (userGuess === guessGame[m.sender].numeroSecreto) {
        conn.reply(m.chat, `🎉 ¡Felicidades ${name}! Adivinaste el número correctamente. Ganaste 50 XP.`, m)
        global.db.data.users[m.sender].exp += 50
        delete guessGame[m.sender]
      } else {
        guessGame[m.sender].intentos--
        if (guessGame[m.sender].intentos === 0) {
          conn.reply(m.chat, `🚩 Lo siento ${name}, se te acabaron los intentos. El número era ${guessGame[m.sender].numeroSecreto}.`, m)
          delete guessGame[m.sender]
        } else {
          conn.reply(m.chat, `🚩 Incorrecto, te quedan ${guessGame[m.sender].intentos} intentos. Intenta de nuevo.`, m)
        }
      }
    }
  }

  // Aquí procesas los mensajes con sendMessage o directamente con el bot para escuchar las respuestas
  conn.sendMessage(m.chat, { text: '🚩 ¡Adivina el número!' }) // Muestra el mensaje de bienvenida
  // Aquí podría ir la lógica para que el bot espere la respuesta y ejecute el msgHandler
}

handler.command = ['adivinar']
export default handler
