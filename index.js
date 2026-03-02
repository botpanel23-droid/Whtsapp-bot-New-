const { 
    makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    delay 
} = require("@whiskeysockets/baileys");
const fs = require('fs');
const pino = require('pino');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Settings Load කිරීම
if (!fs.existsSync('./settings.json')) {
    fs.writeFileSync('./settings.json', JSON.stringify({ auto_status_view: true, auto_react: true }));
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // Pairing Code එක ඉල්ලීම (Render එකේදී Error එක එන තැන)
    if (!sock.authState.creds.registered) {
        const phoneNumber = "94742271802"; // ඔබේ අංකය මෙතනට දාන්න
        console.log("Requesting Pairing Code...");
        await delay(5000); // සර්වර් එක Connect වෙනකම් පොඩි වෙලාවක් ඉන්න
        try {
            let code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n\n👉 YOUR LOGIN CODE: ${code}\n\n`);
        } catch (err) {
            console.error("Pairing Code Error: ", err.message);
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Connected Successfully!');
        }
    });

    // Status View & Auto Reply Logic
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const settings = JSON.parse(fs.readFileSync('./settings.json'));

        if (from === 'status@broadcast' && settings.auto_status_view) {
            await sock.readMessages([msg.key]);
            if (settings.auto_react) {
                await sock.sendMessage(from, { react: { text: '🔥', key: msg.key } }, { statusJidList: [msg.key.participant] });
            }
        }
    });
}

// --- Dashboard UI ---
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Bot Dashboard</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-900 text-white flex items-center justify-center h-screen">
            <div class="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-blue-500">
                <h1 class="text-2xl font-bold text-blue-400 mb-4">Gemini Bot Control</h1>
                <p class="mb-4">Status: <span class="text-green-400 font-bold">Bot Engine Running</span></p>
                <div class="space-y-2">
                    <button class="w-full bg-blue-600 p-2 rounded">Auto Status: ON</button>
                    <button class="w-full bg-purple-600 p-2 rounded">Auto Like: ON</button>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));
startBot();
