# Nodes

Connect a VPS and let the backend install the node over SSH.

## Prepare the server

- Ubuntu or Debian, root access or a user with sudo privileges.
- `/dev/net/tun` available on the VPS.
- Outbound HTTPS access to GitHub and your panel's `PUBLIC_URL`.
- Inbound UDP on the chosen VPN port, `1234` by default for new nodes.

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

## Connected users

Each node card shows **Connected users**. The API returns the same value as `online_user_count` in node responses.

A user is counted once per node, even when several devices or access records are connected. The estimate requires a node handshake report newer than one minute and a VPN handshake newer than three minutes. Disabled users, expired or disabled access, exhausted traffic limits, and paused or unsynchronized nodes are excluded. If reports stop arriving, the count becomes zero after the freshness window.

## Mobile networks and location

New profiles use MTU 1280 to reduce fragmentation on mobile paths. Reimport a profile to apply the new MTU. New nodes default to UDP port 1234; existing nodes keep their installed port. Make sure the node's UDP port is open in both the VPS firewall and the hosting provider's firewall.

If a node is unreachable only on mobile data, test the same profile on Wi-Fi and check whether the VPS IP is reachable from that carrier. Amnezia's [self-hosted troubleshooting guide](https://docs.amnezia.org/troubleshooting/self-hosted-amneziawg-not-working/) explains that some carriers block the server IP or the protocol signature; changing MTU or port cannot repair an IP block. Try a different VPS IP or provider if the IP itself is blocked.

If a service shows Russia while connected, disable split tunneling and compare the VPN's public IP with the node's IP. Services may use outdated IP geolocation data. See [Amnezia's location guide](https://docs.amnezia.org/documentation/instructions/choose-location/). This project currently routes IPv4 traffic; it does not claim IPv6 tunnel support.
