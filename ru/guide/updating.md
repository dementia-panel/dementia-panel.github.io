# Обновление

Выполняйте команды из папки установки с файлами `.env` и `compose.yaml`.

## Перед обновлением

Сохраните существующий том БД, `POSTGRES_PASSWORD`, `JWT_SIGNING_KEY` и `ENCRYPTION_KEY`. Перед миграциями сделайте резервную копию PostgreSQL и `.env`. Не удаляйте тома при обновлении.

## Скачайте образы

```sh
sudo docker compose pull
```

## Сначала обновите backend

Backend автоматически применяет миграции при запуске.

```sh
sudo docker compose up -d --wait backend
```

## Обновите панель

```sh
sudo docker compose up -d --wait frontend
```

## Проверьте результат

```sh
sudo docker compose ps
```

```sh
sudo docker compose logs --tail=50 backend
```

В конфигурации установки используется `latest`. Перед обновлением прочитайте [описание релизов](https://github.com/dementia-panel/backend/releases).
