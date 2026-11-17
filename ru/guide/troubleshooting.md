---
title: Решение проблем
---

# Решение проблем

## 10. Исправь ошибку пароля PostgreSQL

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


## Состояние контейнеров

```sh
sudo docker compose ps
```

## Логи backend

```sh
sudo docker compose logs --tail=100 backend
```

## Ошибка установки ноды

Посмотрите этап установки и сообщение ошибки в карточке ноды. На VPS журнал установки находится в `/var/log/dementia-install.log`.

```sh
sudo tail -n 100 /var/log/dementia-install.log
```
