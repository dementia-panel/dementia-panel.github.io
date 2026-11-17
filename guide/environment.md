---
title: Environment variables
---

# Environment variables

Server configuration lives in `.env`. After changing it, recreate the containers with `docker compose up -d`.


| Variable | Value |
| --- | --- |
| `PUBLIC_URL` | The public HTTPS address of the panel, for example `https://panel.example.com`. Use a domain reachable from your nodes and omit the trailing slash. |
| `PANEL_BIND` | Set `0.0.0.0` to publish HTTPS on the server’s IPv4 interfaces. |
| `PANEL_PORT` | Set `443` for standard HTTPS. |
| `POSTGRES_USER`, `POSTGRES_DB` | Keep `backend` for both unless you need different names. |
| `POSTGRES_PASSWORD` | Replace `CHANGE_ME` with a unique password. |
| `JWT_SIGNING_KEY`, `ENCRYPTION_KEY` | Generate a separate 32-byte Base64 key for each field. Keep the encryption key with your database backups. |
| `MODE`, `LOG_LEVEL` | `MODE=prod` by default. Modes: `local`, `dev`, `prod`, `test`. Leave `LOG_LEVEL` empty to use the mode’s level, or set `debug`, `info`, `warn`, or `error`. |
| `NODE_PING_INTERVAL_SECONDS` | Node connection check interval in seconds. Default: `30`. |
| `WEBHOOK_URL`, `WEBHOOK_SECRET_HEADER` | Leave empty unless using a webhook. Set both to enable it. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Set both to enable Telegram. `TELEGRAM_THREAD_ID` is optional. |
| `TELEGRAM_MODE`, `TELEGRAM_WEBHOOK_SECRET` | Keep `polling` by default. Set a secret if you select `webhook`. |

On a fresh installation, run these commands in the directory containing `.env`. The commands fill empty values from the template and replace the `CHANGE_ME` placeholder. The two keys use standard Base64, including the trailing `=`.

```sh
postgres_password="$(openssl rand -hex 32)" && sed -i "s|^POSTGRES_PASSWORD=CHANGE_ME$|POSTGRES_PASSWORD=$postgres_password|" .env
```

```sh
jwt_key="$(openssl rand -base64 32)" && sed -i "s|^JWT_SIGNING_KEY=\(''\)\?$|JWT_SIGNING_KEY=$jwt_key|" .env
```

```sh
encryption_key="$(openssl rand -base64 32)" && sed -i "s|^ENCRYPTION_KEY=\(''\)\?$|ENCRYPTION_KEY=$encryption_key|" .env
```

If you set `WEBHOOK_URL`, generate the webhook secret:

```sh
webhook_secret="$(openssl rand -hex 32)" && sed -i "s|^WEBHOOK_SECRET_HEADER=\(''\)\?$|WEBHOOK_SECRET_HEADER=$webhook_secret|" .env
```

If you select `TELEGRAM_MODE=webhook`, generate the Telegram webhook secret. Get `TELEGRAM_BOT_TOKEN` from BotFather.

```sh
telegram_webhook_secret="$(openssl rand -hex 32)" && sed -i "s|^TELEGRAM_WEBHOOK_SECRET=\(''\)\?$|TELEGRAM_WEBHOOK_SECRET=$telegram_webhook_secret|" .env
```

Keep `.env` outside version control. For an existing installation, preserve the PostgreSQL password and encryption key unless you are deliberately rotating them.



## Configuration template

<a href="/assets/env.example" download=".env">Download .env.example</a>
