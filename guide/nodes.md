# Nodes

Connect a VPS and let the backend install the node over SSH.

## Prepare the server

- Ubuntu or Debian, root access or a user with sudo privileges.
- `/dev/net/tun` available on the VPS.
- Outbound HTTPS access to GitHub and your panel's `PUBLIC_URL`.
- Inbound UDP on the chosen VPN port, `51820` by default.

## Add a node

Open **Nodes → Connect node**. Enter a name, the VPS IP address, SSH port, SSH username and password. The name is applied to the node during provisioning.

The installer checks the OS, installs Docker and deploys AmneziaWG. Installation can take up to 15 minutes. Progress and errors appear in the node card.

## Check and manage

| Action | Result |
| --- | --- |
| Rename | Updates the node's display name. |
| Pause | Disables VPN access after node synchronization. |
| Check connection | Waits for a fresh agent report; it is not ICMP ping. |
| Restart | Queues a restart, applied by the agent. |
| Remove from panel | Removes records and assignments without connecting over SSH. |
| Remove and clean VPS | Connects over SSH, stops containers and cleans installed node files. |

## Retry a failed installation

Read the error in the node card. If you rebuilt the VPS and its SSH key changed, explicitly allow a new SSH host key when retrying. The default does not silently replace a known key.

For installer logs, see [Troubleshooting](./troubleshooting).

## Automate provisioning

[Node API reference →](/api/nodes)

## Connected devices

Each node card shows **Connected devices**. The API returns the same value as `online_device_count` in node responses.

A device is counted once per node, even when several access records contain its keys. The estimate requires a node handshake report newer than one minute and a VPN handshake newer than three minutes. Disabled users, expired or disabled access, exhausted traffic limits, and paused or unsynchronized nodes are excluded. If reports stop arriving, the count becomes zero after the freshness window.
