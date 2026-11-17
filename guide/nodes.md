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
