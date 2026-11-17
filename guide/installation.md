---
title: Installation
---

# Installation

Deploy the backend, database and web panel on your own server.

::: info Before you begin
You need an Ubuntu or Debian server, a domain pointing to it, and inbound TCP ports 80 and 443.
:::

## 1. Install Docker

Set up Docker's official APT repository for your server distribution. If Docker Engine and the Compose plugin are already installed, continue to step 2.

```sh
sudo apt update
```

```sh
sudo apt install ca-certificates curl
```

```sh
sudo install -m 0755 -d /etc/apt/keyrings
```

Download the signing key for your distribution:

::: code-group
```sh [Ubuntu]
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
```
```sh [Debian]
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
```
:::

```sh
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Add the repository for your distribution:

::: code-group
```sh [Ubuntu]
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```
```sh [Debian]
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```
:::

```sh
sudo apt update
```

```sh
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```sh
sudo systemctl enable --now docker
```

```sh
sudo docker compose version
```

[Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/) · [Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)


## 2. Download the deployment files

Create and enter the deployment directory. The same Compose file starts the backend and the panel. You will need curl, OpenSSL, and a domain pointing to this server.

```sh
mkdir -p dementia
```

```sh
cd dementia
```

```sh
curl -fsSLO https://raw.githubusercontent.com/dementia-panel/backend/main/deploy/compose.yaml
```

```sh
curl -fsSL https://raw.githubusercontent.com/dementia-panel/backend/main/deploy/.env.example -o .env
```



## 3. Configure the environment

Fill in `.env` and generate the keys using the [configuration guide](/guide/environment).



## 4. Start the backend

Compose pulls the `latest` backend image and starts PostgreSQL and Valkey as dependencies. The backend applies database migrations on startup.

```sh
sudo docker compose up -d --pull always --wait backend
```



## 5. Issue and install the HTTPS certificate

Point your domain to the server. Allow inbound TCP traffic on port 80 for Let’s Encrypt validation and port 443 for the panel. Port 80 must be free when Certbot runs. Replace `panel.example.com` in the commands with the hostname from `PUBLIC_URL`. [Certbot standalone mode](https://eff-certbot.readthedocs.io/en/stable/using.html#standalone)

Install Certbot on Ubuntu or Debian and request a certificate. Enter your email and follow Certbot's prompts.

```sh
sudo apt install certbot
```

```sh
sudo certbot certonly --standalone --cert-name panel.example.com -d panel.example.com
```

Copy the certificate chain and private key into the directory mounted by Compose. Keep the destination filenames because the panel image expects them.

```sh
mkdir -p tls
```

```sh
sudo install -m 0644 /etc/letsencrypt/live/panel.example.com/fullchain.pem tls/dementia.crt
```

```sh
sudo install -m 0600 /etc/letsencrypt/live/panel.example.com/privkey.pem tls/dementia.key
```



## 6. Start the panel

Compose pulls the `latest` panel image.

```sh
sudo docker compose up -d --pull always --wait frontend
```



## 7. Create the administrator

Open the HTTPS address set in `PUBLIC_URL`. On a fresh database, choose a username and set or generate a password in the first-run form.
