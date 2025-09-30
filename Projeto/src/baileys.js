const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const sessions = new Map(); // guarda conexões por usuario_id

async function createInstance(usuario_id, emissor) {
  const authPath = path.join(__dirname, `../sessions/${usuario_id}`);
  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  const sock = makeWASocket({ auth: state });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) sessions.get(usuario_id).qr = qr;

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        createInstance(usuario_id, emissor);
      } else {
        sessions.delete(usuario_id);
      }
    }
  });

  sessions.set(usuario_id, { sock, qr: null });
  return usuario_id;
}

function getStatus(usuario_id) {
  const inst = sessions.get(usuario_id);
  if (!inst) return { status: 'not_found' };
  return { status: inst.sock.user ? 'connected' : 'connecting' };
}

function getQRCode(usuario_id) {
  const inst = sessions.get(usuario_id);
  return inst ? inst.qr : null;
}

function removeInstance(usuario_id) {
  if (sessions.has(usuario_id)) {
    sessions.get(usuario_id).sock.logout();
    sessions.delete(usuario_id);
    return true;
  }
  return false;
}

async function sendText(usuario_id, receptor, texto) {
  const inst = sessions.get(usuario_id);
  if (!inst) throw new Error('Instância não encontrada');
  return await inst.sock.sendMessage(receptor + '@s.whatsapp.net', { text: texto });
}

function listConnections() {
  return Array.from(sessions.keys());
}

module.exports = {
  createInstance,
  getStatus,
  getQRCode,
  removeInstance,
  sendText,
  listConnections
};
