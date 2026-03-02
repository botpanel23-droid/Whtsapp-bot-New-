const { 
    makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    DisconnectReason 
} = require("@whiskeysockets/baileys");
const fs = require('fs');
const pino = require('pino');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // QR ඕන නෑ
        logger: pino({ level: 'silent' })
    });

    // --- Pairing Code එක ලබාගැනීම ---
    if (!sock.authState.creds.registered) {
        const phoneNumber = "947XXXXXXXX"; // මෙතනට ඔබේ අංකය දාන්න
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n👉 ඔබේ LOGIN CODE එක: ${code}\n`);
        }, 3000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const isStatus = from === 'status@broadcast';

        // 1. Auto Status View & Like (React)
        if (isStatus) {
            await sock.readMessages([msg.key]); // Status View
            await sock.sendMessage(from, { react: { text: '🔥', key: msg.key } }, { statusJidList: [msg.key.participant] });
            return;
        }

        // --- වට්සැප් එක උඩුයටිකුරු කරන Commands ---
        if (body === '.menu') {
            await sock.sendMessage(from, { text: `🚀 *GEMINI ADVANCED BOT*\n\n1. .tagall - ඔක්කොටම මැසේජ් එක යවන්න\n2. .hidetag - හොරෙන් ටැග් කරන්න\n3. .antilink - ලින්ක් බ්ලොක් කරන්න\n4. .clone - වෙන කෙනෙක් වගේ රිප්ලයි කරන්න` });
        }

        if (body === '.tagall') {
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants.map(i => i.id);
            await sock.sendMessage(from, { text: "📢 අවධානය පිණිසයි!", mentions: participants });
        }
    });
}

startBot();
