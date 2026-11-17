---
title: Devices
description: Parameters, request examples and response shapes for service API integrations.
outline: [2, 2]
---

# Devices

Parameters, request examples and response shapes for service API integrations.

## List devices

<Endpoint method="GET" path="/api/admin/users/{id}/devices" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices` |

Returns all issued devices. Returns [] when the user exists but has no devices.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| $ | array of object | List of records; [] when empty. |
| [].id | string (UUID) | Resource identifier. |
| [].user_id | string (UUID) | User who owns this resource. |
| [].name | string | Display name of this resource. |
| [].created_at | string (RFC3339) | Resource creation time. |
| [].updated_at | string (RFC3339) | Last modification time. |
| [].last_connected_at | string (RFC3339) or null | Most recent recorded VPN handshake; null when never observed. |
| [].online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |

```json
[
  {
    "id": "55555555-5555-4555-8555-555555555555",
    "user_id": "33333333-3333-4333-8333-333333333333",
    "name": "iPhone",
    "created_at": "2030-01-01T00:00:00Z",
    "updated_at": "2030-01-01T00:00:00Z",
    "last_connected_at": null,
    "online": false
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



## Add device

<Endpoint method="POST" path="/api/admin/users/{id}/devices" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices` |

Accepts one object and appends exactly one device. Existing devices and their keys are preserved. Creates a separate key set on assigned subscription servers. Name: valid UTF-8, 1–128 bytes after trimming, no control characters. 409 means the limit is reached or the user reference is ambiguous. Repeated POST creates another device; it is not idempotent.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| name | string | Yes | Name: 1–128 bytes after trimming. |

```json
{
  "name": "iPhone"
}
```

**Success response: 201**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| user_id | string (UUID) | User who owns this resource. |
| name | string | Display name of this resource. |
| created_at | string (RFC3339) | Resource creation time. |
| updated_at | string (RFC3339) | Last modification time. |
| last_connected_at | string (RFC3339) or null | Most recent recorded VPN handshake; null when never observed. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |

```json
{
  "id": "55555555-5555-4555-8555-555555555555",
  "user_id": "33333333-3333-4333-8333-333333333333",
  "name": "iPhone",
  "created_at": "2030-01-01T00:00:00Z",
  "updated_at": "2030-01-01T00:00:00Z",
  "last_connected_at": null,
  "online": false
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 201 | Success; response shape shown above. |
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



## Get device

<Endpoint method="GET" path="/api/admin/users/{id}/devices/{deviceID}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}` |

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |
| deviceID | string (UUID) | Yes | Device UUID owned by this user. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| user_id | string (UUID) | User who owns this resource. |
| name | string | Display name of this resource. |
| created_at | string (RFC3339) | Resource creation time. |
| updated_at | string (RFC3339) | Last modification time. |
| last_connected_at | string (RFC3339) or null | Most recent recorded VPN handshake; null when never observed. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |

```json
{
  "id": "55555555-5555-4555-8555-555555555555",
  "user_id": "33333333-3333-4333-8333-333333333333",
  "name": "iPhone",
  "created_at": "2030-01-01T00:00:00Z",
  "updated_at": "2030-01-01T00:00:00Z",
  "last_connected_at": null,
  "online": false
}
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



## Rename device

<Endpoint method="PATCH" path="/api/admin/users/{id}/devices/{deviceID}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PATCH` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}` |

Updates only the device name; keys and other devices are preserved. Name uses the same validation as device creation.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |
| deviceID | string (UUID) | Yes | Device UUID owned by this user. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| name | string | Yes | Name: 1–128 bytes after trimming. |

```json
{
  "name": "Work phone"
}
```

**Success response: 204**

No response body.

```http
HTTP/1.1 204 No Content
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 204 | Success; no body. |
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



## Delete device

<Endpoint method="DELETE" path="/api/admin/users/{id}/devices/{deviceID}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `DELETE` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}` |

Removes this device, its link and peers on all assigned servers. Other devices keep their keys. Revocation reaches each node on synchronization. Deleting the last device does not automatically recreate it.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |
| deviceID | string (UUID) | Yes | Device UUID owned by this user. |

**Request body:** none.

**Success response: 204**

No response body.

```http
HTTP/1.1 204 No Content
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 204 | Success; no body. |
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



## Get an existing device subscription link

<Endpoint method="GET" path="/api/admin/users/{id}/devices/{deviceID}/link" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}/link` |

Returns a stable saved link, issuing it only if missing. Does not rotate keys or overwrite other device links.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |
| deviceID | string (UUID) | Yes | Device UUID owned by this user. |

**Query parameters**

| Parameter | Format | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `subscription_id` | string (UUID) | Yes | — | subscription owned by this user. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Subscription URL; null if a legacy link cannot be recovered. Treat as a secret. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_DEVICE_TOKEN"
}
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



## Change user’s device limit

<Endpoint method="PUT" path="/api/admin/users/{id}/device-limit" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/users/{id}/device-limit` |

null disables the limit. Reducing the limit does not delete existing devices; it prevents additional issuance above the limit.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| device_limit | integer or null | Yes | Maximum issued devices, 1–10000; null removes the limit. |

```json
{
  "device_limit": 5
}
```

**Success response: 204**

No response body.

```http
HTTP/1.1 204 No Content
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 204 | Success; no body. |
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



## Get existing connection keys for device and server

<Endpoint method="GET" path="/api/admin/users/{id}/devices/{deviceID}/nodes/{nodeID}/profile" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}/nodes/{nodeID}/profile` |

Returns existing credentials under the current plan, or direct access if no plan is assigned. Repeated GET does not issue new keys. conf is .conf file content; key is a vpn:// string suitable for AmneziaVPN. Keys are per server, not a combined multi-server WireGuard config.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |
| deviceID | string (UUID) | Yes | Device UUID owned by this user. |
| nodeID | string (UUID) | Yes | Connection server UUID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| conf | string | Existing single-server AmneziaWG .conf content for this device. |
| key | string (vpn://) | Existing AmneziaVPN connection key for this device/server; treat as a secret. |

```json
{
  "conf": "[Interface]\nPrivateKey = EXAMPLE_ONLY\n...",
  "key": "vpn://EXAMPLE_ONLY"
}
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
