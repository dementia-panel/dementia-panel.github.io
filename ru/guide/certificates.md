---
title: HTTPS и сертификаты
---

# HTTPS и сертификаты

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



## 9. Продлевай сертификат

Когда подходит срок продления, выполни:

```sh
sudo certbot renew --cert-name panel.example.com
```

После продления повтори обе команды `install` из раздела выше и перечитай конфигурацию Nginx. Панель использует копии файлов из каталога `tls/`.

```sh
sudo docker compose exec -T frontend nginx -s reload
```
