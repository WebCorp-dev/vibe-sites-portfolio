/* Отправка заявок в Telegram.
   Токен и chat ID вставляются после создания бота через @BotFather. */
(function () {
  const TOKEN = '9115868583:AAEZu-CYHnFt_58Un6QK4poiH2w0kNQysuw';   // токен бота @webcorp_zayavki_bot
  const CHAT_ID = '1621496180'; // chat ID владельца
  const READY = Boolean(TOKEN && CHAT_ID);

  window.sendLead = async function (site, lines, msgEl) {
    const text = 'Новая заявка · ' + site + '\n' + lines.join('\n');

    if (!READY) {
      if (msgEl) msgEl.textContent = 'Демо: заявка сформирована. Бот ещё не подключён.';
      console.log('[telegram demo]', text);
      return false;
    }

    if (msgEl) msgEl.textContent = 'Отправляем…';
    try {
      const res = await fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.description || 'Ошибка Telegram');
      if (msgEl) msgEl.textContent = 'Готово! Мы свяжемся с вами.';
      return true;
    } catch (err) {
      console.error('[telegram]', err);
      if (msgEl) msgEl.textContent = 'Не удалось отправить — попробуйте ещё раз.';
      return false;
    }
  };
})();
