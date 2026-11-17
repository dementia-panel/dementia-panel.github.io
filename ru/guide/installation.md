---
title: Установка
---

# Установка

Разверните backend, базу данных и веб-панель на своём сервере.

::: info Перед началом
Нужны сервер Ubuntu или Debian, домен, направленный на сервер, и открытые TCP-порты 80 и 443.
:::

## 1. Установите Docker

Подключите официальный APT-репозиторий Docker для своей ОС. Если Docker Engine и Compose уже установлены, переходите к шагу 2.

```sh
sudo apt update
```

```sh
sudo apt install ca-certificates curl
```

```sh
sudo install -m 0755 -d /etc/apt/keyrings
```

Скачайте ключ подписи для своей ОС:

::: code-group
```sh [Ubuntu]
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
```
```sh [Debian]
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
```
:::

```sh
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Добавьте репозиторий для своей ОС:

::: code-group
```sh [Ubuntu]
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```
```sh [Debian]
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```
:::

```sh
sudo apt update
```

```sh
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```sh
sudo systemctl enable --now docker
```

```sh
sudo docker compose version
```

[Docker Engine для Ubuntu](https://docs.docker.com/engine/install/ubuntu/) · [Docker Engine для Debian](https://docs.docker.com/engine/install/debian/)


## 2. Скачай файлы установки

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



## 3. Настройте окружение

Заполните `.env` и сгенерируйте ключи по [инструкции настройки](/ru/guide/environment).



## 4. Запусти backend

Compose скачает образ backend с тегом `latest` и запустит PostgreSQL и Valkey как зависимости. Backend применит миграции базы при старте.

```sh
sudo docker compose up -d --pull always --wait backend
```



## 5. Выпусти и установи HTTPS-сертификат

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



## 6. Запусти панель

Compose скачает образ панели с тегом `latest`.

```sh
sudo docker compose up -d --pull always --wait frontend
```



## 7. Создай администратора

Открой HTTPS-адрес из `PUBLIC_URL`. На чистой базе выбери логин и задай или сгенерируй пароль в форме первого запуска.
