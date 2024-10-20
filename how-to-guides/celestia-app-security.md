---
description: Learn how to generate a vesting account using celestia-app.
---

# Security for Celestia App 
## Overview
As Celestia continues to grow, an increasing number of validators will be running nodes on baremetal servers. These servers often lack built-in DDoS and firewall protection. To address this, we can integrate FireHOL to add an additional layer of security, ensuring that our nodes remain safe from common threats, such as unauthorized access and DDoS attacks. This guide focuses on setting up FireHOL for traffic filtering, rate limiting, and IP blacklisting to bolster security for your Celestia node.

## Motivation
Validators in Celestia often rely on cloud or baremetal servers for their infrastructure. While some providers offer basic protection, most setups lack advanced firewall solutions such as DDoS mitigation. This makes it critical to implement your own measures. By using FireHOL, we introduce a flexible and lightweight firewall that supports advanced features like rate limiting and dynamic IP blacklisting. This solution ensures that your node can handle increasing traffic while protecting it from malicious actors.

### Key features we’ll leverage include:

1. Traffic filtering and rate limiting to mitigate potential DDoS attacks.
2. Dynamic IP blocking using blacklists like DShield and Emerging Threats to automatically block known malicious IPs.
3. Flexible firewall rules that allow only necessary traffic for Celestia node operations.

### Step 1: Install FireHOL
First, ensure FireHOL is installed on your server. You can install it using the following commands:
```
sudo apt update
sudo apt install firehol 
```
Check that FireHOL is installed and working by running:

  ```
sudo firehol version
```

## Step 2: Configure FireHOL for Celestia Node
Create or modify your FireHOL configuration file, typically located at ```/etc/firehol/firehol.conf```. The following configuration allows P2P, RPC, and gRPC traffic, while applying security measures such as rate limiting and IP blacklisting.

FireHOL Configuration

```
version 6

# Define your external network interface (replace eth0 with actual interface name)
interface eth0 internet
   protection strong

   # Allow P2P traffic on port 26656 (TCP only)
   server p2p tcp/26656 accept

   # Allow RPC traffic on port 26657 (TCP) from any source
   server rpc accept src any dport 26657
   server rpc rate-limit 20/second burst 50 src

   # Allow Prometheus metrics on port 26660 (limit to trusted IPs or internal network)
   server prometheus accept src 192.168.1.0/24 dport 26660

   # Allow gRPC communication on ports 9090 and 9091 (TCP)
   server grpc accept src any dport 9090
   server grpc accept src any dport 9091

   # Allow REST API access on port 1317 (TCP)
   server rest accept src any dport 1317

   # Allow UDP traffic on port 123 for NTP (clock synchronization)
   server ntp udp/123 accept

   # Block IPs from DShield and Emerging Threats (ensure /etc/firehol/blocked.ips is up-to-date)
   blacklist full /etc/firehol/blocked.ips

   # Log dropped connections
   log iptables drop

   # General protection rules for DoS attempts and port scanning
   server all drop rate-limit 50/sec burst 100

   # Allow localhost traffic
   server all accept src 127.0.0.1

   # Allow internal network traffic (optional)
   server all accept src 192.168.1.0/24

# Block all IPv6 traffic
interface eth0 ipv6
   server all drop
```
::: tip
Currently bind to eth0, make sure you bind it to the correct interface or bind all
```interface any world```
:::
####  Key Configuration Details
- P2P (26656): Allows inbound P2P traffic, essential for Celestia node synchronization.
- RPC (26657): Open to external sources with rate limiting to prevent abuse.
- Prometheus (26660): Restricted to internal networks or trusted IPs for security.
- gRPC (9090, 9091): Opened for gRPC communication.
- REST API (1317): Opened for API access.
- Blocked IPs: Dynamic IP blocking is applied using blacklists like DShield and 
- Emerging Threats.

###  Step 3: Set Up Cron to Automatically Update Blocked IPs
To maintain an updated list of blocked IPs, set up a cron job to fetch the latest blacklists every hour. Here’s how you can configure it.

#### Step 3.1: Create a Script to Update the Blocked IPs
Create a script in /usr/local/bin/update-blocked-ips.sh to download and update the IP blacklist.

```
#!/bin/bash

# Fetch the latest IPs from DShield
curl -s https://www.dshield.org/block.txt | awk '{print $1}' > /etc/firehol/blocked.ips

# Fetch additional IPs from Emerging Threats
curl -s https://rules.emergingthreats.net/blockrules/emerging-Block-IPs.txt >> /etc/firehol/blocked.ips

# Reload FireHOL to apply the new blocked IPs
firehol reload
```
Make the script executable:
```
sudo chmod +x /usr/local/bin/update-blocked-ips.sh
```

#### Step 3.2: Set Up the Cron Job
To run this script automatically every hour, add the following line to your cron configuration:

```
sudo crontab -e
```
Then, add this line at the end:
```
0 * * * * /usr/local/bin/update-blocked-ips.sh
```
This cron job will run every hour, update the blocked IPs, and reload FireHOL with the new list.

### Step 4: Apply and Test FireHOL Configuration
After editing the FireHOL configuration and setting up the cron job, restart the service to apply the new rules:
```
sudo firehol start
```
Verify that the rules are applied correctly by listing the current active firewall rules:
```
sudo iptables -L
```
Test specific port access using netcat:
```
nc -zv 127.0.0.1 26657  # Test RPC port
nc -zv 127.0.0.1 26656  # Test P2P port
```
Check the logs to monitor any dropped connections:

```
tail -f /var/log/kern.log
```


::: tip
Regularly monitor your firewall logs to detect any unusual traffic patterns.
Adjust the rate limits based on your node’s traffic load.
Keep the blacklist sources updated for optimal protection.
:::