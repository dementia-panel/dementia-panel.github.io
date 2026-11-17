---
title: Traffic
description: Parameters, request examples and response shapes for service API integrations.
outline: [2, 2]
---

# Traffic

Parameters, request examples and response shapes for service API integrations.

## Get daily traffic statistics

<Endpoint method="GET" path="/api/admin/traffic" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/traffic` |

UTC dates in ascending order. Only recorded days are returned; no traffic gives []. Received/sent are from the node perspective.

**Query parameters**

| Parameter | Format | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `days` | integer | No | `30` | 1–366. |
| `node_id` | string (UUID) | No | — | Optional node filter. |
| `user_id` | string (UUID or Telegram ID) | No | — | Optional user filter; mutually exclusive with telegram_id. |
| `telegram_id` | string (positive int64) | No | — | Alternative user filter by Telegram ID; mutually exclusive with user_id. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| $ | array of object | List of records; [] when empty. |
| [].day | string (YYYY-MM-DD) | UTC traffic accounting date. |
| [].received_bytes | integer (int64) | Bytes received by the node from clients. |
| [].sent_bytes | integer (int64) | Bytes sent by the node to clients. |

```json
[
  {
    "day": "2030-01-01",
    "received_bytes": 1024,
    "sent_bytes": 2048
  }
]
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 200 | Success; response shape shown above. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 404 | Resource or user not found, or device/access does not belong to this user. |
| 409 | State conflict, duplicate, limit reached or ambiguous Telegram ID; see error. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```
