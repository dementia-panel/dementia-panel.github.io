---
title: HTTPS & certificates
---

# HTTPS & certificates

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



## 9. Renew HTTPS

To request renewal when the certificate is due, run:

```sh
sudo certbot renew --cert-name panel.example.com
```

After renewal, repeat the two `install` commands from the section above and reload Nginx. The panel uses the copies in `tls/`.

```sh
sudo docker compose exec -T frontend nginx -s reload
```
