# Users & devices

## Subscription plans

Create a plan from the servers that should be available together. A plan contains servers; access state and expiry belong to the user's issued access.

## Users

Create a user with a username and optional Telegram ID. Assign a subscription plan in the user card, enable or pause access, and choose an expiry date or leave access unlimited.

User API routes accept either the UUID or a positive Telegram ID. A Telegram ID must identify exactly one user.

## Devices

Add named devices in the user card. Each device receives independent credentials on the assigned servers and its own subscription URL. Adding one device does not replace the others.

| Setting | Behavior |
| --- | --- |
| Default device limit | Inherited by newly created users. |
| Per-user limit | Overrides the user's limit; null means unlimited. |
| Lowering a limit | Keeps existing devices and prevents further issuance above the limit. |
| Renaming a device | Preserves its keys. |
| Deleting a device | Removes its link and keys; revocation applies after node synchronization. |

Device counts track **issued key sets**, not unique physical hardware. Importing the same profile on another phone does not create a new record.

## Connection profiles

Each server has its own `.conf`, `.vpn`, `vpn://` key and application-specific QR code. A WireGuard `.conf` is not a multi-server subscription. The subscription page helps the user choose the server and application.

## API operations

- [Create and update users](/api/users)
- [Issue and revoke device credentials](/api/devices)
- [Manage subscription access](/api/access)

## Set a user UUID through the API

`POST /api/admin/users` accepts an optional `id` containing the user's UUID. Omitting it or passing `null` generates a UUID automatically. An existing UUID returns `409` and never replaces the existing user. This works both with and without `plan_id`.

[Create user API →](/api/users#create-user)

## Expiration date and time

Choose a plan when creating a user and clear **No expiration** to set an exact date and time. The user and subscription expiration are saved together. You can change the same setting from the user card. Dates are entered in your browser’s time zone and sent to the API as RFC3339 timestamps. The subscription page also displays the expiration time.

## Sort and filter users

The user list shows the newest accounts first. Choose **Oldest first**, **By username**, or **Last connected** in the sorting menu. Sorting works together with username/Telegram ID search, status filters and pagination. The current query is stored in the URL and survives a page reload.
