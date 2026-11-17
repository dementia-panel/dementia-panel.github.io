# Introduction

dementia is a self-hosted panel for managing AmneziaWG VPN infrastructure. It brings server provisioning, user access, device credentials and subscriptions into one workspace.

## How the components fit together

| Component | Responsibility |
| --- | --- |
| Backend | Stores configuration, manages access, exposes the API and provisions nodes over SSH. |
| Web panel | The administrator interface served over HTTPS. |
| PostgreSQL | Persistent users, subscriptions, keys and settings. |
| Valkey | Redis-compatible storage used for authentication rate limiting. |
| Node | Runs AmneziaWG and synchronizes its state with the backend. |

## Deployment order

Start the **backend first**, including PostgreSQL and Valkey. Install your HTTPS certificate, then start the **web panel**. Both are included in the deployment Compose file.

[Follow the installation guide →](./installation)

## Manage access

A **subscription plan** is a reusable list of servers. Assign a plan to a user, then control that user's expiry date and access state.

Each **device** gets its own credentials on the assigned servers and a separate subscription link. Adding a device preserves the existing ones.

[Read about users and devices →](./users)

## Build an integration

External services authenticate with a named, revocable API key. The reference includes only routes available to those keys, with request/response examples and field descriptions.

[Open the API reference →](/api/)
