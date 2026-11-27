# Updating

Run these commands from the deployment directory containing your `.env` and `compose.yaml`.

## Before updating

Keep the existing database volume, `POSTGRES_PASSWORD`, `JWT_SIGNING_KEY` and `ENCRYPTION_KEY`. Back up PostgreSQL and `.env` before applying migrations. Do not delete volumes as part of an update.

## Download images

```sh
sudo docker compose pull
```

## Update the backend first

The backend applies migrations on startup.

```sh
sudo docker compose up -d --wait backend
```

## Update the panel

```sh
sudo docker compose up -d --wait frontend
```

## Check the result

```sh
sudo docker compose ps
```

```sh
sudo docker compose logs --tail=50 backend
```

The deployment configuration uses `latest`. [Review release notes](https://github.com/dementia-panel/backend/releases) before updating.

## Existing nodes

Nodes installed before v0.7.1 need one SSH upgrade. In the admin panel, open **Nodes**, choose **Update node**, and enter the VPS SSH credentials. The panel does not retain the password. The upgrade keeps the node's VPN keys and server configuration and installs a host timer that checks the official node release every 12 hours. The node card shows the reported version after the agent reconnects.

Re-download a client profile to receive the new per-node junk-packet settings. Imported profiles are not changed remotely and continue to use their previous settings until re-imported.
