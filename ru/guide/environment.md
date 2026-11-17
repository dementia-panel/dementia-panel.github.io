---
title: Переменные окружения
---

# Переменные окружения

Конфигурация хранится в файле `.env` на сервере. При изменении параметров пересоздайте контейнеры командой `docker compose up -d`.


| Переменная | Значение |
| --- | --- |
| `PUBLIC_URL` | Публичный HTTPS-адрес панели, например `https://panel.example.com`. Домен должен быть доступен с нод. Завершающий слеш не нужен. |
| `PANEL_BIND` | Укажи `0.0.0.0`, чтобы опубликовать HTTPS на IPv4-интерфейсах сервера. |
| `PANEL_PORT` | Укажи `443` для HTTPS. |
| `POSTGRES_USER`, `POSTGRES_DB` | Оставь `backend` в обоих полях, если другие имена не нужны. |
| `POSTGRES_PASSWORD` | Замени `CHANGE_ME` на уникальный пароль. |
| `JWT_SIGNING_KEY`, `ENCRYPTION_KEY` | Сгенерируй для каждого поля отдельный 32-байтовый ключ в Base64. Храни ключ шифрования вместе с резервными копиями базы. |
| `MODE`, `LOG_LEVEL` | По умолчанию `MODE=prod`. Режимы: `local`, `dev`, `prod`, `test`. Пустой `LOG_LEVEL` использует уровень режима; можно указать `debug`, `info`, `warn` или `error`. |
| `NODE_PING_INTERVAL_SECONDS` | Интервал проверки связи с нодами в секундах. По умолчанию `30`. |
| `WEBHOOK_URL`, `WEBHOOK_SECRET_HEADER` | Оставь пустыми, если вебхук не нужен. Для подключения заполни оба поля. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Заполни оба поля для подключения Telegram. `TELEGRAM_THREAD_ID` необязателен. |
| `TELEGRAM_MODE`, `TELEGRAM_WEBHOOK_SECRET` | По умолчанию оставь `polling`. Если выбран `webhook`, укажи секрет. |

При первой установке выполни команды в папке с `.env`. Команды заполняют пустые поля шаблона и заменяют заглушку `CHANGE_ME`. Оба ключа записываются в стандартном Base64 вместе с завершающим знаком `=`.

```sh
postgres_password="$(openssl rand -hex 32)" && sed -i "s|^POSTGRES_PASSWORD=CHANGE_ME$|POSTGRES_PASSWORD=$postgres_password|" .env
```

```sh
jwt_key="$(openssl rand -base64 32)" && sed -i "s|^JWT_SIGNING_KEY=\(''\)\?$|JWT_SIGNING_KEY=$jwt_key|" .env
```

```sh
encryption_key="$(openssl rand -base64 32)" && sed -i "s|^ENCRYPTION_KEY=\(''\)\?$|ENCRYPTION_KEY=$encryption_key|" .env
```

Если указал `WEBHOOK_URL`, сгенерируй секрет вебхука:

```sh
webhook_secret="$(openssl rand -hex 32)" && sed -i "s|^WEBHOOK_SECRET_HEADER=\(''\)\?$|WEBHOOK_SECRET_HEADER=$webhook_secret|" .env
```

Если выбрал `TELEGRAM_MODE=webhook`, сгенерируй секрет вебхука Telegram. `TELEGRAM_BOT_TOKEN` получи у BotFather.

```sh
telegram_webhook_secret="$(openssl rand -hex 32)" && sed -i "s|^TELEGRAM_WEBHOOK_SECRET=\(''\)\?$|TELEGRAM_WEBHOOK_SECRET=$telegram_webhook_secret|" .env
```

Храни `.env` вне Git. На действующей установке сохраняй пароль PostgreSQL и ключ шифрования, если не проводишь их плановую замену.



## Шаблон конфигурации

<a href="/assets/env.example" download=".env">Скачать .env.example</a>
