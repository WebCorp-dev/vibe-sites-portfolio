"""Telegram-бот: присылает свежие новости об ИИ из RSS-лент.

Запускается по расписанию через GitHub Actions (см. .github/workflows/ai-news.yml).
Токен и chat ID берутся из переменных окружения (GitHub Secrets).
"""

import calendar
import html
import json
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import feedparser

# ── Настройки ────────────────────────────────────────────────────────────────

TOKEN = os.environ.get("TELEGRAM_TOKEN", "").strip()
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

# Сколько новостей максимум отправлять за один запуск.
MAX_PER_RUN = 5
# Не отправлять новости старше этого возраста (в часах).
MAX_AGE_HOURS = 72
# Сколько ссылок помнить, чтобы не присылать одно и то же.
MAX_STATE = 800

# Источники. Можно добавлять/убирать строки — главное, чтобы это был RSS/Atom.
FEEDS = [
    {
        "name": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
    },
    {
        "name": "Habr AI",
        "url": "https://habr.com/ru/rss/hub/artificial_intelligence/all/?fl=ru",
    },
]

STATE_PATH = Path(__file__).with_name("state.json")
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"
)

# ── Вспомогательные функции ──────────────────────────────────────────────────


def clean_text(value: str) -> str:
    """Убирает HTML-теги и лишние пробелы."""
    value = re.sub(r"<[^>]+>", " ", value or "")
    value = html.unescape(value)
    return re.sub(r"\s+", " ", value).strip()


def entry_datetime(entry):
    """Возвращает дату публикации записи в UTC или None."""
    for key in ("published_parsed", "updated_parsed"):
        parsed = entry.get(key)
        if parsed:
            return datetime.fromtimestamp(calendar.timegm(parsed), tz=timezone.utc)
    return None


def load_state():
    try:
        data = json.loads(STATE_PATH.read_text(encoding="utf-8"))
        sent = data.get("sent", [])
        if isinstance(sent, list):
            return [str(x) for x in sent]
    except (OSError, ValueError, AttributeError):
        pass
    return []


def save_state(sent):
    STATE_PATH.write_text(
        json.dumps({"sent": sent[-MAX_STATE:]}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def collect_items():
    """Собирает свежие записи из всех лент."""
    now = datetime.now(timezone.utc)
    items = []

    for feed in FEEDS:
        try:
            parsed = feedparser.parse(
                feed["url"], request_headers={"User-Agent": USER_AGENT}
            )
        except Exception as error:  # noqa: BLE001 — лента может быть недоступна
            print(f"[feed] {feed['name']}: ошибка {error}")
            continue

        print(f"[feed] {feed['name']}: записей {len(parsed.entries)}")
        for entry in parsed.entries:
            link = (entry.get("link") or entry.get("id") or "").strip()
            title = clean_text(entry.get("title", ""))
            if not link or not title:
                continue

            published = entry_datetime(entry)
            if published and now - published > timedelta(hours=MAX_AGE_HOURS):
                continue

            summary = clean_text(
                entry.get("summary") or entry.get("description") or ""
            )
            items.append(
                {
                    "source": feed["name"],
                    "title": title,
                    "link": link,
                    "summary": summary[:280],
                    "published": published,
                }
            )

    items.sort(
        key=lambda item: item["published"]
        or datetime.min.replace(tzinfo=timezone.utc),
        reverse=True,
    )
    return items


def format_message(item) -> str:
    """Собирает сообщение в HTML-разметке Telegram."""
    title = html.escape(item["title"])
    source = html.escape(item["source"])
    link = html.escape(item["link"], quote=True)

    lines = [f"🤖 <b>AI-новости</b> · {source}", "", f'<a href="{link}">{title}</a>']

    if item["summary"]:
        lines += ["", html.escape(item["summary"])]

    if item["published"]:
        moscow = item["published"].astimezone(timezone(timedelta(hours=3)))
        lines += ["", f"🕒 {moscow.strftime('%d.%m %H:%M')} МСК"]

    return "\n".join(lines)


def send_message(text: str) -> None:
    payload = urlencode(
        {
            "chat_id": CHAT_ID,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": "false",
        }
    ).encode("utf-8")

    request = Request(
        f"https://api.telegram.org/bot{TOKEN}/sendMessage", data=payload
    )
    with urlopen(request, timeout=30) as response:
        result = json.loads(response.read().decode("utf-8"))

    if not result.get("ok"):
        raise RuntimeError(result.get("description", "Telegram вернул ошибку"))


# ── Основной сценарий ────────────────────────────────────────────────────────


def main() -> int:
    if not TOKEN or not CHAT_ID:
        print("Ошибка: не заданы TELEGRAM_TOKEN или TELEGRAM_CHAT_ID")
        return 1

    sent = load_state()
    sent_set = set(sent)

    items = collect_items()
    unseen = [item for item in items if item["link"] not in sent_set]
    to_send = unseen[:MAX_PER_RUN]
    skipped = unseen[MAX_PER_RUN:]
    skipped_links = {item["link"] for item in skipped}

    print(
        f"[bot] новых: {len(unseen)}, отправляем: {len(to_send)}, "
        f"пропускаем старых: {len(skipped)}"
    )

    if not to_send:
        print("[bot] новых новостей нет")
        return 0

    delivered = set()

    # Отправляем от старых к новым, чтобы свежая оказалась внизу чата.
    for item in reversed(to_send):
        try:
            send_message(format_message(item))
            delivered.add(item["link"])
            print(f"[bot] отправлено: {item['title'][:80]}")
            time.sleep(1.2)
        except Exception as error:  # noqa: BLE001 — не роняем весь запуск
            print(f"[bot] ошибка отправки: {error}")

    # Помечаем отправленные и пропущенные (устаревшие) ссылки,
    # чтобы не копить очередь из старых новостей.
    for item in unseen:
        if item["link"] in delivered or item["link"] in skipped_links:
            sent.append(item["link"])

    save_state(sent)
    return 0


if __name__ == "__main__":
    sys.exit(main())
