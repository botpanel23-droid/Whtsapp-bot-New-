const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Dashboard එකේ UI එක
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini Bot Control Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background: radial-gradient(circle at top left, #1a1a2e, #16213e); min-height: 100vh; color: white; font-family: 'Segoe UI', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .status-dot { height: 12px; width: 12px; background-color: #4ade80; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #4ade80; }
        .btn-toggle { transition: all 0.3s ease; }
        .btn-toggle:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
    </style>
</head>
<body class="p-4 md:p-8">

    <div class="max-w-5xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-10 glass p-6">
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-blue-400"><i class="fa-brands fa-whatsapp mr-2"></i>GEMINI BOT V1</h1>
                <p class="text-gray-400 text-sm">Professional WhatsApp Automation System</p>
            </div>
            <div class="mt-4 md:mt-0 flex items-center gap-3">
                <span class="status-dot"></span>
                <span class="font-medium">System Online</span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="glass p-6 col-span-1">
                <h2 class="text-xl font-semibold mb-4 border-b border-gray-700 pb-2"><i class="fa-solid fa-gears mr-2 text-blue-400"></i> Automation</h2>
                
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span>Auto Status View</span>
                        <button onclick="toggleAction('Status View')" class="btn-toggle bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-xs font-bold border border-green-500/50">ACTIVE</button>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Auto Like (React)</span>
                        <button onclick="toggleAction('Auto React')" class="btn-toggle bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold border border-blue-500/50">ON</button>
                    </div>
                    <div class="flex justify-between items-center text-gray-400">
                        <span>Anti-Delete Msg</span>
                        <button class="bg-gray-800 text-gray-500 px-4 py-1 rounded-full text-xs font-bold">OFF</button>
                    </div>
                </div>
            </div>

            <div class="glass p-6 col-span-1 md:col-span-2">
                <h2 class="text-xl font-semibold mb-4 border-b border-gray-700 pb-2"><i class="fa-solid fa-chart-line mr-2 text-purple-400"></i> Live Monitor</h2>
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="bg-black/20 p-4 rounded-xl">
                        <p class="text-gray-400 text-xs">Total Messages</p>
                        <p class="text-2xl font-bold">1,248</p>
                    </div>
                    <div class="bg-black/20 p-4 rounded-xl">
                        <p class="text-gray-400 text-xs">Status Viewed</p>
                        <p class="text-2xl font-bold text-green-400">452</p>
                    </div>
                </div>
                
                <div class="mt-6">
                    <label class="text-xs text-gray-400 mb-2 block">Custom Auto Reply Message</label>
                    <div class="flex gap-2">
                        <input type="text" placeholder="Type response..." class="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition">
                        <button class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold transition">SAVE</button>
                    </div>
                </div>
            </div>

        </div>

        <div class="mt-10 text-center text-gray-500 text-xs">
            <p>© 2026 Gemini AI Labs - Bot Infrastructure Protected</p>
        </div>
    </div>

    <script>
        function toggleAction(name) {
            alert(name + " settings updated successfully!");
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => console.log(`Dashboard active on: http://localhost:${PORT}`));
