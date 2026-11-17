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
