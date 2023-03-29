# Maintain high node uptime

## Description

Ensure your Data Availability node has a high up-time for the duration of
the incentivized testnet program.

We will be measuring your node's uptime using a formula that measures
how many sampling requests were submitted upon a certain period of time.

## Directions

1. Ensure your node does not go offline for long periods of time
  otherwise it impacts your uptime score.
2. You can monitor your node uptime by searching for your node id [here](https://tiascan.com).

## Judging criteria

1. Points are awarded based on the following [formula](https://www.wolframalpha.com/input?i=y%3D1.05%5Ex%2F1.05%5E100+from+0+to+100).
  Base for Full Storage and Bridge nodes is 1.05 and 100% uptime, base
  for Light nodes is 1.02 and 80% uptime.
2. `node_uptime = minimum(total_block_sampled_or_synced/network_head, total_node_uptime_in_seconds/(current_time-node_Start_time))`
3. Maximum score for light node uptime at the end of phase 5 is 25 points.
4. Maximum score for bridge node uptime at the end of phase 5 is 110 points.
5. Maximum score for full storage node uptime at the end of phase 5 is 80 points.

## Submission

Please submit your Node ID.

Submission link can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

 `12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`
