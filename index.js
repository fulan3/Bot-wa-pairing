const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    browser: ['TermuxBot', 'Chrome', '10.0'],
    printQRInTerminal: false,
    syncFullHistory: false
  });

  sock.ev.on('connection.update', (up) => {
    const { connection, pairingCode } = up;

    if (pairingCode) {
      console.log(`\n🔐 Pairing Code: ${pairingCode}`);
      console.log('📲 Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat');
      console.log('🧠 Masukkan kode itu di sana.\n');
    }

    if (connection === 'open') {
      console.log('✅ Bot siap & tersambung ke WhatsApp!');
    }

    if (connection === 'close') {
      console.log('❌ Terputus. Mengulang sambungan...');
      startBot();
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    console.log(`📩 ${sender}: ${text}`);

    if (text?.toLowerCase() === 'ping') {
      await sock.sendMessage(sender, { text: 'pong 🏓' });
    }
    if (text?.toLowerCase() === 'assalamualaikum') {
      await sock.sendMessage(sender, { text: 'Waalaikumussalam 😇' });
    }
  });
}

startBot();
