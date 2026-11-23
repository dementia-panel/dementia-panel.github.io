---
title: Ноды
description: Параметры, примеры запросов и ответов для интеграции по API-ключу.
outline: [2, 2]
---

# Ноды

Параметры, примеры запросов и ответов для интеграции по API-ключу.

## Получить список нод

<Endpoint method="GET" path="/api/admin/nodes" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/nodes` |

Не включает удалённые записи; этот список пока без пагинации.

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| $ | array of object | Список объектов; без записей — []. |
| [].endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| [].endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| [].retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| [].id | string (UUID) | Идентификатор ресурса. |
| [].name | string | Отображаемое название ресурса. |
| [].ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| [].ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| [].vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| [].status | string | Состояние ноды: installing, ready или failed. |
| [].enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| [].last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| [].revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| [].applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| [].online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| [].connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| [].connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| [].restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| [].restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| [].operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| [].online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| [].error | string or null | Описание ошибки; null, если ошибки нет. |

```json
[
  {
    "endpoint_host": null,
    "endpoint_port": null,
    "retired_at": null,
    "id": "11111111-1111-4111-8111-111111111111",
    "name": "Frankfurt",
    "ip": "203.0.113.10",
    "ssh_port": 22,
    "vpn_port": 51820,
    "status": "ready",
    "enabled": true,
    "last_seen_at": "2030-01-01T00:00:00Z",
    "revision": 12,
    "applied_revision": 12,
    "online": true,
    "connection_ok": null,
    "connection_checked_at": null,
    "restart_revision": 0,
    "restarted_revision": 0,
    "operation_stage": "complete",
    "online_device_count": 0,
    "error": null
  }
]
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (500):

```json
{
  "error": "internal error"
}
```



## Получить показатели нод

<Endpoint method="GET" path="/api/admin/nodes/metrics" />

Возвращает число уникальных пользователей в сети на всех активных нодах, максимальное число одновременных подключений с начала отслеживания и трафик за текущие сутки UTC. Пик фиксируется раз в 15 секунд; кратковременные подключения между замерами могут не попасть в статистику. Пользователь на нескольких нодах учитывается один раз.

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/nodes/metrics` |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| online_users | integer | Уникальные пользователи с недавним действующим VPN-рукопожатием на включённых и синхронизированных нодах. |
| peak_online_users | integer | Максимальное число, зафиксированное с момента установки миграции метрик. |
| traffic_today_bytes | integer (int64) | Сумма полученных и отправленных байтов по всем нодам с 00:00 UTC. |

```json
{
  "online_users": 12,
  "peak_online_users": 27,
  "traffic_today_bytes": 104857600
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 500 | Внутренняя ошибка backend; подробности в серверных логах. |
| 503 | Таймаут/конфликт блокировок БД либо остановка backend. |


## Получить ноду

<Endpoint method="GET" path="/api/admin/nodes/{id}" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/nodes/{id}` |

Содержит operation_stage и error. По UUID может возвращаться и выведенная из эксплуатации запись.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| status | string | Состояние ноды: installing, ready или failed. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| error | string or null | Описание ошибки; null, если ошибки нет. |

```json
{
  "endpoint_host": null,
  "endpoint_port": null,
  "retired_at": null,
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "ssh_port": 22,
  "vpn_port": 51820,
  "status": "ready",
  "enabled": true,
  "last_seen_at": "2030-01-01T00:00:00Z",
  "revision": 12,
  "applied_revision": 12,
  "online": true,
  "connection_ok": null,
  "connection_checked_at": null,
  "restart_revision": 0,
  "restarted_revision": 0,
  "operation_stage": "complete",
  "online_device_count": 0,
  "error": null
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```



## Добавить ноду

<Endpoint method="POST" path="/api/admin/nodes" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/nodes` |

Возвращает 202 после постановки установки в очередь. Проверяйте GET /api/admin/nodes/{id}; установка может длиться до 15 минут. Имя ноды — 1–128 байт без управляющих символов. Допускается до четырёх параллельных задач установки/очистки.

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| name | string | Да | Название: 1–128 байт после обрезки пробелов. |
| ip | string (IPv4/IPv6) | Да | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| login | string | Да | Учётная запись SSH; формат [a-zA-Z_][a-zA-Z0-9_.-]{0,63}. |
| password | string | Да | Пароль SSH, 1–4096 байт, без CR, LF и NUL. |
| ssh_port | integer | Нет | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | Нет | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| reset_host_key | boolean | Нет | По умолчанию false. True явно разрешает принять новый SSH host key при повторной установке неудачной ноды. |

```json
{
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "login": "root",
  "password": "REPLACE_SSH_PASSWORD",
  "ssh_port": 22,
  "vpn_port": 51820,
  "reset_host_key": false
}
```

**Успешный ответ: 202**

| Поле | Формат | Назначение |
| --- | --- | --- |
| endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| status | string | Состояние ноды: installing, ready или failed. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| error | string or null | Описание ошибки; null, если ошибки нет. |

```json
{
  "endpoint_host": null,
  "endpoint_port": null,
  "retired_at": null,
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "ssh_port": 22,
  "vpn_port": 51820,
  "status": "installing",
  "enabled": true,
  "last_seen_at": null,
  "revision": 1,
  "applied_revision": 0,
  "online": false,
  "connection_ok": null,
  "connection_checked_at": null,
  "restart_revision": 0,
  "restarted_revision": 0,
  "operation_stage": "queued",
  "online_device_count": 0,
  "error": null
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 202 | Запрос принят; операция выполняется асинхронно. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 429 | Все фоновые обработчики заняты; повторите позже. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```



## Изменить ноду

<Endpoint method="PATCH" path="/api/admin/nodes/{id}" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PATCH` |
| URL | `https://panel.example.com/api/admin/nodes/{id}` |

Передайте name и/или enabled. Пропущенные поля сохраняются. Пауза применяется после синхронизации.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| enabled | boolean | Нет | Включён ли доступ. Отключение применяется после синхронизации нод. |
| name | string | Нет | Название: 1–128 байт после обрезки пробелов. |

```json
{
  "enabled": false
}
```

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| status | string | Состояние ноды: installing, ready или failed. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| error | string or null | Описание ошибки; null, если ошибки нет. |

```json
{
  "endpoint_host": null,
  "endpoint_port": null,
  "retired_at": null,
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "ssh_port": 22,
  "vpn_port": 51820,
  "status": "ready",
  "enabled": false,
  "last_seen_at": "2030-01-01T00:00:00Z",
  "revision": 12,
  "applied_revision": 12,
  "online": true,
  "connection_ok": null,
  "connection_checked_at": null,
  "restart_revision": 0,
  "restarted_revision": 0,
  "operation_stage": "complete",
  "online_device_count": 0,
  "error": null
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```



## Изменить или сбросить публичный VPN-адрес ноды

<Endpoint method="PUT" path="/api/admin/nodes/{id}/endpoint" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/nodes/{id}/endpoint` |

Полная замена: отсутствие или null в host/port сбрасывает соответствующее переопределение. Оба null возвращают IP сервера и VPN-порт ноды.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| host | string or null | Нет | IP или DNS-имя VPN с точкой, до 253 символов. Null сбрасывает переопределение. |
| port | integer or null | Нет | VPN-порт, 1–65535; null сбрасывает переопределение. |

```json
{
  "host": "vpn.example.com",
  "port": 51820
}
```

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| status | string | Состояние ноды: installing, ready или failed. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| error | string or null | Описание ошибки; null, если ошибки нет. |

```json
{
  "endpoint_host": "vpn.example.com",
  "endpoint_port": 51820,
  "retired_at": null,
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "ssh_port": 22,
  "vpn_port": 51820,
  "status": "ready",
  "enabled": true,
  "last_seen_at": "2030-01-01T00:00:00Z",
  "revision": 12,
  "applied_revision": 12,
  "online": true,
  "connection_ok": null,
  "connection_checked_at": null,
  "restart_revision": 0,
  "restarted_revision": 0,
  "operation_stage": "complete",
  "online_device_count": 0,
  "error": null
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```



## Проверить получение нового отчёта от ноды

<Endpoint method="POST" path="/api/admin/nodes/{id}/actions/check" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/nodes/{id}/actions/check` |

Ждёт новый отчёт агента до 12 секунд; это не ICMP ping. При отсутствии нового отчёта возвращается 200 и responded:false.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| status | string | Состояние ноды: installing, ready или failed. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| error | string or null | Описание ошибки; null, если ошибки нет. |
| responded | boolean | Во время проверки пришёл новый отчёт агента. False допускается при ответе 200. |

```json
{
  "endpoint_host": null,
  "endpoint_port": null,
  "retired_at": null,
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "ssh_port": 22,
  "vpn_port": 51820,
  "status": "ready",
  "enabled": true,
  "last_seen_at": "2030-01-01T00:00:00Z",
  "revision": 12,
  "applied_revision": 12,
  "online": true,
  "connection_ok": null,
  "connection_checked_at": null,
  "restart_revision": 0,
  "restarted_revision": 0,
  "operation_stage": "complete",
  "online_device_count": 0,
  "error": null,
  "responded": true
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```



## Запросить перезапуск ноды

<Endpoint method="POST" path="/api/admin/nodes/{id}/actions/restart" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/nodes/{id}/actions/restart` |

Перезапускается только готовая не удалённая нода. 202 означает постановку в очередь, а не завершение.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 202**

| Поле | Формат | Назначение |
| --- | --- | --- |
| endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| status | string | Состояние ноды: installing, ready или failed. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| error | string or null | Описание ошибки; null, если ошибки нет. |

```json
{
  "endpoint_host": null,
  "endpoint_port": null,
  "retired_at": null,
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "ssh_port": 22,
  "vpn_port": 51820,
  "status": "ready",
  "enabled": true,
  "last_seen_at": "2030-01-01T00:00:00Z",
  "revision": 12,
  "applied_revision": 12,
  "online": true,
  "connection_ok": null,
  "connection_checked_at": null,
  "restart_revision": 1,
  "restarted_revision": 0,
  "operation_stage": "complete",
  "online_device_count": 0,
  "error": null
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 202 | Запрос принят; операция выполняется асинхронно. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```



## Запросить перезапуск всех готовых нод

<Endpoint method="POST" path="/api/admin/nodes/actions/restart-all" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/nodes/actions/restart-all` |

**Тело запроса:** отсутствует.

**Успешный ответ: 202**

| Поле | Формат | Назначение |
| --- | --- | --- |
| queued | integer | Число нод, для которых запрошен перезапуск. |

```json
{
  "queued": 2
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 202 | Запрос принят; операция выполняется асинхронно. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (500):

```json
{
  "error": "internal error"
}
```



## Удалить ноду

<Endpoint method="DELETE" path="/api/admin/nodes/{id}" />

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `DELETE` |
| URL | `https://panel.example.com/api/admin/nodes/{id}` |

cleanup:false удаляет только запись и назначения в панели без SSH. cleanup:true (а также null/отсутствие) требует login и password и запускает очистку VPS. Устанавливаемая/удаляемая нода даёт 409. Очистка длится до 3 минут. Проверяйте error и operation_stage; затем тот же IP можно добавить заново.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| cleanup | boolean or null | Нет | false: удалить только из панели; true, null или отсутствие: очистить VPS через SSH. |
| login | string | При cleanup≠false | Учётная запись SSH; формат [a-zA-Z_][a-zA-Z0-9_.-]{0,63}. |
| password | string | При cleanup≠false | Пароль SSH, 1–4096 байт, без CR, LF и NUL. |

```json
{
  "cleanup": false
}
```

Пример запроса с очисткой VPS:

```json
{
  "cleanup": true,
  "login": "root",
  "password": "REPLACE_SSH_PASSWORD"
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**202 при cleanup:true**

| Поле | Формат | Назначение |
| --- | --- | --- |
| endpoint_host | string or null | Переопределённый адрес VPN; null использует IP сервера. |
| endpoint_port | integer or null | Переопределённый VPN-порт; null использует vpn_port. |
| retired_at | string (RFC3339) or null | Время удаления; null для действующей записи. |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| ip | string (IPv4/IPv6) | IP-адрес сервера; global-unicast IPv4/IPv6 без суффикса зоны. |
| ssh_port | integer | SSH-порт, 1–65535. Не задан или 0: используется 22. |
| vpn_port | integer | UDP-порт VPN, 1–65535. Не задан или 0: используется 51820. |
| status | string | Состояние ноды: installing, ready или failed. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| last_seen_at | string (RFC3339) or null | Последнее успешное обращение агента. |
| revision | integer (int64) | Требуемая ревизия конфигурации ноды. |
| applied_revision | integer (int64) | Ревизия конфигурации, подтверждённая агентом. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| connection_ok | boolean or null | Последний результат проверки связи; null до первой проверки. |
| connection_checked_at | string (RFC3339) or null | Время последней проверки связи. |
| restart_revision | integer (int64) | Запрошенная ревизия перезапуска. |
| restarted_revision | integer (int64) | Ревизия перезапуска, подтверждённая агентом. |
| operation_stage | string | Этап установки/удаления: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_device_count | integer | Уникальные выданные устройства с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. Это оценка по рукопожатиям, а не число физических устройств. |
| error | string or null | Описание ошибки; null, если ошибки нет. |

```json
{
  "endpoint_host": null,
  "endpoint_port": null,
  "retired_at": null,
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Frankfurt",
  "ip": "203.0.113.10",
  "ssh_port": 22,
  "vpn_port": 51820,
  "status": "ready",
  "enabled": true,
  "last_seen_at": "2030-01-01T00:00:00Z",
  "revision": 12,
  "applied_revision": 12,
  "online": true,
  "connection_ok": null,
  "connection_checked_at": null,
  "restart_revision": 0,
  "restarted_revision": 0,
  "operation_stage": "removing",
  "online_device_count": 0,
  "error": null
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 202 | Принята асинхронная очистка VPS; возвращается нода. |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 429 | Все фоновые обработчики заняты; повторите позже. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```
