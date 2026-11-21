# Telegram-бот AI-новостей

Бот каждый час проверяет RSS-ленты и присылает в Telegram только **новые** новости об искусственном интеллекте. Работает на GitHub Actions — свой сервер не нужен.

## Источники

Сейчас подключены:

- **TechCrunch AI** — https://techcrunch.com/category/artificial-intelligence/
- **Habr AI** — https://habr.com/ru/hub/artificial_intelligence/

Чтобы добавить или убрать источник, открой `bot/ai_news_bot.py` и поправь список `FEEDS`:

```python
FEEDS = [
    {"name": "TechCrunch AI", "url": "https://techcrunch.com/category/artificial-intelligence/feed/"},
    {"name": "Habr AI", "url": "https://habr.com/ru/rss/hub/artificial_intelligence/all/?fl=ru"},
]
```

Подойдёт любая RSS/Atom-лента. Например:

- The Verge AI: `https://www.theverge.com/rss/ai-artificial-intelligence/index.xml`
- VentureBeat AI: `https://venturebeat.com/category/ai/feed/`
- MIT Technology Review AI: `https://www.technologyreview.com/topic/artificial-intelligence/feed`

## Настройки

В начале `bot/ai_news_bot.py`:

| Параметр | Что значит |
|---|---|
| `MAX_PER_RUN` | Сколько новостей максимум за один запуск (сейчас 5). |
| `MAX_AGE_HOURS` | Не присылать новости старше N часов (сейчас 72). |
| `MAX_STATE` | Сколько ссылок помнить, чтобы не дублировать (сейчас 800). |

## Расписание

В `.github/workflows/ai-news.yml`:

```yaml
schedule:
  - cron: "0 * * * *"
```

Это каждый час. Можно поставить `*/30 * * * *` — каждые 30 минут.

## Секреты

В репозитории должны быть два секрета:

- `TELEGRAM_TOKEN` — токен бота;
- `TELEGRAM_CHAT_ID` — ID чата, куда присылать новости.

Они уже добавлены в **Settings → Secrets and variables → Actions**. В коде и логах токен не появляется.

## Как запустить вручную

1. Открой вкладку **Actions** в репозитории.
2. Слева выбери **AI News Bot**.
3. Нажми **Run workflow → Run workflow**.

Через 20–40 секунд в Telegram придут свежие новости, а в логах будет видно, что отправлено.

## Важно знать

- GitHub может задержать запуск по расписанию на 5–20 минут — это нормально.
- Если **60 дней** не делать никаких изменений в репозитории, GitHub отключает расписание. Достаточно зайти и снова включить workflow.
- Бот помнит отправленные ссылки через кэш GitHub Actions, поэтому одно и то же не присылает.
- Если хочешь отдельного бота (не в чате с заявками) — создай нового через [@BotFather](https://t.me/BotFather), замени секрет `TELEGRAM_TOKEN`, а в `TELEGRAM_CHAT_ID` укажи ID нового чата.
