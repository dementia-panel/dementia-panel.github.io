---
title: Troubleshooting
---

# Troubleshooting

## 10. Fix a PostgreSQL password mismatch

If startup reports `could not connect to PostgreSQL` or the database is unhealthy, check its logs:

```sh
sudo docker compose logs --tail=30 db
```

If the logs show `password authentication failed`, restore the original `POSTGRES_PASSWORD` in `.env`. PostgreSQL reads that variable only when initializing an empty volume. If you need to keep the new password, change the role's password in PostgreSQL using the prompt below. Replace both instances of `backend` if you used a different PostgreSQL role. Enter the value from `.env` twice.

```sh
sudo docker compose exec db psql -U backend -d postgres -c '\password backend'
```

Apply the settings from the deployment directory. Keep the existing database volume.

```sh
sudo docker compose up -d --pull always --wait backend
```



## Container status

```sh
sudo docker compose ps
```

## Backend logs

```sh
sudo docker compose logs --tail=100 backend
```

## Node installation errors

Check the installation stage and error in the node card. On the VPS, the installation log is `/var/log/dementia-install.log`.

```sh
sudo tail -n 100 /var/log/dementia-install.log
```
