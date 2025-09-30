const express = require('express');
const router = express.Router();
const zap = require('./baileys');

const API_KEY = process.env.API_KEY || 'minhaChave';

function checkKey(req, res, next) {
  if (req.body.apikey !== API_KEY) {
    return res.status(401).json({ error: 'API key inválida' });
  }
  next();
}

router.post('/instancia', checkKey, async (req, res) => {
  try {
    const { usuario_id, emissor } = req.body;
    await zap.createInstance(usuario_id, emissor);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/qrcode/:usuario_id', async (req, res) => {
  const qr = zap.getQRCode(req.params.usuario_id);
  qr ? res.json({ qr }) : res.status(404).json({ error: 'QR não disponível' });
});

router.get('/status/:usuario_id', (req, res) => {
  res.json(zap.getStatus(req.params.usuario_id));
});

router.delete('/instancia', checkKey, (req, res) => {
  const { usuario_id } = req.body;
  const ok = zap.removeInstance(usuario_id);
  res.json({ removed: ok });
});

// Mensagem padrão
router.post('/mensagem', checkKey, async (req, res) => {
  try {
    const { usuario_id, receptor } = req.body;

    // MENSAGEM PADRÃO AQUI
    const texto = "Animado pra nosso encontro";

    const result = await zap.sendText(usuario_id, receptor, texto);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/conexoes', (req, res) => {
  res.json({ conexoes: zap.listConnections() });
});

module.exports = router;
