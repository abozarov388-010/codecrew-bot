const token = '9134417490:AAHvsrPh8RWC4FWSFsexq91nCnRd1aUGPVY';
const adminChatId = '6856713885';
const url = `https://api.telegram.org/bot${token}`;

const mainMenu = {
  keyboard: [
    [{ text: '💻 IT Klub haqida' }, { text: '📚 Yo‘nalishlar' }],
    [{ text: '📅 Dars jadvali' }, { text: '📝 Klubga a’zo bo‘lish' }],
    [{ text: '📞 Bog‘lanish' }]
  ],
  resize_keyboard: true
};

const waitingUsers = new Set();

async function sendMessage(chatId, text, replyMarkup = null) {
  const body = { chat_id: chatId, text };
  if (replyMarkup) body.reply_markup = replyMarkup;

  await fetch(`${url}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function handleUpdate(update) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const user = update.message.from;
  const userName = user.first_name || 'Do‘st';
  const username = user.username ? `@${user.username}` : 'username yo‘q';
  const text = update.message.text;

  if (text === '/start') {
    waitingUsers.delete(chatId);
    await sendMessage(
      chatId,
      `Salom, ${userName}! 👋\n\nCodeCrew IT klubining rasmiy botiga xush kelibsiz! Kerakli bo‘limni tanlang:`,
      mainMenu
    );
  } else if (text === '💻 IT Klub haqida') {
    waitingUsers.delete(chatId);
    await sendMessage(
      chatId,
      '🚀 CodeCrew IT Klubi\n\nBu maktabimizning 5–11-sinf o‘quvchilari uchun tashkil etilgan zamonaviy dasturlash va texnologiyalar hamjamiyati. Maqsadimiz — birgalikda real loyihalar yaratish va IT olamiga ilk qadamni tashlash!'
    );
  } else if (text === '📚 Yo‘nalishlar') {
    waitingUsers.delete(chatId);
    await sendMessage(
      chatId,
      '📌 Klubimizdagi asosiy yo‘nalishlar:\n\n1. 🌐 Web-dasturlash (HTML, CSS, JavaScript)\n2. 🎨 UI/UX Dizayn (Figma asoslari)\n3. 🐍 Python va botlar yaratish\n4. 🛠 Git va GitHub bilan ishlash'
    );
  } else if (text === '📅 Dars jadvali') {
    waitingUsers.delete(chatId);
    await sendMessage(
      chatId,
      '🕒 Mashg‘ulotlar jadvali:\n\n• Seshanba: 14:30 – 16:00\n• Payshanba: 14:30 – 16:00\n• Shanba: 10:00 – 12:00 (Amaliyot kuni)'
    );
  } else if (text === '📝 Klubga a’zo bo‘lish') {
    waitingUsers.add(chatId);
    await sendMessage(
      chatId,
      '✍️ Klubga a’zo bo‘lish uchun ism-familiyangiz, yoshingiz, sinfingiz va qaysi yo‘nalishga qiziqishingizni shu yerga yozib qoldiring!\n\nTez orada klub admini siz bilan bog‘lanadi.'
    );
  } else if (text === '📞 Bog‘lanish') {
    waitingUsers.delete(chatId);
    await sendMessage(
      chatId,
      '👨‍💻 Klub koordinatori: @Afzalbek\n📍 Manzil: Maktab informatika xonasi'
    );
  } else if (waitingUsers.has(chatId)) {
    waitingUsers.delete(chatId);

    await sendMessage(
      adminChatId,
      `📥 Yangi ariza!\n\n👤 Ism: ${userName}\n🔗 Username: ${username}\n🆔 ID: ${chatId}\n\n📝 Ma’lumot:\n${text}`
    );

    await sendMessage(
      chatId,
      '✅ Ma’lumotlaringiz qabul qilindi! Tez orada klub admini siz bilan bog‘lanadi.',
      mainMenu
    );
  }
}

async function startBot() {
  console.log('Bot muvaffaqiyatli ishga tushdi!');
  let offset = 0;

  while (true) {
    try {
      const res = await fetch(`${url}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (err) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

startBot();
const http = require("http");
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is alive!");
}).listen(process.env.PORT || 3000);

