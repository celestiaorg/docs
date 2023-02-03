---
sidebar_label: Celestia Node Gateway
---

# API Playground

There is a preview to the `celestia-node` API playground available at [https://node-rpc-docs.vercel.app/](https://node-rpc-docs.vercel.app/).

## `DASER` Module (with toggles)
<!-- markdownlint-disable MD013 -->
````mdx-code-block
<details>
  <summary><code>SamplingStats()</code> <code class="blue-code">das.SamplingStats</code> <text class="purple-text">(perms: read)</text></summary>
  <div>
    <div>SamplingStats returns the current statistics over the DA sampling process.
</div>
    <br/>
    <details>
      <summary>
        Example request
      </summary>
      <div>
        <code>
          {`{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "daser.SamplingStats",
  "params": []
}`}
        </code>
      </div>
    </details>
    <details>
      <summary>
        Example Response
      </summary>
      <div>
        <code>
          {`{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "head_of_sampled_chain": 27499,
      "head_of_catchup": 29101,
      "network_head_height": 30483,
      "workers": [
        {
          "current": 28806,
          "from": 28802,
          "to": 28901
        },
        {
          "current": 28906,
          "from": 28902,
          "to": 29001
        },
        {
          "current": 27794,
          "from": 27702,
          "to": 27801
        },
        {
          "current": 28191,
          "from": 28102,
          "to": 28201
        },
        {
          "current": 28420,
          "from": 28402,
          "to": 28501
        },
        {
          "current": 28334,
          "from": 28302,
          "to": 28401
        },
        {
          "current": 27691,
          "from": 27602,
          "to": 27701
        },
        {
          "current": 27889,
          "from": 27802,
          "to": 27901
        },
        {
          "current": 27990,
          "from": 27902,
          "to": 28001
        },
        {
          "current": 28293,
          "from": 28202,
          "to": 28301
        },
        {
          "current": 28092,
          "from": 28002,
          "to": 28101
        },
        {
          "current": 29004,
          "from": 29002,
          "to": 29101
        },
        {
          "current": 28708,
          "from": 28702,
          "to": 28801
        },
        {
          "current": 28513,
          "from": 28502,
          "to": 28601
        },
        {
          "current": 27500,
          "from": 27402,
          "to": 27501
        },
        {
          "current": 28615,
          "from": 28602,
          "to": 28701
        }
      ],
      "concurrency": 16,
      "catch_up_done": false,
      "is_running": true
    }
  ]
}`}
        </code>
      </div>
    </details>
  </div>
</details>
````

````mdx-code-block
<details>
  <summary><code>WaitCatchUp()</code> <text class="purple-text">(perms: read)</text></summary>
  <div>
    <div>WaitCatchUp blocks until DASer finishes catching up to the network head.
</div>
    <br/>
    <details>
      <summary>
        Example request
      </summary>
      <div>
        <code>
          {`{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "daser.WaitCatchUp",
  "params": []
}`}
        </code>
      </div>
    </details>
    <details>
      <summary>
        Example Response
      </summary>
      <div>
        <code>
          {`{
  "id": 1,
  "jsonrpc": "2.0",
  "result": []
}`}
        </code>
      </div>
    </details>
  </div>
</details>
````

## `DASER` Module

### `SamplingStats()` `das.SamplingStats` **(perms: read)**

SamplingStats returns the current statistics over the DA sampling process.

#### `SamplingStats()` example request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "daser.SamplingStats",
  "params": []
}
```

#### `SamplingStats()` example response

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "head_of_sampled_chain": 27499,
      "head_of_catchup": 29101,
      "network_head_height": 30483,
      "workers": [
        {
          "current": 28806,
          "from": 28802,
          "to": 28901
        },
        {
          "current": 28906,
          "from": 28902,
          "to": 29001
        },
        {
          "current": 27794,
          "from": 27702,
          "to": 27801
        },
        {
          "current": 28191,
          "from": 28102,
          "to": 28201
        },
        {
          "current": 28420,
          "from": 28402,
          "to": 28501
        },
        {
          "current": 28334,
          "from": 28302,
          "to": 28401
        },
        {
          "current": 27691,
          "from": 27602,
          "to": 27701
        },
        {
          "current": 27889,
          "from": 27802,
          "to": 27901
        },
        {
          "current": 27990,
          "from": 27902,
          "to": 28001
        },
        {
          "current": 28293,
          "from": 28202,
          "to": 28301
        },
        {
          "current": 28092,
          "from": 28002,
          "to": 28101
        },
        {
          "current": 29004,
          "from": 29002,
          "to": 29101
        },
        {
          "current": 28708,
          "from": 28702,
          "to": 28801
        },
        {
          "current": 28513,
          "from": 28502,
          "to": 28601
        },
        {
          "current": 27500,
          "from": 27402,
          "to": 27501
        },
        {
          "current": 28615,
          "from": 28602,
          "to": 28701
        }
      ],
      "concurrency": 16,
      "catch_up_done": false,
      "is_running": true
    }
  ]
}
```

### `WaitCatchUp()` **(perms: read)**

#### Permissions: read

WaitCatchUp blocks until DASer finishes catching up to the network head.

#### `WaitCatchUp()` example request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "daser.WaitCatchUp",
  "params": []
}
```

#### `WaitCatchUp()` example response

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": []
}
```

## `FRAUD` Module

### `Get(proofType fraud.ProofType)` `[]Proof` **(perms: public)**

Get fetches fraud proofs from the disk by its type.

#### `Get()` example request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "fraud.Get",
  "params": [
    "badencoding"
  ]
}
```

#### `Get()` example response

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    [
      {
        "proof_type": "badencoding",
        "data": "ChJiYWQgZW5jb2RpbmcgcHJvb2YQKg=="
      }
    ]
  ]
}
```

### `Subscribe(proofType fraud.ProofType)` `<- chan Proof` **(perms: public)**

Subscribe allows to subscribe on a Proof pub sub topic by its type.

#### `Subscribe()` example request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "fraud.Subscribe",
  "params": [
    "badencoding"
  ]
}
```

#### `Subscribe()` example response

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    [
      {
        "title": "typeUnsupportedByJSONSchema",
        "type": "['object']"
      }
    ]
  ]
}
```

## `HEADER` Module

### `GetByHeight(u uint64)` `*header.ExtendedHeader` **(perms: public)**

`GetByHeight` returns the `ExtendedHeader` at the given height, blocking until header has been processed by the store or context deadline is exceeded.

#### `GetByHeight()` example request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "header.GetByHeight",
  "params": [
    42
  ]
}
```

#### `GetByHeight()` example response

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "validator_set": {
        "validators": [
          {
            "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
            "pub_key": {
              "type": "tendermint/PubKeyEd25519",
              "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
            },
            "voting_power": "5000000000",
            "proposer_priority": "0"
          }
        ],
        "proposer": {
          "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
          "pub_key": {
            "type": "tendermint/PubKeyEd25519",
            "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
          },
          "voting_power": "5000000000",
          "proposer_priority": "0"
        }
      },
      "header": {
        "version": {
          "block": 11
        },
        "chain_id": "arabica-2",
        "height": 42,
        "time": "2022-11-15T17:04:04.364455555Z",
        "last_block_id": {
          "hash": "D35285797CB08451E8E85B97B0259A3C98E42BFCAEA5465152EE68DBD5760935",
          "parts": {
            "total": 1,
            "hash": "EF5E90A836E5676B98177FB38B0C0BB7D957F71BBA6109B1D79C65344BC6C7FB"
          }
        },
        "last_commit_hash": "DB5BB6A1518FD618D5B6607E9507E60E52BB9B532E5718D6D74F1F510FE5D10F",
        "data_hash": "6F52DAC16545E45725BE6EA32AED55266E45034800EEE1D87C9428F4844EA47A",
        "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
        "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
        "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
        "app_hash": "9E52BD09B71043C25FBC7C8D928490E051811A10E978C66E3519A41352DD0699",
        "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
        "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
        "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
      },
      "commit": {
        "height": 42,
        "round": 0,
        "block_id": {
          "hash": "F22BAEF4D99A835D9F2CA92C58E8AA48C589284B7916FF073A1D778C73EA4CC1",
          "parts": {
            "total": 1,
            "hash": "9961CC7B6B9BE558D0FED40675232F4B37BEE75419C815240804C1A1801CF626"
          }
        },
        "signatures": [
          {
            "block_id_flag": 2,
            "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
            "timestamp": "2022-11-15T17:04:29.384867372Z",
            "signature": "0+INXvvzUExQToNpmQhhvFySbQYFqoYTpgFACP+3lkSWGh48ukkMMqj2UnnAzqQhabuKeXx/5f8hiwEzeMM6Dg=="
          }
        ]
      },
      "dah": {
        "row_roots": [
          "//////////7//////////rr7xfWEpBugDbgBYmKPvIOGpNDJUjrMyS17ZyAnUvK7",
          "/////////////////////zEUYTRl2BUUeFrpCh4OmiYKeTgtgYfn/tCeVNNVTMv4"
        ],
        "column_roots": [
          "//////////7//////////rr7xfWEpBugDbgBYmKPvIOGpNDJUjrMyS17ZyAnUvK7",
          "/////////////////////zEUYTRl2BUUeFrpCh4OmiYKeTgtgYfn/tCeVNNVTMv4"
        ]
      }
    }
  ]
}
```

### `Head()` `*header.ExtendedHeader` **(perms: public)**

`Head` returns the `ExtendedHeader` of the chain head.

#### `Head()` example request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "header.Head",
  "params": []
}
```

#### `Head ()` example response

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "validator_set": {
        "validators": [
          {
            "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
            "pub_key": {
              "type": "tendermint/PubKeyEd25519",
              "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
            },
            "voting_power": "5000000000",
            "proposer_priority": "0"
          }
        ],
        "proposer": {
          "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
          "pub_key": {
            "type": "tendermint/PubKeyEd25519",
            "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
          },
          "voting_power": "5000000000",
          "proposer_priority": "0"
        }
      },
      "header": {
        "version": {
          "block": 11
        },
        "chain_id": "arabica-2",
        "height": 42,
        "time": "2022-11-15T17:04:04.364455555Z",
        "last_block_id": {
          "hash": "D35285797CB08451E8E85B97B0259A3C98E42BFCAEA5465152EE68DBD5760935",
          "parts": {
            "total": 1,
            "hash": "EF5E90A836E5676B98177FB38B0C0BB7D957F71BBA6109B1D79C65344BC6C7FB"
          }
        },
        "last_commit_hash": "DB5BB6A1518FD618D5B6607E9507E60E52BB9B532E5718D6D74F1F510FE5D10F",
        "data_hash": "6F52DAC16545E45725BE6EA32AED55266E45034800EEE1D87C9428F4844EA47A",
        "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
        "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
        "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
        "app_hash": "9E52BD09B71043C25FBC7C8D928490E051811A10E978C66E3519A41352DD0699",
        "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
        "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
        "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
      },
      "commit": {
        "height": 42,
        "round": 0,
        "block_id": {
          "hash": "F22BAEF4D99A835D9F2CA92C58E8AA48C589284B7916FF073A1D778C73EA4CC1",
          "parts": {
            "total": 1,
            "hash": "9961CC7B6B9BE558D0FED40675232F4B37BEE75419C815240804C1A1801CF626"
          }
        },
        "signatures": [
          {
            "block_id_flag": 2,
            "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
            "timestamp": "2022-11-15T17:04:29.384867372Z",
            "signature": "0+INXvvzUExQToNpmQhhvFySbQYFqoYTpgFACP+3lkSWGh48ukkMMqj2UnnAzqQhabuKeXx/5f8hiwEzeMM6Dg=="
          }
        ]
      },
      "dah": {
        "row_roots": [
          "//////////7//////////rr7xfWEpBugDbgBYmKPvIOGpNDJUjrMyS17ZyAnUvK7",
          "/////////////////////zEUYTRl2BUUeFrpCh4OmiYKeTgtgYfn/tCeVNNVTMv4"
        ],
        "column_roots": [
          "//////////7//////////rr7xfWEpBugDbgBYmKPvIOGpNDJUjrMyS17ZyAnUvK7",
          "/////////////////////zEUYTRl2BUUeFrpCh4OmiYKeTgtgYfn/tCeVNNVTMv4"
        ]
      }
    }
  ]
}
```

### `isSyncing() bool` `*header.ExtendedHeader` **(perms: public)**

`IsSyncing` returns the status of sync.

#### `isSyncing()` example request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "header.IsSyncing",
  "params": []
}
```

#### `isSyncing()` example response

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    true
  ]
}
```
