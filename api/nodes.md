---
title: Nodes
description: Parameters, request examples and response shapes for service API integrations.
outline: [2, 2]
---

# Nodes

Parameters, request examples and response shapes for service API integrations.

## List active node records

<Endpoint method="GET" path="/api/admin/nodes" />

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



## Get node metrics

<Endpoint method="GET" path="/api/admin/nodes/metrics" />

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


## Get node

<Endpoint method="GET" path="/api/admin/nodes/{id}" />

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



## Add node

<Endpoint method="POST" path="/api/admin/nodes" />

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



## Update node

<Endpoint method="PATCH" path="/api/admin/nodes/{id}" />

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



## Set or reset a node’s public VPN endpoint

<Endpoint method="PUT" path="/api/admin/nodes/{id}/endpoint" />

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



## Check whether node sends a fresh report

<Endpoint method="POST" path="/api/admin/nodes/{id}/actions/check" />

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



## Request restart of node

<Endpoint method="POST" path="/api/admin/nodes/{id}/actions/restart" />

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



## Request restart of all ready nodes

<Endpoint method="POST" path="/api/admin/nodes/actions/restart-all" />

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



## Delete node

<Endpoint method="DELETE" path="/api/admin/nodes/{id}" />

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
