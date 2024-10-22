---
description: Security Guide for Celestia Nodes
---

# Security for Celestia App
Validators in Celestia often rely on cloud or baremetal servers for their infrastructure. While some providers offer basic protection, most setups lack advanced firewall solutions such as DDoS mitigation. This makes it critical to implement your own measures. By using [FireHOL](https://github.com/firehol/firehol), we introduce a flexible and lightweight firewall that supports advanced features like rate limiting and dynamic IP blacklisting. This solution ensures that your node can handle increasing traffic while protecting it from malicious actors.
  

### Key features we’ll leverage include:

  

1. Traffic filtering and rate limiting to mitigate potential DDoS attacks.

2. Dynamic IP blocking using blacklists like [Firehol Level 4](https://iplists.firehol.org/?ipset=firehol_level4) and [Emerging Threats](https://iplists.firehol.org/?ipset=et_block) to automatically block known malicious IPs.

3. Flexible firewall rules that allow only necessary traffic for Celestia node operations.

  

### Install FireHOL

First, ensure FireHOL is installed on your server. You can install it using the following commands:

```sh
sudo apt update
sudo apt install firehol
```

  
Check that FireHOL is installed and working by running:

```sh
sudo firehol version
```

  

## Configure FireHOL for Celestia Node

Create or modify your FireHOL configuration file, typically located at ```/etc/firehol/firehol.conf```. The following configuration allows P2P, RPC, and gRPC traffic, while applying security measures such as rate limiting and IP blacklisting.

  

FireHOL Configuration

  

```sh
version 6

# Define ipsets for blocked IPs and networks from Emerging Threats and Firehole Level4
ipv4 ipset create blocked_ips hash:ip
ipv4 ipset addfile blocked_ips /etc/firehol/blocked.ips

ipv4 ipset create blocked_nets hash:net
ipv4 ipset addfile blocked_nets /etc/firehol/blocked.nets

# Block IPs and Networks from Firehole Level4 and Emerging Threats
ipv4 blacklist full ipset:blocked_ips ipset:blocked_nets

# Define your external network interface
interface4 enp5s0 internet
    protection strong

    # Allow SSH traffic on port 22 (TCP) for public access
    server ssh accept

    # Allow P2P traffic on port 26656 (TCP) with DDoS protection
    server custom p2p tcp/26656 default accept
    protection syn-floods 20/sec 50  # Protect against SYN flood attacks

    # Allow RPC traffic on port 26657-26659 (TCP) with DDoS protection
    server custom rpc tcp/26657:26659 default accept
    protection syn-floods 20/sec 50  # Protect against SYN flood attacks

    # Allow Prometheus metrics on port 26660 (limit to trusted IPs or internal network) with DDoS protection
    server custom prometheus tcp/26660 default accept src 192.168.1.0/24
    protection syn-floods 10/sec 20  # Protect against SYN flood attacks

    # Allow gRPC communication on port 9090 (TCP) with DDoS protection
    server custom grpc tcp/9090 default accept
    protection syn-floods 15/sec 30  # Protect against SYN flood attacks

    # Allow gRPC communication on port 9091 (TCP) with DDoS protection
    server custom grpc2 tcp/9091 default accept
    protection syn-floods 15/sec 30  # Protect against SYN flood attacks

    # Allow REST API access on port 1317 (TCP) with DDoS protection
    server custom rest tcp/1317 default accept
    protection syn-floods 20/sec 40  # Protect against SYN flood attacks

    # Additional Ports
    server custom 11656 tcp/11656 default accept
    server custom 11656 udp/11656 default accept
    server custom 11065 tcp/11065 default accept
    server custom 11065 udp/11065 default accept
    server custom 36656 tcp/36656 default accept
    server custom 36656 udp/36656 default accept
    server custom 6065 tcp/6065 default accept
    server custom 6065 udp/6065 default accept
    server custom 9099 tcp/9099 default accept
    server custom 9099 udp/9099 default accept

    # Allow traffic on port 2121 for both TCP and UDP (separate rules for TCP and UDP)
    server custom 2121 tcp/2121 default accept
    protection syn-floods 20/sec 40  # Protect against SYN flood attacks
    server custom 2121 udp/2121 default accept
    protection syn-floods 20/sec 40  # Protect against SYN flood attacks

    # Allow all traffic from localhost without specifying ports
    server all accept src 127.0.0.1

    # Allow all traffic from internal network without specifying ports
    server all accept src 192.168.1.0/24

    # Allow outgoing traffic for general internet access
    client all accept

# Block all IPv6 traffic
interface4 enp5s0 ipv6
    server all drop
```

::: tip

Currently bind to eth0, make sure you bind it to the correct interface or bind all

```interface any world```

:::

### Key Configuration Details

- P2P (26656): Allows inbound P2P traffic, essential for Celestia node synchronization.

- RPC (26657): Open to external sources with rate limiting to prevent abuse.

- Prometheus (26660): Restricted to internal networks or trusted IPs for security.

- gRPC (9090, 9091): Opened for gRPC communication.

- REST API (1317): Opened for API access.

- Blocked IPs: Dynamic IP blocking is applied using blacklists like Firehole Level4 and

- Emerging Threats.

  

## Set Up Cron to Automatically Update Blocked IPs

To maintain an updated list of blocked IPs, set up a cron job to fetch the latest blacklists every hour. Here’s how you can configure it.

  

### Create a Script to Update the Blocked IPs

Create a script in ```/usr/local/bin/update-blocked-ips.sh``` to download and update the IP blacklist.

  

```sh
#!/bin/bash

# Temporary files for downloading the blocklists
tmp_emerging=$(mktemp) || exit 1
tmp_firehol=$(mktemp) || exit 1
tmp_nets=$(mktemp) || exit 1

# Download the block lists from Emerging Threats and FireHOL Level 4
wget -O $tmp_emerging "http://rules.emergingthreats.net/fwrules/emerging-Block-IPs.txt"
if [ $? -ne 0 -o ! -s $tmp_emerging ]; then
    rm $tmp_emerging
    exit 1
fi

wget -O $tmp_firehol "https://iplists.firehol.org/files/firehol_level4.netset"
if [ $? -ne 0 -o ! -s $tmp_firehol ]; then
    rm $tmp_firehol
    exit 1
fi

# Preprocess the blocklists: Extract only network entries (lines with '/')
grep '/' $tmp_emerging > $tmp_nets
cat $tmp_firehol >> $tmp_nets

# Update the IPSet collections using FireHOL
firehol ipset_update_from_file blocked_nets nets $tmp_nets

# Clean up temporary files
rm $tmp_emerging $tmp_firehol $tmp_nets

```

::: tip
You can add more IP list from the db, not adding more list will create more overhead: [Cyber Crime IP DB](https://iplists.firehol.org/)
::: 

Make the script executable:

```sh
sudo chmod +x /usr/local/bin/update-blocked-ips.sh
```

  

### Set Up the Cron Job

To run this script automatically every hour, add the following line to your cron configuration:

  
```sh
sudo crontab -e
```

Then, add this line at the end:

```sh
0 * * * * /usr/local/bin/update-blocked-ips.sh
```

This cron job will run every hour, update the blocked IPs, and reload FireHOL with the new list.

  

## Apply and Test FireHOL Configuration
Ensure FireHOL is enabled to start at boot by editing its default configuration:

```sh
sudo nano /etc/default/firehol
```

Change the ```START_FIREHOL``` to YES

```sh
START_FIREHOL=YES
```

Create your blocked IPs and Net files

```sh
sudo sh -c 'echo "# This is the blocked IPs file\n" > /etc/firehol/blocked.ips && echo "# This is the blocked networks file\n" > /etc/firehol/blocked.nets'
```

Start the service to apply the new rules:

```sh
sudo firehol start
```

Verify that the rules are applied correctly by listing the current active firewall rules:

```sh
sudo iptables -L
```

Test specific port access using netcat:

```sh
nc -zv <your_server_ip> 26657 # Test RPC port
nc -zv <your_server_ip> 26656 # Test P2P port
```

Check the logs to monitor any dropped connections:

```sh
tail -f /var/log/kern.log
```

  
  

::: tip

Regularly monitor your firewall logs to detect any unusual traffic patterns.

Adjust the rate limits based on your node’s traffic load.

Keep the blacklist sources updated for optimal protection.

:::