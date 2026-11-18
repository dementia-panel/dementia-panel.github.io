---
title: Users
description: Parameters, request examples and response shapes for service API integrations.
outline: [2, 2]
---

# Users

Parameters, request examples and response shapes for service API integrations.

## List users

<Endpoint method="GET" path="/api/admin/users" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/users` |

**Query parameters**

| Parameter | Format | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `page` | integer | No | `1` | Page number: 1–1000000000. |
| `per_page` | integer | No | `25` | Users per page: 1–100. |
| `search` | string | No | — | up to 128 UTF-8 bytes. Literal substring in username (case insensitive) or telegram_id. |
| `status` | string | No | `all` | all, online, disabled. |
| `sort` | string | No | `username` | username, last_connected_at (descending, nulls last). UUID breaks ties. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| items | array of object | Users on this page. An empty page contains []. |
| items[].id | string (UUID) | Resource identifier. |
| items[].username | string | Unique user name, 1–128 UTF-8 bytes after trimming; no NUL. |
| items[].telegram_id | integer (int64) or null | Positive Telegram user ID; null means unset. |
| items[].enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| items[].created_at | string (RFC3339) | Resource creation time. |
| items[].updated_at | string (RFC3339) | Last modification time. |
| items[].last_connected_at | string (RFC3339) or null | Most recent recorded VPN handshake; null when never observed. |
| items[].subscription_plan_id | string (UUID) or null | Assigned server plan; null when no plan is assigned. |
| items[].online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| items[].device_limit | integer or null | Maximum issued devices, 1–10000; null removes the limit. |
| items[].device_count | integer | Number of issued device records, not detected physical hardware. |
| items[].online_device_count | integer | Issued devices with recent VPN activity. |
| total | integer (int64) | Number of users matching the search and status filter. |
| online_total | integer (int64) | Online users among all matches, not only this page. |
| page | integer | Current page number, starting at 1. |
| per_page | integer | Page size, 1–100; default 25. |
| total_pages | integer (int64) | Number of pages; 0 for an empty result. |

```json
{
  "items": [
    {
      "id": "33333333-3333-4333-8333-333333333333",
      "username": "alice",
      "telegram_id": 123456789,
      "enabled": true,
      "created_at": "2030-01-01T00:00:00Z",
      "updated_at": "2030-01-01T00:00:00Z",
      "last_connected_at": null,
      "subscription_plan_id": null,
      "online": false,
      "device_limit": 3,
      "device_count": 0,
      "online_device_count": 0
    }
  ],
  "total": 1,
  "online_total": 0,
  "page": 1,
  "per_page": 25,
  "total_pages": 1
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
  "error": "invalid page"
}
```



## Create user

<Endpoint method="POST" path="/api/admin/users" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/users` |

Accepts one JSON object, not an array. Creates exactly one user. A non-null plan_id also issues access and an initial device; the extra response fields are shown below. Without a plan, no device is created automatically.

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) or null | No | Caller-supplied user UUID. Omitted or null generates a UUID automatically. Uppercase hexadecimal is accepted and returned in lowercase. An existing UUID returns 409 without changing the existing user. |
| username | string | Yes | Unique user name, 1–128 UTF-8 bytes after trimming; no NUL. |
| telegram_id | integer (int64) or null | No | Positive Telegram user ID; null means unset. |
| plan_id | string (UUID) or null | No | Optional plan UUID. Null creates the user without a plan. |

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "username": "alice",
  "telegram_id": 123456789
}
```

**Success response: 201**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| username | string | Unique user name, 1–128 UTF-8 bytes after trimming; no NUL. |
| telegram_id | integer (int64) or null | Positive Telegram user ID; null means unset. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| created_at | string (RFC3339) | Resource creation time. |
| updated_at | string (RFC3339) | Last modification time. |
| last_connected_at | string (RFC3339) or null | Most recent recorded VPN handshake; null when never observed. |
| subscription_plan_id | string (UUID) or null | Assigned server plan; null when no plan is assigned. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| device_limit | integer or null | Maximum issued devices, 1–10000; null removes the limit. |
| device_count | integer | Number of issued device records, not detected physical hardware. |
| online_device_count | integer | Issued devices with recent VPN activity. |

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "username": "alice",
  "telegram_id": 123456789,
  "enabled": true,
  "created_at": "2030-01-01T00:00:00Z",
  "updated_at": "2030-01-01T00:00:00Z",
  "last_connected_at": null,
  "subscription_plan_id": null,
  "online": false,
  "device_limit": 3,
  "device_count": 0,
  "online_device_count": 0
}
```

**201 with plan_id**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| username | string | Unique user name, 1–128 UTF-8 bytes after trimming; no NUL. |
| telegram_id | integer (int64) or null | Positive Telegram user ID; null means unset. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| created_at | string (RFC3339) | Resource creation time. |
| updated_at | string (RFC3339) | Last modification time. |
| last_connected_at | string (RFC3339) or null | Most recent recorded VPN handshake; null when never observed. |
| subscription_plan_id | string (UUID) or null | Assigned server plan; null when no plan is assigned. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| device_limit | integer or null | Maximum issued devices, 1–10000; null removes the limit. |
| device_count | integer | Number of issued device records, not detected physical hardware. |
| online_device_count | integer | Issued devices with recent VPN activity. |
| subscription_url | string (HTTPS URL) | Issued subscription page URL; treat it as a secret. |
| access_id | string (UUID) | Created user access record ID. |

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "username": "alice",
  "telegram_id": 123456789,
  "enabled": true,
  "created_at": "2030-01-01T00:00:00Z",
  "updated_at": "2030-01-01T00:00:00Z",
  "last_connected_at": null,
  "subscription_plan_id": "22222222-2222-4222-8222-222222222222",
  "online": false,
  "device_limit": 3,
  "device_count": 1,
  "online_device_count": 0,
  "subscription_url": "https://panel.example.com/s/EXAMPLE_SUBSCRIPTION_TOKEN",
  "access_id": "66666666-6666-4666-8666-666666666666"
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 201 | Success; response shape shown above. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 404 | The supplied plan_id does not exist; the user is not created. |
| 409 | The UUID or username already exists, or another state conflict prevents creation. The existing user is not modified. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid user ID"
}
```



## Get user

<Endpoint method="GET" path="/api/admin/users/{id}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}` |

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| username | string | Unique user name, 1–128 UTF-8 bytes after trimming; no NUL. |
| telegram_id | integer (int64) or null | Positive Telegram user ID; null means unset. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| created_at | string (RFC3339) | Resource creation time. |
| updated_at | string (RFC3339) | Last modification time. |
| last_connected_at | string (RFC3339) or null | Most recent recorded VPN handshake; null when never observed. |
| subscription_plan_id | string (UUID) or null | Assigned server plan; null when no plan is assigned. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| device_limit | integer or null | Maximum issued devices, 1–10000; null removes the limit. |
| device_count | integer | Number of issued device records, not detected physical hardware. |
| online_device_count | integer | Issued devices with recent VPN activity. |

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "username": "alice",
  "telegram_id": 123456789,
  "enabled": true,
  "created_at": "2030-01-01T00:00:00Z",
  "updated_at": "2030-01-01T00:00:00Z",
  "last_connected_at": null,
  "subscription_plan_id": null,
  "online": false,
  "device_limit": 3,
  "device_count": 0,
  "online_device_count": 0
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



## Update user

<Endpoint method="PATCH" path="/api/admin/users/{id}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PATCH` |
| URL | `https://panel.example.com/api/admin/users/{id}` |

At least one field is required. Omitted fields are preserved. telegram_id:null clears the Telegram ID. To disable only one user send {"enabled":false}; no bulk request is needed.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| username | string | No | Unique user name, 1–128 UTF-8 bytes after trimming; no NUL. |
| telegram_id | integer (int64) or null | No | Positive Telegram user ID; null means unset. |
| enabled | boolean | No | Whether access is enabled. Disabling takes effect on node synchronization. |

```json
{
  "username": "alice",
  "telegram_id": null,
  "enabled": false
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



## Delete user

<Endpoint method="DELETE" path="/api/admin/users/{id}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `DELETE` |
| URL | `https://panel.example.com/api/admin/users/{id}` |

Deletes the user, their subscriptions and device keys. Nodes revoke access after synchronization.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

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



## Enable or disable several users

<Endpoint method="POST" path="/api/admin/users/bulk/enabled" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/users/bulk/enabled` |

Changes only enabled for the specified existing users, in one transaction. Does not create or delete users, devices or links. ids is a list of user identifiers, NOT subscription URLs. UUID and Telegram ID referring to the same user in one request are rejected. For one user use PATCH /api/admin/users/{id}.

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| ids | array of string | Yes | 1–500 user identifiers, each a UUID or a positive Telegram ID written as a string. These are identifiers, not URLs. Each must identify a different user. |
| enabled | boolean | Yes | Whether access is enabled. Disabling takes effect on node synchronization. |

```json
{
  "ids": [
    "33333333-3333-4333-8333-333333333333",
    "987654321"
  ],
  "enabled": false
}
```

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| updated | integer | Number of users whose enabled value actually changed; already matching users are not counted. |

```json
{
  "updated": 2
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
