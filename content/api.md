# Dementia API

[English](#english) · [Русский](#russian)

<a id="english"></a>

## English

Reference exclusively for external clients authenticated by a service API key. Administrator session endpoints, Telegram webhooks, node protocol endpoints and public subscription pages are excluded.

### Authentication and conventions

Create a key in the admin panel and send `Authorization: Bearer dementia_api_...` on every request. Keys do not expire; deleting one immediately revokes it. Example origin: `https://panel.example.com`. Use `Content-Type: application/json` for JSON. Request bodies are limited to 64 KiB and unknown fields are rejected.

UUIDs are lowercase with hyphens. In `/users/{id}/...`, `id` accepts either a user UUID or their positive Telegram ID written as a string. Other identifiers are UUIDs unless stated otherwise. Ambiguous Telegram IDs return 409; missing users return 404. Dates use RFC3339, traffic uses integer bytes. Preserve int64 precision.

Creating a user/device accepts one object. `node_ids` arrays contain servers within one subscription. Multi-user changes are explicitly marked `bulk` in the URL. Creation POSTs are not idempotent: check the outcome after a timeout before retrying.

The response `X-Request-ID` correlates requests with logs. A 204 response has no body; it is neither `{}` nor `null`.

Every endpoint below includes its own parameter/status tables and a complete response example. Example credentials are fictitious. Proxy/network failures are outside these status tables; unknown routes may return plain text instead of JSON.

### Contents

- [List users](#en-endpoint-1)
- [Create user](#en-endpoint-2)
- [Get user](#en-endpoint-3)
- [Update user](#en-endpoint-4)
- [Delete user](#en-endpoint-5)
- [Enable or disable several users](#en-endpoint-6)
- [List devices](#en-endpoint-7)
- [Add device](#en-endpoint-8)
- [Get device](#en-endpoint-9)
- [Rename device](#en-endpoint-10)
- [Delete device](#en-endpoint-11)
- [Get an existing device subscription link](#en-endpoint-12)
- [Change user’s device limit](#en-endpoint-13)
- [Get existing connection keys for device and server](#en-endpoint-14)
- [List active node records](#en-endpoint-15)
- [Get node](#en-endpoint-17)
- [Add node](#en-endpoint-18)
- [Update node](#en-endpoint-19)
- [Set or reset a node’s public VPN endpoint](#en-endpoint-20)
- [Check whether node sends a fresh report](#en-endpoint-21)
- [Request restart of node](#en-endpoint-22)
- [Request restart of all ready nodes](#en-endpoint-23)
- [Delete node](#en-endpoint-24)
- [List reusable subscription plans](#en-endpoint-25)
- [Create subscription plan](#en-endpoint-26)
- [Update subscription plan](#en-endpoint-27)
- [Delete subscription plan](#en-endpoint-28)
- [Get user’s currently assigned access](#en-endpoint-29)
- [Assign a plan and set user’s access expiry](#en-endpoint-30)
- [List issued user access records](#en-endpoint-31)
- [Issue direct subscription to user](#en-endpoint-32)
- [Get a saved subscription link](#en-endpoint-33)
- [Enable, disable or change expiry of access record](#en-endpoint-34)
- [Replace servers in issued access record](#en-endpoint-35)
- [Rotate subscription and device links without changing VPN keys](#en-endpoint-36)
- [Replace links and revoke previously issued VPN keys](#en-endpoint-37)
- [Delete issued access record](#en-endpoint-38)
- [Set or remove access record’s traffic limit](#en-endpoint-39)
- [Reset accounted traffic for access record](#en-endpoint-40)
- [Configure automatic traffic reset for access record](#en-endpoint-41)
- [Get daily traffic statistics](#en-endpoint-42)
- [Get the default device limit for new users](#en-endpoint-43)
- [Change the default device limit for new users](#en-endpoint-44)

<a id="en-endpoint-1"></a>

#### List users

##### `GET /api/admin/users`

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
| `sort` | string | No | `created_at` | created_at: newest first; created_at_asc: oldest first; username: alphabetically; last_connected_at: most recent first, nulls last. UUID breaks ties. Search and status filters apply before pagination. |

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


<a id="en-endpoint-2"></a>

#### Create user

##### `POST /api/admin/users`

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
| expires_at | string (RFC3339) or null | No | Exact subscription expiration, including time and a UTC offset. Requires non-null plan_id when set. Omitted or null means no expiration. |

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "username": "alice",
  "telegram_id": 123456789
}
```


Request with a plan and expiration:

```json
{
  "username": "alice",
  "plan_id": "22222222-2222-4222-8222-222222222222",
  "expires_at": "2030-02-01T15:30:00Z"
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
| expires_at | string (RFC3339) or null | Saved subscription expiration; null means unlimited. |

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
  "access_id": "66666666-6666-4666-8666-666666666666",
  "expires_at": "2030-02-01T15:30:00Z"
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


<a id="en-endpoint-3"></a>

#### Get user

##### `GET /api/admin/users/{id}`

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


<a id="en-endpoint-4"></a>

#### Update user

##### `PATCH /api/admin/users/{id}`

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


<a id="en-endpoint-5"></a>

#### Delete user

##### `DELETE /api/admin/users/{id}`

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


<a id="en-endpoint-6"></a>

#### Enable or disable several users

##### `POST /api/admin/users/bulk/enabled`

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


<a id="en-endpoint-7"></a>

#### List devices

##### `GET /api/admin/users/{id}/devices`

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


<a id="en-endpoint-8"></a>

#### Add device

##### `POST /api/admin/users/{id}/devices`

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


<a id="en-endpoint-9"></a>

#### Get device

##### `GET /api/admin/users/{id}/devices/{deviceID}`

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


<a id="en-endpoint-10"></a>

#### Rename device

##### `PATCH /api/admin/users/{id}/devices/{deviceID}`

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


<a id="en-endpoint-11"></a>

#### Delete device

##### `DELETE /api/admin/users/{id}/devices/{deviceID}`

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


<a id="en-endpoint-12"></a>

#### Get an existing device subscription link

##### `GET /api/admin/users/{id}/devices/{deviceID}/link`

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


<a id="en-endpoint-13"></a>

#### Change user’s device limit

##### `PUT /api/admin/users/{id}/device-limit`

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


<a id="en-endpoint-14"></a>

#### Get existing connection keys for device and server

##### `GET /api/admin/users/{id}/devices/{deviceID}/nodes/{nodeID}/profile`

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


<a id="en-endpoint-15"></a>

#### List active node records

##### `GET /api/admin/nodes`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/nodes` |

Excludes retired records; this list is not paginated.

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| $ | array of object | List of records; [] when empty. |
| [].endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| [].endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| [].retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| [].id | string (UUID) | Resource identifier. |
| [].name | string | Display name of this resource. |
| [].ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| [].ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| [].vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| [].status | string | Node state: installing, ready or failed. |
| [].enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| [].last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| [].revision | integer (int64) | Desired node configuration revision. |
| [].applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| [].online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| [].connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| [].connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| [].restart_revision | integer (int64) | Requested restart revision. |
| [].restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| [].operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| [].online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| [].error | string or null | Safe error description; null if no current error. |

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
    "online_user_count": 0,
    "error": null
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


<a id="en-endpoint-16"></a>

#### Get node metrics

##### `GET /api/admin/nodes/metrics`

Returns live unique users across all active nodes, the highest observed simultaneous count since tracking began, and total VPN traffic reported today in UTC. The peak is sampled every 15 seconds; brief activity between samples may be missed. A user connected to multiple nodes counts once.

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/nodes/metrics` |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| online_users | integer | Unique users with recent valid VPN handshakes on enabled, synchronized nodes. |
| peak_online_users | integer | Highest sampled count since the metrics migration was installed. |
| traffic_today_bytes | integer (int64) | Sum of received and sent bytes reported by all nodes since 00:00 UTC. |

```json
{
  "online_users": 12,
  "peak_online_users": 27,
  "traffic_today_bytes": 104857600
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 200 | Success; response shape shown above. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Database timeout/lock conflict or backend shutdown. |

<a id="en-endpoint-17"></a>

#### Get node

##### `GET /api/admin/nodes/{id}`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://panel.example.com/api/admin/nodes/{id}` |

Includes operation_stage and error. A retired node may still be returned by UUID.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| status | string | Node state: installing, ready or failed. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| revision | integer (int64) | Desired node configuration revision. |
| applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| restart_revision | integer (int64) | Requested restart revision. |
| restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| error | string or null | Safe error description; null if no current error. |

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
  "online_user_count": 0,
  "error": null
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


<a id="en-endpoint-18"></a>

#### Add node

##### `POST /api/admin/nodes`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/nodes` |

Returns 202 immediately after queuing installation. Poll GET /api/admin/nodes/{id}; installation can take up to 15 minutes. Node name is 1–128 bytes without control characters. There are up to four concurrent installation/cleanup jobs.

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| name | string | Yes | Name: 1–128 bytes after trimming. |
| ip | string (IPv4/IPv6) | Yes | Server IP literal; global-unicast address without a zone suffix. |
| login | string | Yes | SSH account; [a-zA-Z_][a-zA-Z0-9_.-]{0,63}. |
| password | string | Yes | SSH password, 1–4096 bytes, without CR, LF or NUL. |
| ssh_port | integer | No | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | No | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| reset_host_key | boolean | No | Default false. True explicitly allows trusting a new SSH host key during a failed-node retry. |

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

**Success response: 202**

| Field | Format | Description |
| --- | --- | --- |
| endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| status | string | Node state: installing, ready or failed. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| revision | integer (int64) | Desired node configuration revision. |
| applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| restart_revision | integer (int64) | Requested restart revision. |
| restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| error | string or null | Safe error description; null if no current error. |

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
  "online_user_count": 0,
  "error": null
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 202 | Accepted; operation runs asynchronously. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 409 | State conflict, duplicate, limit reached or ambiguous Telegram ID; see error. |
| 429 | All background workers are busy; retry later. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="en-endpoint-19"></a>

#### Update node

##### `PATCH /api/admin/nodes/{id}`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PATCH` |
| URL | `https://panel.example.com/api/admin/nodes/{id}` |

Provide name and/or enabled. Omitted fields remain unchanged. Pause takes effect after synchronization.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| enabled | boolean | No | Whether access is enabled. Disabling takes effect on node synchronization. |
| name | string | No | Name: 1–128 bytes after trimming. |

```json
{
  "enabled": false
}
```

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| status | string | Node state: installing, ready or failed. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| revision | integer (int64) | Desired node configuration revision. |
| applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| restart_revision | integer (int64) | Requested restart revision. |
| restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| error | string or null | Safe error description; null if no current error. |

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
  "online_user_count": 0,
  "error": null
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


<a id="en-endpoint-20"></a>

#### Set or reset a node’s public VPN endpoint

##### `PUT /api/admin/nodes/{id}/endpoint`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `PUT` |
| URL | `https://panel.example.com/api/admin/nodes/{id}/endpoint` |

Full replacement: omitted/null host or port resets that override. Send both null to use the server IP and configured VPN port.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| host | string or null | No | VPN IP or dotted DNS name, up to 253 characters. Null resets the override. |
| port | integer or null | No | VPN port, 1–65535; null resets the override. |

```json
{
  "host": "vpn.example.com",
  "port": 51820
}
```

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| status | string | Node state: installing, ready or failed. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| revision | integer (int64) | Desired node configuration revision. |
| applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| restart_revision | integer (int64) | Requested restart revision. |
| restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| error | string or null | Safe error description; null if no current error. |

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
  "online_user_count": 0,
  "error": null
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


<a id="en-endpoint-21"></a>

#### Check whether node sends a fresh report

##### `POST /api/admin/nodes/{id}/actions/check`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/nodes/{id}/actions/check` |

Waits up to 12 seconds for a fresh agent report; this is not ICMP ping. No response is represented as 200 with responded:false.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body:** none.

**Success response: 200**

| Field | Format | Description |
| --- | --- | --- |
| endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| status | string | Node state: installing, ready or failed. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| revision | integer (int64) | Desired node configuration revision. |
| applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| restart_revision | integer (int64) | Requested restart revision. |
| restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| error | string or null | Safe error description; null if no current error. |
| responded | boolean | A newer agent report arrived during the check. False is a valid 200 result. |

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
  "online_user_count": 0,
  "error": null,
  "responded": true
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


<a id="en-endpoint-22"></a>

#### Request restart of node

##### `POST /api/admin/nodes/{id}/actions/restart`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/nodes/{id}/actions/restart` |

Only a ready, non-retired node can be restarted. 202 means queued, not completed.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body:** none.

**Success response: 202**

| Field | Format | Description |
| --- | --- | --- |
| endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| status | string | Node state: installing, ready or failed. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| revision | integer (int64) | Desired node configuration revision. |
| applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| restart_revision | integer (int64) | Requested restart revision. |
| restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| error | string or null | Safe error description; null if no current error. |

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
  "online_user_count": 0,
  "error": null
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 202 | Accepted; operation runs asynchronously. |
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


<a id="en-endpoint-23"></a>

#### Request restart of all ready nodes

##### `POST /api/admin/nodes/actions/restart-all`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://panel.example.com/api/admin/nodes/actions/restart-all` |

**Request body:** none.

**Success response: 202**

| Field | Format | Description |
| --- | --- | --- |
| queued | integer | Number of nodes whose restart was queued. |

```json
{
  "queued": 2
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 202 | Accepted; operation runs asynchronously. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (500):

```json
{
  "error": "internal error"
}
```


<a id="en-endpoint-24"></a>

#### Delete node

##### `DELETE /api/admin/nodes/{id}`

**Request URL**

| Parameter | Value |
| --- | --- |
| Method | `DELETE` |
| URL | `https://panel.example.com/api/admin/nodes/{id}` |

cleanup:false removes only the panel record and assignments, without SSH. cleanup:true (also null/omitted) requires login and password and queues remote cleanup. Installing/removing nodes return 409. Remote cleanup can take up to 3 minutes. Poll the node error/stage; the same IP can later be registered again.

**URL parameters**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| id | string (UUID) | Yes | Resource UUID. |

**Request body**

| Field | Format | Required | Description |
| --- | --- | --- | --- |
| cleanup | boolean or null | No | false: remove only from the panel; true, null or omitted: SSH cleanup of the VPS. |
| login | string | When cleanup≠false | SSH account; [a-zA-Z_][a-zA-Z0-9_.-]{0,63}. |
| password | string | When cleanup≠false | SSH password, 1–4096 bytes, without CR, LF or NUL. |

```json
{
  "cleanup": false
}
```

Request example with VPS cleanup:

```json
{
  "cleanup": true,
  "login": "root",
  "password": "REPLACE_SSH_PASSWORD"
}
```

**Success response: 204**

No response body.

```http
HTTP/1.1 204 No Content
```

**202 with cleanup:true**

| Field | Format | Description |
| --- | --- | --- |
| endpoint_host | string or null | Public VPN host override; null uses the server IP. |
| endpoint_port | integer or null | Public VPN port override; null uses vpn_port. |
| retired_at | string (RFC3339) or null | Removal time; null for an active record. |
| id | string (UUID) | Resource identifier. |
| name | string | Display name of this resource. |
| ip | string (IPv4/IPv6) | Server IP literal; global-unicast address without a zone suffix. |
| ssh_port | integer | SSH port, 1–65535. Omitted or zero: 22. |
| vpn_port | integer | VPN UDP port, 1–65535. Omitted or zero: 1234. |
| status | string | Node state: installing, ready or failed. |
| enabled | boolean | Whether access is enabled. Disabling takes effect on node synchronization. |
| last_seen_at | string (RFC3339) or null | Last successful agent contact. |
| revision | integer (int64) | Desired node configuration revision. |
| applied_revision | integer (int64) | Configuration revision acknowledged by the agent. |
| online | boolean | Recent VPN activity, based on node handshake reports; not a unique hardware count. |
| connection_ok | boolean or null | Most recent monitor result; null before the first check. |
| connection_checked_at | string (RFC3339) or null | Time of the last monitor check. |
| restart_revision | integer (int64) | Requested restart revision. |
| restarted_revision | integer (int64) | Restart revision acknowledged by the agent. |
| operation_stage | string | Installation/removal progress stage. Examples: queued, ssh, download, requirements, docker, build, start, verify, complete, removing, remove_failed, removed. |
| online_user_count | integer | Distinct users with recent VPN activity on this node: report newer than 1 minute and handshake newer than 3 minutes. Only users with active access on an enabled, ready and synchronized node are counted. Stale reports return 0. |
| error | string or null | Safe error description; null if no current error. |

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
  "online_user_count": 0,
  "error": null
}
```

**Response statuses**

| Status | Meaning |
| --- | --- |
| 202 | Asynchronous VPS cleanup accepted; returns the node. |
| 204 | Success; no body. |
| 400 | Invalid path/query/JSON parameters, malformed value or missing required field. |
| 401 | API key is missing, invalid, unregistered or deleted. |
| 409 | State conflict, duplicate, limit reached or ambiguous Telegram ID; see error. |
| 429 | All background workers are busy; retry later. |
| 500 | Internal backend failure; details are in server logs. |
| 503 | Temporarily unavailable operation, database timeout/lock conflict or backend shutdown. |

Error body example (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="en-endpoint-25"></a>

#### List reusable subscription plans

##### `GET /api/admin/subscription-plans`

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


<a id="en-endpoint-26"></a>

#### Create subscription plan

##### `POST /api/admin/subscription-plans`

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


<a id="en-endpoint-27"></a>

#### Update subscription plan

##### `PUT /api/admin/subscription-plans/{id}`

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


<a id="en-endpoint-28"></a>

#### Delete subscription plan

##### `DELETE /api/admin/subscription-plans/{id}`

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


<a id="en-endpoint-29"></a>

#### Get user’s currently assigned access

##### `GET /api/admin/users/{id}/subscription`

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


<a id="en-endpoint-30"></a>

#### Assign a plan and set user’s access expiry

##### `PUT /api/admin/users/{id}/subscription`

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


<a id="en-endpoint-31"></a>

#### List issued user access records

##### `GET /api/admin/subscriptions`

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


<a id="en-endpoint-32"></a>

#### Issue direct subscription to user

##### `POST /api/admin/subscriptions`

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


<a id="en-endpoint-33"></a>

#### Get a saved subscription link

##### `GET /api/admin/subscriptions/{id}/link`

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


<a id="en-endpoint-34"></a>

#### Enable, disable or change expiry of access record

##### `PATCH /api/admin/subscriptions/{id}`

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


<a id="en-endpoint-35"></a>

#### Replace servers in issued access record

##### `PUT /api/admin/subscriptions/{id}/nodes`

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


<a id="en-endpoint-36"></a>

#### Rotate subscription and device links without changing VPN keys

##### `POST /api/admin/subscriptions/{id}/rotate-link`

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


<a id="en-endpoint-37"></a>

#### Replace links and revoke previously issued VPN keys

##### `POST /api/admin/subscriptions/{id}/revoke`

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


<a id="en-endpoint-38"></a>

#### Delete issued access record

##### `DELETE /api/admin/subscriptions/{id}`

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


<a id="en-endpoint-39"></a>

#### Set or remove access record’s traffic limit

##### `PUT /api/admin/subscriptions/{id}/traffic-limit`

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


<a id="en-endpoint-40"></a>

#### Reset accounted traffic for access record

##### `POST /api/admin/subscriptions/{id}/reset-traffic`

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


<a id="en-endpoint-41"></a>

#### Configure automatic traffic reset for access record

##### `PUT /api/admin/subscriptions/{id}/traffic-reset-schedule`

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


<a id="en-endpoint-42"></a>

#### Get daily traffic statistics

##### `GET /api/admin/traffic`

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


<a id="en-endpoint-43"></a>

#### Get the default device limit for new users

##### `GET /api/admin/settings/devices`

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


<a id="en-endpoint-44"></a>

#### Change the default device limit for new users

##### `PUT /api/admin/settings/devices`

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


<a id="russian"></a>

## Русский

Документация только для сторонних клиентов с сервисным API-ключом. Методы сессии администратора, Telegram webhook, протокол нод и публичные страницы подписки не входят в этот API-справочник.

### Авторизация и правила

Создайте ключ в админке и передавайте `Authorization: Bearer dementia_api_...` в каждом запросе. Ключ бессрочный; удаление немедленно отзывает доступ. Базовый адрес примеров: `https://panel.example.com`. Для JSON задайте `Content-Type: application/json`. Тело запроса ограничено 64 КиБ; неизвестные поля отклоняются.

UUID записываются строчными буквами с дефисами. В `/users/{id}/...` параметр `id` принимает UUID пользователя или его положительный Telegram ID строкой. Остальные идентификаторы — UUID, если явно не указано иное. Неоднозначный Telegram ID возвращает 409, отсутствующий пользователь — 404. Даты — RFC3339, трафик — целые байты. Сохраняйте точность int64.

Создание пользователя/устройства принимает один объект. Массивы `node_ids` — серверы одной подписки. Массовое изменение пользователей явно обозначено словом `bulk` в URL. POST-создание не идемпотентно: после таймаута проверьте результат перед повтором.

`X-Request-ID` в ответе позволяет найти запрос в логах. При ответе 204 тело действительно отсутствует, это не `{}` и не `null`.

Каждый запрос ниже содержит собственные таблицы параметров и статусов и полный пример ответа. Значения ключей в примерах фиктивные. Возможные сетевые ошибки прокси не перечислены; неизвестные маршруты могут возвращать текст вместо JSON.

### Содержание

- [Получить список пользователей](#ru-endpoint-1)
- [Создать пользователя](#ru-endpoint-2)
- [Получить пользователя](#ru-endpoint-3)
- [Изменить пользователя](#ru-endpoint-4)
- [Удалить пользователя](#ru-endpoint-5)
- [Включить или отключить нескольких пользователей](#ru-endpoint-6)
- [Получить список устройств](#ru-endpoint-7)
- [Добавить устройство](#ru-endpoint-8)
- [Получить устройство](#ru-endpoint-9)
- [Переименовать устройство](#ru-endpoint-10)
- [Удалить устройство](#ru-endpoint-11)
- [Получить ссылку подписки устройства](#ru-endpoint-12)
- [Изменить лимит устройств пользователя](#ru-endpoint-13)
- [Получить существующие ключи устройства для сервера](#ru-endpoint-14)
- [Получить список нод](#ru-endpoint-15)
- [Получить ноду](#ru-endpoint-17)
- [Добавить ноду](#ru-endpoint-18)
- [Изменить ноду](#ru-endpoint-19)
- [Изменить или сбросить публичный VPN-адрес ноды](#ru-endpoint-20)
- [Проверить получение нового отчёта от ноды](#ru-endpoint-21)
- [Запросить перезапуск ноды](#ru-endpoint-22)
- [Запросить перезапуск всех готовых нод](#ru-endpoint-23)
- [Удалить ноду](#ru-endpoint-24)
- [Получить наборы серверов подписок](#ru-endpoint-25)
- [Создать план подписки](#ru-endpoint-26)
- [Изменить план подписки](#ru-endpoint-27)
- [Удалить план подписки](#ru-endpoint-28)
- [Получить текущий доступ пользователя](#ru-endpoint-29)
- [Назначить план и срок доступа одному пользователю](#ru-endpoint-30)
- [Получить список выданного доступа](#ru-endpoint-31)
- [Выдать прямой доступ одному пользователю](#ru-endpoint-32)
- [Получить сохранённую ссылку подписки](#ru-endpoint-33)
- [Включить, отключить или изменить срок доступа](#ru-endpoint-34)
- [Заменить серверы выданного доступа](#ru-endpoint-35)
- [Заменить ссылки подписки и устройств без замены VPN-ключей](#ru-endpoint-36)
- [Заменить ссылки и отозвать прежние VPN-ключи](#ru-endpoint-37)
- [Удалить выданный доступ](#ru-endpoint-38)
- [Задать или снять лимит трафика доступа](#ru-endpoint-39)
- [Сбросить учтённый трафик доступа](#ru-endpoint-40)
- [Настроить автоматический сброс трафика доступа](#ru-endpoint-41)
- [Получить статистику трафика по дням](#ru-endpoint-42)
- [Получить лимит устройств по умолчанию для новых пользователей](#ru-endpoint-43)
- [Изменить лимит устройств по умолчанию для новых пользователей](#ru-endpoint-44)

<a id="ru-endpoint-1"></a>

#### Получить список пользователей

##### `GET /api/admin/users`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/users` |

**Query-параметры**

| Параметр | Формат | Обязательно | По умолчанию | Назначение |
| --- | --- | --- | --- | --- |
| `page` | integer | Нет | `1` | Номер страницы: 1–1000000000. |
| `per_page` | integer | Нет | `25` | Количество пользователей на странице: 1–100. |
| `search` | string | Нет | — | до 128 байт UTF-8. Буквальная подстрока имени без учёта регистра либо Telegram ID. |
| `status` | string | Нет | `all` | all, online, disabled. |
| `sort` | string | Нет | `created_at` | created_at: сначала новые; created_at_asc: сначала старые; username: по имени; last_connected_at: по последнему подключению, null в конце. UUID определяет порядок при равенстве значений. Поиск и статус применяются до пагинации. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| items | array of object | Пользователи текущей страницы. Пустая страница содержит []. |
| items[].id | string (UUID) | Идентификатор ресурса. |
| items[].username | string | Уникальное имя пользователя: 1–128 байт UTF-8 после удаления пробелов по краям; без NUL. |
| items[].telegram_id | integer (int64) or null | Положительный Telegram ID пользователя; null — не задан. |
| items[].enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| items[].created_at | string (RFC3339) | Время создания ресурса. |
| items[].updated_at | string (RFC3339) | Время последнего изменения. |
| items[].last_connected_at | string (RFC3339) or null | Последнее зафиксированное рукопожатие VPN; null — ещё не наблюдалось. |
| items[].subscription_plan_id | string (UUID) or null | Назначенный набор серверов; null — план не назначен. |
| items[].online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| items[].device_limit | integer or null | Лимит выданных устройств: 1–10000; null отключает ограничение. |
| items[].device_count | integer | Число выданных устройств, а не автоматически обнаруженных физических аппаратов. |
| items[].online_device_count | integer | Выданные устройства с недавней VPN-активностью. |
| total | integer (int64) | Всего пользователей, соответствующих поиску и фильтру статуса. |
| online_total | integer (int64) | Число онлайн-пользователей среди всех найденных, а не только текущей страницы. |
| page | integer | Текущая страница, начиная с 1. |
| per_page | integer | Размер страницы: 1–100; по умолчанию 25. |
| total_pages | integer (int64) | Число страниц; 0 при пустом результате. |

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

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid page"
}
```


<a id="ru-endpoint-2"></a>

#### Создать пользователя

##### `POST /api/admin/users`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/users` |

Принимает один JSON-объект, а не массив. Создаёт ровно одного пользователя. Ненулевой plan_id также выдаёт доступ и основное устройство; дополнительные поля ответа показаны ниже. Без плана устройство автоматически не создаётся.

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) или null | Нет | UUID пользователя, заданный клиентом. Если поле отсутствует или равно null, UUID создаётся автоматически. Заглавные шестнадцатеричные символы принимаются и приводятся к нижнему регистру. Повторный UUID возвращает 409 без изменения существующего пользователя. |
| username | string | Да | Уникальное имя пользователя: 1–128 байт UTF-8 после удаления пробелов по краям; без NUL. |
| telegram_id | integer (int64) or null | Нет | Положительный Telegram ID пользователя; null — не задан. |
| plan_id | string (UUID) or null | Нет | Необязательный UUID плана. Null — создать пользователя без плана. |
| expires_at | string (RFC3339) или null | Нет | Точные дата и время окончания подписки с UTC-смещением. При заданном значении требуется непустой plan_id. Отсутствие поля или null означает отсутствие срока. |

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "username": "alice",
  "telegram_id": 123456789
}
```


Запрос с подпиской и сроком действия:

```json
{
  "username": "alice",
  "plan_id": "22222222-2222-4222-8222-222222222222",
  "expires_at": "2030-02-01T15:30:00Z"
}
```

**Успешный ответ: 201**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| username | string | Уникальное имя пользователя: 1–128 байт UTF-8 после удаления пробелов по краям; без NUL. |
| telegram_id | integer (int64) or null | Положительный Telegram ID пользователя; null — не задан. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| created_at | string (RFC3339) | Время создания ресурса. |
| updated_at | string (RFC3339) | Время последнего изменения. |
| last_connected_at | string (RFC3339) or null | Последнее зафиксированное рукопожатие VPN; null — ещё не наблюдалось. |
| subscription_plan_id | string (UUID) or null | Назначенный набор серверов; null — план не назначен. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| device_limit | integer or null | Лимит выданных устройств: 1–10000; null отключает ограничение. |
| device_count | integer | Число выданных устройств, а не автоматически обнаруженных физических аппаратов. |
| online_device_count | integer | Выданные устройства с недавней VPN-активностью. |

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

**201 при указанном plan_id**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| username | string | Уникальное имя пользователя: 1–128 байт UTF-8 после удаления пробелов по краям; без NUL. |
| telegram_id | integer (int64) or null | Положительный Telegram ID пользователя; null — не задан. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| created_at | string (RFC3339) | Время создания ресурса. |
| updated_at | string (RFC3339) | Время последнего изменения. |
| last_connected_at | string (RFC3339) or null | Последнее зафиксированное рукопожатие VPN; null — ещё не наблюдалось. |
| subscription_plan_id | string (UUID) or null | Назначенный набор серверов; null — план не назначен. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| device_limit | integer or null | Лимит выданных устройств: 1–10000; null отключает ограничение. |
| device_count | integer | Число выданных устройств, а не автоматически обнаруженных физических аппаратов. |
| online_device_count | integer | Выданные устройства с недавней VPN-активностью. |
| subscription_url | string (HTTPS URL) | Выданная ссылка страницы подписки; храните как секрет. |
| access_id | string (UUID) | UUID созданного доступа пользователя. |
| expires_at | string (RFC3339) или null | Сохранённый срок действия подписки; null — без ограничения срока. |

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
  "access_id": "66666666-6666-4666-8666-666666666666",
  "expires_at": "2030-02-01T15:30:00Z"
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 201 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Указанный plan_id не существует; пользователь не создаётся. |
| 409 | UUID или имя пользователя уже заняты либо создание невозможно из-за другого конфликта состояния. Существующий пользователь не изменяется. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid user ID"
}
```


<a id="ru-endpoint-3"></a>

#### Получить пользователя

##### `GET /api/admin/users/{id}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}` |

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| username | string | Уникальное имя пользователя: 1–128 байт UTF-8 после удаления пробелов по краям; без NUL. |
| telegram_id | integer (int64) or null | Положительный Telegram ID пользователя; null — не задан. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| created_at | string (RFC3339) | Время создания ресурса. |
| updated_at | string (RFC3339) | Время последнего изменения. |
| last_connected_at | string (RFC3339) or null | Последнее зафиксированное рукопожатие VPN; null — ещё не наблюдалось. |
| subscription_plan_id | string (UUID) or null | Назначенный набор серверов; null — план не назначен. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |
| device_limit | integer or null | Лимит выданных устройств: 1–10000; null отключает ограничение. |
| device_count | integer | Число выданных устройств, а не автоматически обнаруженных физических аппаратов. |
| online_device_count | integer | Выданные устройства с недавней VPN-активностью. |

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

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-4"></a>

#### Изменить пользователя

##### `PATCH /api/admin/users/{id}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PATCH` |
| URL | `https://panel.example.com/api/admin/users/{id}` |

Нужно хотя бы одно поле. Пропущенные поля сохраняются. telegram_id:null удаляет Telegram ID. Для отключения одного пользователя достаточно {"enabled":false}; массовый запрос не нужен.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| username | string | Нет | Уникальное имя пользователя: 1–128 байт UTF-8 после удаления пробелов по краям; без NUL. |
| telegram_id | integer (int64) or null | Нет | Положительный Telegram ID пользователя; null — не задан. |
| enabled | boolean | Нет | Включён ли доступ. Отключение применяется после синхронизации нод. |

```json
{
  "username": "alice",
  "telegram_id": null,
  "enabled": false
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-5"></a>

#### Удалить пользователя

##### `DELETE /api/admin/users/{id}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `DELETE` |
| URL | `https://panel.example.com/api/admin/users/{id}` |

Удаляет пользователя, его подписки и ключи устройств. Ноды прекращают доступ после синхронизации.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса:** отсутствует.

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-6"></a>

#### Включить или отключить нескольких пользователей

##### `POST /api/admin/users/bulk/enabled`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/users/bulk/enabled` |

В одной транзакции меняет только enabled у перечисленных существующих пользователей. Не создаёт и не удаляет пользователей, устройства или ссылки. ids — идентификаторы пользователей, НЕ ссылки подписки. UUID и Telegram ID одного пользователя нельзя передать одновременно. Для одного пользователя используйте PATCH /api/admin/users/{id}.

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| ids | array of string | Да | От 1 до 500 идентификаторов пользователей: UUID либо положительный Telegram ID строкой. Это идентификаторы, не URL. Каждый должен указывать на отдельного пользователя. |
| enabled | boolean | Да | Включён ли доступ. Отключение применяется после синхронизации нод. |

```json
{
  "ids": [
    "33333333-3333-4333-8333-333333333333",
    "987654321"
  ],
  "enabled": false
}
```

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| updated | integer | Число пользователей, у которых enabled действительно изменился; уже подходящие по статусу не учитываются. |

```json
{
  "updated": 2
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-7"></a>

#### Получить список устройств

##### `GET /api/admin/users/{id}/devices`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices` |

Возвращает все выданные устройства. Если пользователь существует, но устройств нет, возвращается [].

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| $ | array of object | Список объектов; без записей — []. |
| [].id | string (UUID) | Идентификатор ресурса. |
| [].user_id | string (UUID) | Владелец ресурса — пользователь. |
| [].name | string | Отображаемое название ресурса. |
| [].created_at | string (RFC3339) | Время создания ресурса. |
| [].updated_at | string (RFC3339) | Время последнего изменения. |
| [].last_connected_at | string (RFC3339) or null | Последнее зафиксированное рукопожатие VPN; null — ещё не наблюдалось. |
| [].online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |

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

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-8"></a>

#### Добавить устройство

##### `POST /api/admin/users/{id}/devices`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices` |

Принимает один объект и добавляет ровно одно устройство. Существующие устройства и их ключи сохраняются. Создаёт отдельный набор ключей на серверах назначенного доступа. Имя: корректный UTF-8, 1–128 байт после обрезки пробелов, без управляющих символов. 409 — достигнут лимит либо Telegram ID неоднозначен. Повторный POST создаёт ещё одно устройство; запрос не идемпотентен.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| name | string | Да | Название: 1–128 байт после обрезки пробелов. |

```json
{
  "name": "iPhone"
}
```

**Успешный ответ: 201**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| user_id | string (UUID) | Владелец ресурса — пользователь. |
| name | string | Отображаемое название ресурса. |
| created_at | string (RFC3339) | Время создания ресурса. |
| updated_at | string (RFC3339) | Время последнего изменения. |
| last_connected_at | string (RFC3339) or null | Последнее зафиксированное рукопожатие VPN; null — ещё не наблюдалось. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |

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

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 201 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-9"></a>

#### Получить устройство

##### `GET /api/admin/users/{id}/devices/{deviceID}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}` |

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |
| deviceID | string (UUID) | Да | UUID устройства этого пользователя. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| user_id | string (UUID) | Владелец ресурса — пользователь. |
| name | string | Отображаемое название ресурса. |
| created_at | string (RFC3339) | Время создания ресурса. |
| updated_at | string (RFC3339) | Время последнего изменения. |
| last_connected_at | string (RFC3339) or null | Последнее зафиксированное рукопожатие VPN; null — ещё не наблюдалось. |
| online | boolean | Недавняя VPN-активность по отчётам нод; не признак уникального физического устройства. |

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

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-10"></a>

#### Переименовать устройство

##### `PATCH /api/admin/users/{id}/devices/{deviceID}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PATCH` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}` |

Меняет только имя устройства; ключи и остальные устройства сохраняются. Требования к имени такие же, как при создании.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |
| deviceID | string (UUID) | Да | UUID устройства этого пользователя. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| name | string | Да | Название: 1–128 байт после обрезки пробелов. |

```json
{
  "name": "Work phone"
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-11"></a>

#### Удалить устройство

##### `DELETE /api/admin/users/{id}/devices/{deviceID}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `DELETE` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}` |

Удаляет это устройство, его ссылку и ключи на всех назначенных серверах. Ключи остальных устройств сохраняются. Отзыв применяется каждой нодой при синхронизации. Удалённое последнее устройство не пересоздаётся автоматически.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |
| deviceID | string (UUID) | Да | UUID устройства этого пользователя. |

**Тело запроса:** отсутствует.

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-12"></a>

#### Получить ссылку подписки устройства

##### `GET /api/admin/users/{id}/devices/{deviceID}/link`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}/link` |

Возвращает стабильную сохранённую ссылку, создавая её только при отсутствии. Не заменяет ключи и ссылки других устройств.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |
| deviceID | string (UUID) | Да | UUID устройства этого пользователя. |

**Query-параметры**

| Параметр | Формат | Обязательно | По умолчанию | Назначение |
| --- | --- | --- | --- | --- |
| `subscription_id` | string (UUID) | Да | — | UUID доступа, принадлежащего этому пользователю. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Ссылка подписки; null, если старую ссылку нельзя восстановить. Храните как секрет. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_DEVICE_TOKEN"
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-13"></a>

#### Изменить лимит устройств пользователя

##### `PUT /api/admin/users/{id}/device-limit`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/users/{id}/device-limit` |

null отключает лимит. Уменьшение лимита не удаляет выданные устройства, а запрещает выдачу новых сверх лимита.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| device_limit | integer or null | Да | Лимит выданных устройств: 1–10000; null отключает ограничение. |

```json
{
  "device_limit": 5
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-14"></a>

#### Получить существующие ключи устройства для сервера

##### `GET /api/admin/users/{id}/devices/{deviceID}/nodes/{nodeID}/profile`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/devices/{deviceID}/nodes/{nodeID}/profile` |

Возвращает существующие ключи текущего плана либо прямого доступа без плана. Повторный GET не выпускает новые ключи. conf — содержимое .conf, key — строка vpn:// для AmneziaVPN. Ключи относятся к одному серверу, а не к объединённому многосерверному WireGuard-конфигу.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |
| deviceID | string (UUID) | Да | UUID устройства этого пользователя. |
| nodeID | string (UUID) | Да | UUID сервера подключения. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| conf | string | Содержимое существующего AmneziaWG .conf для одного сервера этого устройства. |
| key | string (vpn://) | Существующий ключ AmneziaVPN для этого устройства и сервера; храните как секрет. |

```json
{
  "conf": "[Interface]\nPrivateKey = EXAMPLE_ONLY\n...",
  "key": "vpn://EXAMPLE_ONLY"
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-15"></a>

#### Получить список нод

##### `GET /api/admin/nodes`

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
| [].online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
    "online_user_count": 0,
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


<a id="ru-endpoint-16"></a>

#### Получить показатели нод

##### `GET /api/admin/nodes/metrics`

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

<a id="ru-endpoint-17"></a>

#### Получить ноду

##### `GET /api/admin/nodes/{id}`

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
| online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
  "online_user_count": 0,
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


<a id="ru-endpoint-18"></a>

#### Добавить ноду

##### `POST /api/admin/nodes`

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
| online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
  "online_user_count": 0,
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


<a id="ru-endpoint-19"></a>

#### Изменить ноду

##### `PATCH /api/admin/nodes/{id}`

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
| online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
  "online_user_count": 0,
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


<a id="ru-endpoint-20"></a>

#### Изменить или сбросить публичный VPN-адрес ноды

##### `PUT /api/admin/nodes/{id}/endpoint`

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
| online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
  "online_user_count": 0,
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


<a id="ru-endpoint-21"></a>

#### Проверить получение нового отчёта от ноды

##### `POST /api/admin/nodes/{id}/actions/check`

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
| online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
  "online_user_count": 0,
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


<a id="ru-endpoint-22"></a>

#### Запросить перезапуск ноды

##### `POST /api/admin/nodes/{id}/actions/restart`

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
| online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
  "online_user_count": 0,
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


<a id="ru-endpoint-23"></a>

#### Запросить перезапуск всех готовых нод

##### `POST /api/admin/nodes/actions/restart-all`

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


<a id="ru-endpoint-24"></a>

#### Удалить ноду

##### `DELETE /api/admin/nodes/{id}`

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
| online_user_count | integer | Уникальные пользователи с недавней VPN-активностью на этой ноде: отчёт моложе 1 минуты, рукопожатие моложе 3 минут. Учитывается только действующий доступ на включённой, готовой и синхронизированной ноде. Устаревшие отчёты дают 0. |
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
  "online_user_count": 0,
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


<a id="ru-endpoint-25"></a>

#### Получить наборы серверов подписок

##### `GET /api/admin/subscription-plans`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/subscription-plans` |

План — переиспользуемый список серверов, а не выданный доступ конкретного пользователя.

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| $ | array of object | Список объектов; без записей — []. |
| [].id | string (UUID) | Идентификатор ресурса. |
| [].name | string | Отображаемое название ресурса. |
| [].node_ids | array of string (UUID) | UUID серверов этого доступа или плана. |

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


<a id="ru-endpoint-26"></a>

#### Создать план подписки

##### `POST /api/admin/subscription-plans`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/subscription-plans` |

Имя: 1–128 байт после обрезки пробелов. UUID нод должны быть уникальны.

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| name | string | Да | Название: 1–128 байт после обрезки пробелов. |
| node_ids | array of string (UUID) | Да | От 1 до 128 уникальных UUID серверов. PUT заменяет список серверов. |

```json
{
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Успешный ответ: 201**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| node_ids | array of string (UUID) | UUID серверов этого доступа или плана. |

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 201 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-27"></a>

#### Изменить план подписки

##### `PUT /api/admin/subscription-plans/{id}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/subscription-plans/{id}` |

Заменяет серверы только этого плана и обновляет назначенный доступ. Устройства пользователей не заменяются.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| name | string | Да | Название: 1–128 байт после обрезки пробелов. |
| node_ids | array of string (UUID) | Да | От 1 до 128 уникальных UUID серверов. PUT заменяет список серверов. |

```json
{
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| name | string | Отображаемое название ресурса. |
| node_ids | array of string (UUID) | UUID серверов этого доступа или плана. |

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "name": "Europe",
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-28"></a>

#### Удалить план подписки

##### `DELETE /api/admin/subscription-plans/{id}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `DELETE` |
| URL | `https://panel.example.com/api/admin/subscription-plans/{id}` |

409, если план назначен пользователю или используется включённым доступом.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-29"></a>

#### Получить текущий доступ пользователя

##### `GET /api/admin/users/{id}/subscription`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/users/{id}/subscription` |

Возвращает JSON null, если план не назначен. Поля расписания сброса в этом запросе могут быть null; полные значения доступны в списке выданного доступа.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| user_id | string (UUID) | Владелец ресурса — пользователь. |
| name | string | Отображаемое название ресурса. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| expires_at | string (RFC3339) or null | Срок окончания VPN-доступа; null — бессрочно там, где это поддерживается. |
| traffic_limit_bytes | integer (int64) or null | Положительный общий лимит входящего и исходящего трафика в байтах; null — без лимита. |
| traffic_used_bytes | integer (int64) | Учтённый трафик в байтах. |
| traffic_reset_days | integer or null | Период автоматического сброса в днях; null — отключён. |
| traffic_reset_at | string (RFC3339) or null | Следующий автоматический сброс трафика. |
| plan_id | string (UUID) or null | UUID набора серверов; null снимает назначение там, где это поддерживается. |
| node_ids | array of string (UUID) | UUID серверов этого доступа или плана. |

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

**200 без назначенного плана**

```json
null
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-30"></a>

#### Назначить план и срок доступа одному пользователю

##### `PUT /api/admin/users/{id}/subscription`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/users/{id}/subscription` |

plan_id:null снимает назначение. Тот же план сохраняет доступ и ключи, но включает доступ, если явно не задано enabled:false. Пропущенное expires_at сохраняет дату; null делает доступ бессрочным. url есть только при первом выпуске. Повторное назначение возвращает id без url; снятие — {}.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID / Telegram ID) | Да | Идентификатор пользователя: UUID или положительный Telegram ID. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| plan_id | string (UUID) or null | Да | UUID набора серверов; null снимает назначение там, где это поддерживается. |
| enabled | boolean | Нет | Включён ли доступ. Отключение применяется после синхронизации нод. |
| expires_at | string (RFC3339) or null | Нет | Срок окончания VPN-доступа; null — бессрочно там, где это поддерживается. |

```json
{
  "plan_id": "22222222-2222-4222-8222-222222222222",
  "enabled": true,
  "expires_at": null
}
```

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| url | string (HTTPS URL) or null | Ссылка подписки; null, если старую ссылку нельзя восстановить. Храните как секрет. |

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "url": "https://panel.example.com/s/EXAMPLE_SUBSCRIPTION_TOKEN"
}
```

**200 при повторном использовании доступа**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |

```json
{
  "id": "66666666-6666-4666-8666-666666666666"
}
```

**200 после снятия плана**

```json
{}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-31"></a>

#### Получить список выданного доступа

##### `GET /api/admin/subscriptions`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/subscriptions` |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| $ | array of object | Список объектов; без записей — []. |
| [].id | string (UUID) | Идентификатор ресурса. |
| [].user_id | string (UUID) | Владелец ресурса — пользователь. |
| [].name | string | Отображаемое название ресурса. |
| [].enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| [].expires_at | string (RFC3339) or null | Срок окончания VPN-доступа; null — бессрочно там, где это поддерживается. |
| [].traffic_limit_bytes | integer (int64) or null | Положительный общий лимит входящего и исходящего трафика в байтах; null — без лимита. |
| [].traffic_used_bytes | integer (int64) | Учтённый трафик в байтах. |
| [].traffic_reset_days | integer or null | Период автоматического сброса в днях; null — отключён. |
| [].traffic_reset_at | string (RFC3339) or null | Следующий автоматический сброс трафика. |
| [].plan_id | string (UUID) or null | UUID набора серверов; null снимает назначение там, где это поддерживается. |
| [].node_ids | array of string (UUID) | UUID серверов этого доступа или плана. |

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


<a id="ru-endpoint-32"></a>

#### Выдать прямой доступ одному пользователю

##### `POST /api/admin/subscriptions`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions` |

Прямая выдача для совместимости. user_id — UUID, не Telegram ID. expires_at должен быть в будущем. Имя: 1–128 байт после обрезки пробелов. Для бессрочного доступа используйте назначение плана пользователю. Принимает одну подписку; node_ids — серверы этой подписки, а не несколько пользователей.

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| user_id | string (UUID) | Да | Владелец ресурса — пользователь. |
| name | string | Да | Название: 1–128 байт после обрезки пробелов. |
| expires_at | string (RFC3339) | Да | Срок окончания VPN-доступа; null — бессрочно там, где это поддерживается. |
| node_ids | array of string (UUID) | Да | От 1 до 128 уникальных UUID серверов. PUT заменяет список серверов. |

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

**Успешный ответ: 201**

| Поле | Формат | Назначение |
| --- | --- | --- |
| id | string (UUID) | Идентификатор ресурса. |
| user_id | string (UUID) | Владелец ресурса — пользователь. |
| name | string | Отображаемое название ресурса. |
| enabled | boolean | Включён ли доступ. Отключение применяется после синхронизации нод. |
| expires_at | string (RFC3339) or null | Срок окончания VPN-доступа; null — бессрочно там, где это поддерживается. |
| traffic_limit_bytes | integer (int64) or null | Положительный общий лимит входящего и исходящего трафика в байтах; null — без лимита. |
| traffic_used_bytes | integer (int64) | Учтённый трафик в байтах. |
| traffic_reset_days | integer or null | Период автоматического сброса в днях; null — отключён. |
| traffic_reset_at | string (RFC3339) or null | Следующий автоматический сброс трафика. |
| plan_id | string (UUID) or null | UUID набора серверов; null снимает назначение там, где это поддерживается. |
| node_ids | array of string (UUID) | UUID серверов этого доступа или плана. |
| url | string (HTTPS URL) or null | Ссылка подписки; null, если старую ссылку нельзя восстановить. Храните как секрет. |

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

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 201 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-33"></a>

#### Получить сохранённую ссылку подписки

##### `GET /api/admin/subscriptions/{id}/link`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/link` |

Не выпускает и не заменяет ключи. Для старых записей, хранящих только хеш, возможен url:null.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Ссылка подписки; null, если старую ссылку нельзя восстановить. Храните как секрет. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_SUBSCRIPTION_TOKEN"
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


<a id="ru-endpoint-34"></a>

#### Включить, отключить или изменить срок доступа

##### `PATCH /api/admin/subscriptions/{id}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PATCH` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}` |

Передайте enabled и/или ненулевой expires_at в RFC3339. Этот PATCH не сбрасывает срок через null; для этого используйте PUT /users/{id}/subscription.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| enabled | boolean | Нет | Включён ли доступ. Отключение применяется после синхронизации нод. |
| expires_at | string (RFC3339) | Нет | Срок окончания VPN-доступа; null — бессрочно там, где это поддерживается. |

```json
{
  "enabled": false
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
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


<a id="ru-endpoint-35"></a>

#### Заменить серверы выданного доступа

##### `PUT /api/admin/subscriptions/{id}/nodes`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/nodes` |

Полная замена серверов этого доступа. Ключи на убранных серверах удаляются, на добавленных создаются; записи устройств не заменяются.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| node_ids | array of string (UUID) | Да | От 1 до 128 уникальных UUID серверов. PUT заменяет список серверов. |

```json
{
  "node_ids": [
    "11111111-1111-4111-8111-111111111111"
  ]
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-36"></a>

#### Заменить ссылки подписки и устройств без замены VPN-ключей

##### `POST /api/admin/subscriptions/{id}/rotate-link`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/rotate-link` |

Старые ссылки подписки и устройств перестают работать. Ранее импортированные VPN-ключи остаются действительными.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Ссылка подписки; null, если старую ссылку нельзя восстановить. Храните как секрет. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_NEW_TOKEN"
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


<a id="ru-endpoint-37"></a>

#### Заменить ссылки и отозвать прежние VPN-ключи

##### `POST /api/admin/subscriptions/{id}/revoke`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/revoke` |

Заменяет ссылки и ключи. Старые импортированные профили перестают работать после синхронизации нод.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| url | string (HTTPS URL) or null | Ссылка подписки; null, если старую ссылку нельзя восстановить. Храните как секрет. |

```json
{
  "url": "https://panel.example.com/s/EXAMPLE_NEW_TOKEN"
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


<a id="ru-endpoint-38"></a>

#### Удалить выданный доступ

##### `DELETE /api/admin/subscriptions/{id}`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `DELETE` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}` |

Удаляет доступ и его ключи, сохраняя пользователя и записи его устройств.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
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


<a id="ru-endpoint-39"></a>

#### Задать или снять лимит трафика доступа

##### `PUT /api/admin/subscriptions/{id}/traffic-limit`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/traffic-limit` |

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| traffic_limit_bytes | integer (int64) or null | Да | Положительный общий лимит входящего и исходящего трафика в байтах; null — без лимита. |

```json
{
  "traffic_limit_bytes": 10737418240
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
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


<a id="ru-endpoint-40"></a>

#### Сбросить учтённый трафик доступа

##### `POST /api/admin/subscriptions/{id}/reset-traffic`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `POST` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/reset-traffic` |

Обнуляет использованный трафик; установленный лимит сохраняется.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса:** отсутствует.

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
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


<a id="ru-endpoint-41"></a>

#### Настроить автоматический сброс трафика доступа

##### `PUT /api/admin/subscriptions/{id}/traffic-reset-schedule`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/subscriptions/{id}/traffic-reset-schedule` |

Следующий сброс: текущее время + days × 24 часа. null отключает автоматический сброс.

**URL-параметры**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| id | string (UUID) | Да | UUID ресурса из адреса запроса. |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| days | integer or null | Да | Интервал сброса: 1–366 дней; null отключает расписание. |

```json
{
  "days": 30
}
```

**Успешный ответ: 204**

Тело ответа отсутствует.

```http
HTTP/1.1 204 No Content
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 204 | Успешно. Тело отсутствует. |
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


<a id="ru-endpoint-42"></a>

#### Получить статистику трафика по дням

##### `GET /api/admin/traffic`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/traffic` |

Даты UTC по возрастанию. Возвращаются только дни с данными; без трафика — []. Направления received/sent указаны с точки зрения ноды.

**Query-параметры**

| Параметр | Формат | Обязательно | По умолчанию | Назначение |
| --- | --- | --- | --- | --- |
| `days` | integer | Нет | `30` | 1–366. |
| `node_id` | string (UUID) | Нет | — | Необязательный фильтр по ноде. |
| `user_id` | string (UUID or Telegram ID) | Нет | — | Необязательный фильтр пользователя; нельзя одновременно с telegram_id. |
| `telegram_id` | string (positive int64) | Нет | — | Альтернативный фильтр по положительному Telegram ID; нельзя одновременно с user_id. |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| $ | array of object | Список объектов; без записей — []. |
| [].day | string (YYYY-MM-DD) | Дата учёта трафика в UTC. |
| [].received_bytes | integer (int64) | Байты, полученные нодой от клиентов. |
| [].sent_bytes | integer (int64) | Байты, отправленные нодой клиентам. |

```json
[
  {
    "day": "2030-01-01",
    "received_bytes": 1024,
    "sent_bytes": 2048
  }
]
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 404 | Ресурс или пользователь не найден; устройство/доступ не принадлежит этому пользователю. |
| 409 | Конфликт состояния, дубликат, достигнутый лимит либо неоднозначный Telegram ID; причина в error. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```


<a id="ru-endpoint-43"></a>

#### Получить лимит устройств по умолчанию для новых пользователей

##### `GET /api/admin/settings/devices`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `GET` |
| URL | `https://panel.example.com/api/admin/settings/devices` |

**Тело запроса:** отсутствует.

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| default_device_limit | integer or null | Значение для новых пользователей: 1–10000 или null без ограничения. Существующие пользователи не меняются. |

```json
{
  "default_device_limit": 3
}
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


<a id="ru-endpoint-44"></a>

#### Изменить лимит устройств по умолчанию для новых пользователей

##### `PUT /api/admin/settings/devices`

**URL запроса**

| Параметр | Значение |
| --- | --- |
| Метод | `PUT` |
| URL | `https://panel.example.com/api/admin/settings/devices` |

**Тело запроса**

| Поле | Формат | Обязательно | Назначение |
| --- | --- | --- | --- |
| default_device_limit | integer or null | Да | Значение для новых пользователей: 1–10000 или null без ограничения. Существующие пользователи не меняются. |

```json
{
  "default_device_limit": 3
}
```

**Успешный ответ: 200**

| Поле | Формат | Назначение |
| --- | --- | --- |
| default_device_limit | integer or null | Значение для новых пользователей: 1–10000 или null без ограничения. Существующие пользователи не меняются. |

```json
{
  "default_device_limit": 3
}
```

**Возможные статусы ответа**

| Статус | Значение |
| --- | --- |
| 200 | Успешно; формат ответа показан выше. |
| 400 | Неверные параметры пути, запроса или JSON; неверный формат либо обязательное поле отсутствует. |
| 401 | API-ключ отсутствует, неверен, не зарегистрирован или удалён. |
| 500 | Внутренняя ошибка backend; подробности находятся в серверных логах. |
| 503 | Временная недоступность операции, таймаут/конфликт блокировок БД либо остановка backend. |

Пример тела ошибки (400):

```json
{
  "error": "invalid JSON"
}
```
