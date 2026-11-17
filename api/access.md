---
title: Issued access
description: Parameters, request examples and response shapes for service API integrations.
outline: [2, 2]
---

# Issued access

Parameters, request examples and response shapes for service API integrations.

## List issued user access records

<Endpoint method="GET" path="/api/admin/subscriptions" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/subscriptions` |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| $ | array of object | List of records; [] when empty. |
| [].id | string (UUID) | Resource identifier. |
| [].user_id | string (UUID) | User who owns this resource. |
| [].name | string | Display name of this resource. |
| [].enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| [].expires_at | string (RFC3339) or null | VPN access end time; null means no expiry where supported. |
| [].traffic_limit_bytes | integer (int64) or null | Positive total received+sent traffic allowance in bytes; null means unlimited. |
| [].traffic_used_bytes | integer (int64) | Accounted traffic in bytes. |
| [].traffic_reset_days | integer or null | Scheduled reset period in days; null means disabled. |
| [].traffic_reset_at | string (RFC3339) or null | Next automatic traffic reset. |
| [].plan_id | string (UUID) or null | Server plan ID; null removes the assignment where supported. |
| [].node_ids | array of string (UUID) | Server UUIDs assigned to this access record or plan. |

```json
[
  {
    "id": "66666666-6666-4666-8666-666666666666",
    "user_id": "33333333-3333-4333-8333-333333333333",
    "name": "Europe",
    "enabled": true,
    "expires_at": null,
    "traffic_limit_bytes": null,
    "traffic_used_bytes": 0,
    "traffic_reset_days": null,
    "traffic_reset_at": null,
    "plan_id": "22222222-2222-4222-8222-222222222222",
    "node_ids": [
      "11111111-1111-4111-8111-111111111111"
    ]
  }
]
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



## Issue direct subscription to user

<Endpoint method="POST" path="/api/admin/subscriptions" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions` |

Compatibility/direct issuance. user_id must be a UUID, not a Telegram ID. expires_at must be in the future. Name: 1–128 trimmed bytes. Prefer user plan assignment for unlimited expiry. Accepts one subscription object; node_ids are multiple servers within that subscription, not multiple users.

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| user_id | string (UUID) | Yes | User who owns this resource. |
| name | string | Yes | Name: 1–128 bytes after trimming. |
| expires_at | string (RFC3339) | Yes | VPN access end time; null means no expiry where supported. |
| node_ids | array of string (UUID) | Yes | 1–128 unique server IDs. PUT replaces the server list. |

```json
{
  "user_id": "33333333-3333-4333-8333-333333333333",
  "name": "Alice",
  "expires_at": "2030-12-31T23:59:00Z",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Success response: 201**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| user_id | string (UUID) | User who owns this resource. |
| name | string | Display name of this resource. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| expires_at | string (RFC3339) or null | VPN access end time; null means no expiry where supported. |
| traffic_limit_bytes | integer (int64) or null | Positive total received+sent traffic allowance in bytes; null means unlimited. |
| traffic_used_bytes | integer (int64) | Accounted traffic in bytes. |
| traffic_reset_days | integer or null | Scheduled reset period in days; null means disabled. |
| traffic_reset_at | string (RFC3339) or null | Next automatic traffic reset. |
| plan_id | string (UUID) or null | Server plan ID; null removes the assignment where supported. |
| node_ids | array of string (UUID) | Server UUIDs assigned to this access record or plan. |
| url | string (HTTPS URL) or null | Subscription URL; null if a legacy link cannot be recovered. Treat as a secret. |

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "user_id": "33333333-3333-4333-8333-333333333333",
  "name": "Alice",
  "enabled": true,
  "expires_at": "2030-12-31T23:59:00Z",
  "traffic_limit_bytes": null,
  "traffic_used_bytes": 0,
  "traffic_reset_days": null,
  "traffic_reset_at": null,
  "plan_id": "22222222-2222-4222-8222-222222222222",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ],
  "url": "https://panel.example.com/s/EXAMPLE_SUBSCRIPTION_TOKEN"
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 201 | Success; response shape shown above. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 409 | State conflict, duplicate, limit reached or ambiguous Telegram ID; see error. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Get a saved subscription link

<Endpoint method="GET" path="/api/admin/subscriptions/{id}/link" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/link` |

Does not issue or rotate keys. url:null is possible for old hash-only records.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Subscription URL; null if a legacy link cannot be recovered. Treat as a secret. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_SUBSCRIPTION_TOKEN"
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 200 | Success; response shape shown above. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 404 | Resource or user not found, or device/access does not belong to this user. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Enable, disable or change expiry of access record

<Endpoint method="PATCH" path="/api/admin/subscriptions/{id}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PATCH` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}` |

Provide enabled and/or a non-null RFC3339 expires_at. This PATCH cannot clear expiry with null; use PUT /users/{id}/subscription instead.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| enabled | boolean | No | Whether access is enabled. Disabling takes effect on node synchronization. |
| expires_at | string (RFC3339) | No | VPN access end time; null means no expiry where supported. |

```json
{
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
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Replace servers in issued access record

<Endpoint method="PUT" path="/api/admin/subscriptions/{id}/nodes" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/nodes` |

Full replacement of this access record’s servers. Removes credentials on removed servers and creates them for added servers; it does not overwrite device records.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| node_ids | array of string (UUID) | Yes | 1–128 unique server IDs. PUT replaces the server list. |

```json
{
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
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



## Rotate subscription and device links without changing VPN keys

<Endpoint method="POST" path="/api/admin/subscriptions/{id}/rotate-link" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/rotate-link` |

Old subscription/device links stop working. Previously imported VPN keys remain valid.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Subscription URL; null if a legacy link cannot be recovered. Treat as a secret. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_NEW_TOKEN"
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 200 | Success; response shape shown above. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 404 | Resource or user not found, or device/access does not belong to this user. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Replace links and revoke previously issued VPN keys

<Endpoint method="POST" path="/api/admin/subscriptions/{id}/revoke" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/revoke` |

Replaces links and peer keys. Old imported profiles stop after node synchronization.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Subscription URL; null if a legacy link cannot be recovered. Treat as a secret. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_NEW_TOKEN"
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 200 | Success; response shape shown above. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 404 | Resource or user not found, or device/access does not belong to this user. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Delete issued access record

<Endpoint method="DELETE" path="/api/admin/subscriptions/{id}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `DELETE` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}` |

Deletes the subscription and its peers, preserving the user and their device records.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

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
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Set or remove access record’s traffic limit

<Endpoint method="PUT" path="/api/admin/subscriptions/{id}/traffic-limit" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/traffic-limit` |

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| traffic_limit_bytes | integer (int64) or null | Yes | Positive total received+sent traffic allowance in bytes; null means unlimited. |

```json
{
  "traffic_limit_bytes": 10737418240
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
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Reset accounted traffic for access record

<Endpoint method="POST" path="/api/admin/subscriptions/{id}/reset-traffic" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/reset-traffic` |

Resets usage to zero; the configured traffic limit stays unchanged.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

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
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Configure automatic traffic reset for access record

<Endpoint method="PUT" path="/api/admin/subscriptions/{id}/traffic-reset-schedule" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/traffic-reset-schedule` |

Next reset is now + days × 24 hours. null disables automatic reset.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| days | integer or null | Yes | Traffic reset interval: 1–366 days; null disables the schedule. |

```json
{
  "days": 30
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
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```
