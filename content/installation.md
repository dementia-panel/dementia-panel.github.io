[Сайт документации](https://dementia-panel.github.io/)

<a href="#english"><kbd>English</kbd></a> <a href="#русский"><kbd>Русский</kbd></a>

# dementia

## English

dementia is a self-hosted control panel for managing AmneziaWG VPN nodes, users, and subscriptions.

[API documentation](https://github.com/dementia-panel/backend/blob/main/docs/API.md#english)

![dementia dashboard](https://raw.githubusercontent.com/dementia-panel/.github/main/profile/assets/dashboard.png)

*Interface preview with sample data.*

### 1. Install Docker

On the deployment server, configure the official Docker APT repository for your distribution, then install Docker Engine and the Compose plugin. [Ubuntu](https://docs.docker.com/engine/install/ubuntu/#install-using-the-apt-repository) · [Debian](https://docs.docker.com/engine/install/debian/#install-using-the-apt-repository)

```sh
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2. Download the deployment files

Create and enter the deployment directory. The same Compose file starts the backend and the panel. You will need curl, OpenSSL, and a domain pointing to this server.

```sh
mkdir -p dementia
```

```sh
cd dementia
```

```sh
curl -fsSLO https://raw.githubusercontent.com/dementia-panel/backend/main/deploy/compose.yaml
```

```sh
curl -fsSL https://raw.githubusercontent.com/dementia-panel/backend/main/deploy/.env.example -o .env
```

### 3. Fill in `.env`

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

### 4. Start the backend

Compose pulls the `latest` backend image and starts PostgreSQL and Valkey as dependencies. The backend applies database migrations on startup.

```sh
sudo docker compose up -d --pull always --wait backend
```

### 5. Issue and install the HTTPS certificate

Point your domain to the server. Allow inbound TCP traffic on port 80 for Let’s Encrypt validation and port 443 for the panel. Port 80 must be free when Certbot runs. Replace `panel.example.com` in the commands with the hostname from `PUBLIC_URL`. [Certbot standalone mode](https://eff-certbot.readthedocs.io/en/stable/using.html#standalone)

Install Certbot on Ubuntu or Debian and request a certificate. Enter your email and follow Certbot's prompts.

```sh
sudo apt install certbot
```

```sh
sudo certbot certonly --standalone --cert-name panel.example.com -d panel.example.com
```

Copy the certificate chain and private key into the directory mounted by Compose. Keep the destination filenames because the panel image expects them.

```sh
mkdir -p tls
```

```sh
sudo install -m 0644 /etc/letsencrypt/live/panel.example.com/fullchain.pem tls/dementia.crt
```

```sh
sudo install -m 0600 /etc/letsencrypt/live/panel.example.com/privkey.pem tls/dementia.key
```

### 6. Start the panel

Compose pulls the `latest` panel image.

```sh
sudo docker compose up -d --pull always --wait frontend
```

### 7. Create the administrator

Open the HTTPS address set in `PUBLIC_URL`. On a fresh database, choose a username and set or generate a password in the first-run form.

### 8. Add a node

Prepare an Ubuntu or Debian VPS with SSH access, sudo or root privileges, and `/dev/net/tun`. The VPS needs outbound HTTPS access to GitHub and your panel. Allow inbound traffic on the VPN UDP port you choose (default `51820`).

In the panel, open **Nodes**, add the server using its SSH details, and wait for it to come online. The backend installs the agent from the latest published release. [Node releases](https://github.com/dementia-panel/node/releases)

### 9. Renew HTTPS

To request renewal when the certificate is due, run:

```sh
sudo certbot renew --cert-name panel.example.com
```

After renewal, repeat the two `install` commands from step 5 and reload Nginx. The panel uses the copies in `tls/`.

```sh
sudo docker compose exec -T frontend nginx -s reload
```

### 10. Fix a PostgreSQL password mismatch

If startup reports `could not connect to PostgreSQL` or the database is unhealthy, check its logs:

```sh
sudo docker compose logs --tail=30 db
```

If the logs show `password authentication failed`, restore the original `POSTGRES_PASSWORD` in `.env`. PostgreSQL reads that variable only when initializing an empty volume. If you need to keep the new password, change the role's password in PostgreSQL using the prompt below. Replace both instances of `backend` if you used a different PostgreSQL role. Enter the value from `.env` twice.

```sh
sudo docker compose exec db psql -U backend -d postgres -c '\password backend'
```

Apply the settings from the deployment directory. Keep the existing database volume.

```sh
sudo docker compose up -d --pull always --wait backend
```

## Русский

dementia — панель для управления VPN-нодами AmneziaWG, пользователями и подписками на своём сервере.

[Документация API](https://github.com/dementia-panel/backend/blob/main/docs/API.md#russian)

![Панель управления dementia](https://raw.githubusercontent.com/dementia-panel/.github/main/profile/assets/dashboard.png)

*Пример интерфейса с демонстрационными данными.*

### 1. Установи Docker

На сервере подключи официальный APT-репозиторий Docker для своего дистрибутива и установи Docker Engine с плагином Compose. [Ubuntu](https://docs.docker.com/engine/install/ubuntu/#install-using-the-apt-repository) · [Debian](https://docs.docker.com/engine/install/debian/#install-using-the-apt-repository)

```sh
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2. Скачай файлы установки

Создай папку для установки и перейди в неё. Backend и панель запускаются из одного файла Compose. Понадобятся curl, OpenSSL и домен, направленный на этот сервер.

```sh
mkdir -p dementia
```

```sh
cd dementia
```

```sh
curl -fsSLO https://raw.githubusercontent.com/dementia-panel/backend/main/deploy/compose.yaml
```

```sh
curl -fsSL https://raw.githubusercontent.com/dementia-panel/backend/main/deploy/.env.example -o .env
```

### 3. Заполни `.env`

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

### 4. Запусти backend

Compose скачает образ backend с тегом `latest` и запустит PostgreSQL и Valkey как зависимости. Backend применит миграции базы при старте.

```sh
sudo docker compose up -d --pull always --wait backend
```

### 5. Выпусти и установи HTTPS-сертификат

Направь домен на сервер. Разреши входящие TCP-подключения на порт 80 для проверки Let’s Encrypt и на порт 443 для панели. Порт 80 должен быть свободен во время работы Certbot. Замени `panel.example.com` в командах на домен из `PUBLIC_URL`. [Режим standalone в Certbot](https://eff-certbot.readthedocs.io/en/stable/using.html#standalone)

Установи Certbot на Ubuntu или Debian и запроси сертификат. Введи email и следуй подсказкам Certbot.

```sh
sudo apt install certbot
```

```sh
sudo certbot certonly --standalone --cert-name panel.example.com -d panel.example.com
```

Скопируй цепочку сертификатов и закрытый ключ в каталог, который подключает Compose. Сохрани имена файлов назначения, их использует образ панели.

```sh
mkdir -p tls
```

```sh
sudo install -m 0644 /etc/letsencrypt/live/panel.example.com/fullchain.pem tls/dementia.crt
```

```sh
sudo install -m 0600 /etc/letsencrypt/live/panel.example.com/privkey.pem tls/dementia.key
```

### 6. Запусти панель

Compose скачает образ панели с тегом `latest`.

```sh
sudo docker compose up -d --pull always --wait frontend
```

### 7. Создай администратора

Открой HTTPS-адрес из `PUBLIC_URL`. На чистой базе выбери логин и задай или сгенерируй пароль в форме первого запуска.

### 8. Добавь ноду

Подготовь VPS с Ubuntu или Debian, доступом по SSH, правами root или sudo и устройством `/dev/net/tun`. VPS должен иметь исходящий доступ по HTTPS к GitHub и панели. Разреши входящий трафик на выбранный UDP-порт VPN (по умолчанию `51820`).

В панели открой **Ноды**, добавь сервер, указав данные SSH, и дождись, пока он выйдет в сеть. Backend установит агент из последнего опубликованного релиза. [Релизы ноды](https://github.com/dementia-panel/node/releases)

### 9. Продлевай сертификат

Когда подходит срок продления, выполни:

```sh
sudo certbot renew --cert-name panel.example.com
```

После продления повтори обе команды `install` из шага 5 и перечитай конфигурацию Nginx. Панель использует копии файлов из каталога `tls/`.

```sh
sudo docker compose exec -T frontend nginx -s reload
```

### 10. Исправь ошибку пароля PostgreSQL

Если при запуске появляется `could not connect to PostgreSQL` или база получает статус `unhealthy`, проверь её логи:

```sh
sudo docker compose logs --tail=30 db
```

Если в логах есть `password authentication failed`, верни исходный `POSTGRES_PASSWORD` в `.env`. PostgreSQL применяет эту переменную только при инициализации пустого тома. Чтобы сохранить новый пароль, смени пароль роли в PostgreSQL через интерактивный запрос. Если использовал другую роль PostgreSQL, замени оба вхождения `backend` в команде. Дважды введи значение из `.env`.

```sh
sudo docker compose exec db psql -U backend -d postgres -c '\password backend'
```

Примени настройки из каталога установки. Сохрани существующий том базы.

```sh
sudo docker compose up -d --pull always --wait backend
```
