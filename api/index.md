# API reference

Connect your billing system, Telegram bot or other external service to dementia. The reference contains **43 endpoints** available to service API keys.

## Authentication

Create a named API key in the admin panel and save it when issued. Send it with every request:

```http
Authorization: Bearer dementia_api_YOUR_KEY
```

Keys do not expire. Deleting one immediately revokes API access. Administrator login endpoints, integration settings and node-agent routes use separate authentication and are not included here.

## First request

| Parameter | Value |
| --- | --- |
| Method | GET |
| URL | `https://panel.example.com/api/admin/users` |
| Authorization | `Bearer dementia_api_YOUR_KEY` |
| Query | `page=1&per_page=25` |

```sh
curl --fail-with-body 'https://panel.example.com/api/admin/users?page=1&per_page=25' \
  -H 'Authorization: Bearer dementia_api_YOUR_KEY'
```

## Explore endpoints

| Section | Operations |
| --- | --- |
| [Users](./users) | Pagination, creation, updates, removal and bulk access changes. |
| [Devices](./devices) | Named devices, limits, subscription URLs and connection keys. |
| [Nodes](./nodes) | SSH provisioning, connection checks, restart and removal. |
| [Subscription plans](./plans) | Reusable server lists and per-user plan assignment. |
| [Issued access](./access) | Access state, expiry, traffic limits and credential revocation. |
| [Traffic](./traffic) | Daily traffic statistics with user and node filters. |
| [Device settings](./settings) | Default device limit for new users. |

## Request conventions

Use `Content-Type: application/json` for request bodies. Unknown fields are rejected and the default body limit is 64 KiB. UUIDs use lowercase hexadecimal with hyphens; timestamps use RFC3339. Byte counters are int64: preserve integer precision in clients.

User routes accept UUIDs or positive Telegram IDs. Other path identifiers are UUIDs. `POST` creation endpoints accept a **single object**. Creating a device preserves existing devices and their credentials.

## Error responses

```json
{
  "error": "resource not found"
}
```

Each endpoint lists its possible status codes. `204` means there is no body. `202` means a background operation was accepted; poll the resource for its outcome. The response `X-Request-ID` correlates a request with server logs.
