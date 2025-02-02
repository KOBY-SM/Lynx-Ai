let mascotas = {};
let timer = {};

let handler = async (m, { conn, text, sender }) => {
  let tienda = `🐶🐱🐾 *Tienda de Mascotas* 🐾🐱🐶\n\n`;
  tienda += `🦴 *1.* Comida para perros - 10 monedas\n`;
  tienda += `🐟 *2.* Comida para gatos - 10 monedas\n`;
  tienda += `🛏 *3.* Cama para mascotas - 30 monedas\n`;
  tienda += `🎾 *4.* Juguete para mascotas - 15 monedas\n`;
  tienda += `💊 *5.* Medicina para mascotas - 20 monedas\n`;
  tienda += `\n💰 Usa *!comprar <número>* para adquirir un producto.`;

  if (!mascotas[sender]) {
    mascotas[sender] = {
      nombre: 'Max',
      raza: 'Labrador',
      edad: 3,
      estadoSalud: 'Excelente',
      vida: 100,
      monedas: 50 // Agregamos un atributo de monedas para el usuario
    };
  }

  let infomascota = `🐾 *Información de la mascota* 🐾\n\n`;
  infomascota += `Nombre: ${mascotas[sender].nombre}\n`;
  infomascota += `Raza: ${mascotas[sender].raza}\n`;
  infomascota += `Edad: ${mascotas[sender].edad} años\n`;
  infomascota += `Estado de salud: ${mascotas[sender].estadoSalud}\n`;
  infomascota += `Vida: ${mascotas[sender].vida} / 100\n`;

  if (text && text.startsWith('!nombre')) {
    let nuevoNombre = text.split(' ')[1];
    if (nuevoNombre) {
      mascotas[sender].nombre = nuevoNombre;
      conn.reply(m.chat, `¡El nombre de tu mascota ha sido cambiado a ${nuevoNombre}!`, m);
    } else {
      conn.reply(m.chat, 'Por favor, ingresa un nombre válido para la mascota.', m);
    }
    return;
  }

  if (text && text.startsWith('!alimentar')) {
    mascotas[sender].edad += 1;
    mascotas[sender].vida = Math.min(mascotas[sender].vida + 10, 100);
    conn.reply(m.chat, `¡Has alimentado a tu mascota! Ahora tiene ${mascotas[sender].edad} años y ${mascotas[sender].vida} de vida.`, m);
    return;
  }

  if (text && text.toLowerCase() === 'infomascota') {
    conn.reply(m.chat, infomascota, m);
  } else if (text && text.toLowerCase().startsWith('!comprar')) {
    let item = text.split(' ')[1];
    if (!item || isNaN(item)) {
      conn.reply(m.chat, 'Por favor, elige un número de producto válido (1-5).', m);
      return;
    }

    item = parseInt(item);

    if (item < 1 || item > 5) {
      conn.reply(m.chat, 'Número de producto inválido. Elige un número entre 1 y 5.', m);
      return;
    }

    if (item === 1 || item === 2) {
      if (mascotas[sender].monedas >= 10) {
        mascotas[sender].vida = Math.min(mascotas[sender].vida + 10, 100);
        mascotas[sender].monedas -= 10;
        conn.reply(m.chat, `¡Has comprado comida para tu mascota! Ahora tiene ${mascotas[sender].vida} de vida. Te quedan ${mascotas[sender].monedas} monedas.`, m);
      } else {
        conn.reply(m.chat, 'No tienes suficientes monedas para comprar este producto.', m);
      }
    } else if (item === 3) {
      if (mascotas[sender].monedas >= 30) {
        mascotas[sender].monedas -= 30;
        conn.reply(m.chat, `¡Has comprado una cama para tu mascota! Te quedan ${mascotas[sender].monedas} monedas.`, m);
      } else {
        conn.reply(m.chat, 'No tienes suficientes monedas para comprar este producto.', m);
      }
    } else if (item === 4) {
      if (mascotas[sender].monedas >= 15) {
        mascotas[sender].monedas -= 15;
        conn.reply(m.chat, `¡Has comprado un juguete para tu mascota! Te quedan ${mascotas[sender].monedas} monedas.`, m);
      } else {
        conn.reply(m.chat, 'No tienes suficientes monedas para comprar este producto.', m);
      }
    } else if (item === 5) {
      if (mascotas[sender].monedas >= 20) {
        mascotas[sender].monedas -= 20;
        conn.reply(m.chat, `¡Has comprado medicina para tu mascota! Te quedan ${mascotas[sender].monedas} monedas.`, m);
      } else {
        conn.reply(m.chat, 'No tienes suficientes monedas para comprar este producto.', m);
      }
    }
    return;
  } else {
    conn.reply(m.chat, tienda, m);
  }

  if (!timer[sender]) {
    timer[sender] = setInterval(() => {
      if (mascotas[sender].vida > 0) {
        mascotas[sender].vida -= 1;
        if (mascotas[sender].vida <= 0) {
          mascotas[sender].estadoSalud = 'En peligro';
        }
      }
    }, 60000);
  }
};

handler.command = ['tienda', 'petshop', 'infomascota', 'nombre', 'alimentar', 'comprar'];
export default handler;
