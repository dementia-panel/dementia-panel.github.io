## 1. Установите Docker

Подключите официальный APT-репозиторий Docker для своей ОС. Если Docker Engine и Compose уже установлены, переходите к шагу 2.

```sh
sudo apt update
```

```sh
sudo apt install ca-certificates curl
```

```sh
sudo install -m 0755 -d /etc/apt/keyrings
```

Скачайте ключ подписи для своей ОС:

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

Добавьте репозиторий для своей ОС:

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

[Docker Engine для Ubuntu](https://docs.docker.com/engine/install/ubuntu/) · [Docker Engine для Debian](https://docs.docker.com/engine/install/debian/)
