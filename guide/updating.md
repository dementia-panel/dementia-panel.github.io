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
