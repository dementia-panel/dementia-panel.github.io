---
title: Device settings
description: Parameters, request examples and response shapes for service API integrations.
outline: [2, 2]
---

# Device settings

Parameters, request examples and response shapes for service API integrations.

## Get the default device limit for new users

<Endpoint method="GET" path="/api/admin/settings/devices" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/settings/devices` |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| default_device_limit | integer or null | Default for newly created users: 1–10000 or null for unlimited. Existing users stay unchanged. |

```json
{
  "default_device_limit": 3
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 200 | Success; response shape shown above. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (500):

```json
{
  "error": "internal error"
}
```



## Change the default device limit for new users

<Endpoint method="PUT" path="/api/admin/settings/devices" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/settings/devices` |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| default_device_limit | integer or null | Yes | Default for newly created users: 1–10000 or null for unlimited. Existing users stay unchanged. |

```json
{
  "default_device_limit": 3
}
```

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| default_device_limit | integer or null | Default for newly created users: 1–10000 or null for unlimited. Existing users stay unchanged. |

```json
{
  "default_device_limit": 3
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 200 | Success; response shape shown above. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```
