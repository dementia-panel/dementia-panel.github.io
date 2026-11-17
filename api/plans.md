---
title: Subscription plans
description: Parameters, request examples and response shapes for service API integrations.
outline: [2, 2]
---

# Subscription plans

Parameters, request examples and response shapes for service API integrations.

## List reusable subscription plans

<Endpoint method="GET" path="/api/admin/subscription-plans" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/subscription-plans` |

A plan is a reusable server list, not one user’s issued access.

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| $ | array of object | List of records; [] when empty. |
| [].id | string (UUID) | Resource identifier. |
| [].name | string | Display name of this resource. |
| [].node_ids | array of string (UUID) | Server UUIDs assigned to this access record or plan. |

```json
[
  {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Europe",
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



## Create subscription plan

<Endpoint method="POST" path="/api/admin/subscription-plans" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/subscription-plans` |

Name: 1–128 trimmed bytes. Node IDs must be unique.

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| name | string | Yes | Name: 1–128 bytes after trimming. |
| node_ids | array of string (UUID) | Yes | 1–128 unique server IDs. PUT replaces the server list. |

```json
{
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Success response: 201**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| node_ids | array of string (UUID) | Server UUIDs assigned to this access record or plan. |

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
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



## Update subscription plan

<Endpoint method="PUT" path="/api/admin/subscription-plans/{id}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/subscription-plans/{id}` |

Replaces only this plan’s server list and updates assigned access. It does not replace user devices.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| name | string | Yes | Name: 1–128 bytes after trimming. |
| node_ids | array of string (UUID) | Yes | 1–128 unique server IDs. PUT replaces the server list. |

```json
{
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| node_ids | array of string (UUID) | Server UUIDs assigned to this access record or plan. |

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
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



## Delete subscription plan

<Endpoint method="DELETE" path="/api/admin/subscription-plans/{id}" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `DELETE` |
| URL | `https://panel.example.com/api/admin/subscription-plans/{id}` |

409 if a user or enabled issued subscription still uses the plan.

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
| 409 | State conflict, duplicate, limit reached or ambiguous Telegram ID; see error. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```



## Get user’s currently assigned access

<Endpoint method="GET" path="/api/admin/users/{id}/subscription" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/subscription` |

Returns JSON null if no plan is assigned. Reset-schedule fields may be null in this projection; use the issued access list for full schedule details.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

**Request body:** none.

**Success response: 200**

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

```json
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
```

**200 without an assignment**

```json
null
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



## Assign a plan and set user’s access expiry

<Endpoint method="PUT" path="/api/admin/users/{id}/subscription" />

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/users/{id}/subscription` |

plan_id:null unassigns. The same plan reuses access/keys, but re-enables access unless enabled:false is specified. Omitted expires_at preserves the date; null removes expiry. url is present only when access is first issued. Reassignment returns id without url; unassignment returns {}.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Yes | User UUID or positive Telegram ID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| plan_id | string (UUID) or null | Yes | Server plan ID; null removes the assignment where supported. |
| enabled | boolean | No | Whether access is enabled. Disabling takes effect on node synchronization. |
| expires_at | string (RFC3339) or null | No | VPN access end time; null means no expiry where supported. |

```json
{
  "plan_id": "22222222-2222-4222-8222-222222222222",
  "enabled": true,
  "expires_at": null
}
```

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |
| url | string (HTTPS URL) or null | Subscription URL; null if a legacy link cannot be recovered. Treat as a secret. |

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "url": "https://panel.example.com/s/EXAMPLE_SUBSCRIPTION_TOKEN"
}
```

**200 reusing access**

| Field | Format | Description |
| --- | --- | --- |
| id | string (UUID) | Resource identifier. |

```json
{
  "id": "66666666-6666-4666-8666-666666666666"
}
```

**200 unassigned**

```json
{}
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
