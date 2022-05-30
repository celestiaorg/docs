# Getting and Sending Transactions with Celestia Node
<!-- markdownlint-disable MD013 -->

In this tutorial, we will cover how to use the Celestia Node API to submit and
retrieve messages from the Data Availability Layer by their namespace ID.

## Hardware Requirements

You can find hardware requirements [here](../../nodes/light-node#hardware-requirements).

## Setting Up Dependencies

You can follow the tutorial for setting up the dependencies [here](../developers/environment).

## Celestia Node

## Install Celestia Node

You can follow the tutorial for building Celestia Node [here](../developers/celestia-node)

### Instantiate Celestia Light Node

Now, let's instantiate a Celestia Light node:

> Note: RPC Endpoints are exposed in all Celestia Node types
  such as Light, Bridge and Full Nodes.

```sh
celestia light init
```

### Generate A Wallet

You can follow the tutorial for generating a Wallet with Celestia Light Node [here](../../nodes/keys#steps-for-generating-light-node-keys).

Now, head over to the Celestia Discord channel `#faucet`.

You can request funds to your wallet address using the following command in Discord:

```console
$request <Wallet-Address>
```

Where `<Wallet-Address>` is the `celestia1******` address generated
when you created the wallet.

With your wallet funded, you can move on to the next step.

### Connect To A Public Core Endpoint

Let's now run the Celestia Light node with a GRPC connection to
an example public Core Endpoint.

> Note: You are also encouraged to find a community-run API endpoint
  and there are several in the Discord. This one is used for demonstration
  purposes. You can find a list of RPC endpoints [here](../nodes/mamaki-testnet#rpc-endpoints)

Here we are starting a light node with a connection to a Core endpoint and
also telling the light node to use the `developer` key we generated
as its default account.

```sh
celestia light start --core.grpc http://<ip-address>:9090 --keyring.accname developer
```

## Node API Calls

Open up another terminal window in order to begin querying the API.
`celestia-node` exposes its RPC endpoint on port `26658` by default.

### Balance

Now, let's query our node for the balance of its default account
(which is the account associated with the `developer` key we generated earlier):

```sh
curl -X GET http://127.0.0.1:26658/balance/
```

It will output the following:

```json
{
   "denom":"utia",
   "amount":"999995000000000"
}
```

This shows you the balance in that wallet.

### Get Block Header

Now, let's get the block header information.

Here we will get the header from Block 1:

```sh
curl -X GET http://127.0.0.1:26658/header/1
```

It will output something like this:

```json
{
   "header":{
      "version":{
         "block":11
      },
      "chain_id":"devnet-2",
      "height":1,
      "time":"2021-11-23T02:24:05.965728875Z",
      "last_block_id":{
         "hash":"",
         "parts":{
            "total":0,
            "hash":""
         }
      },
      "last_commit_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "data_hash":"7B578B351B1B0BBD70BB350019EBC964C44A140A37EF715B552A7F8F315ACD19",
      "validators_hash":"7F4EA93A134DEDBDA6A1FDD30D05760DD98A2B5FBA95DB3EFFFE7FCE4B361855",
      "next_validators_hash":"7F4EA93A134DEDBDA6A1FDD30D05760DD98A2B5FBA95DB3EFFFE7FCE4B361855",
      "consensus_hash":"048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
      "app_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "last_results_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "evidence_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "proposer_address":"04881EB0A0A4C1DB414C708249CEEC2FCF348F3E"
   },
   "commit":{
      "height":1,
      "round":1,
      "block_id":{
         "hash":"4632277C441CA6155C4374AC56048CF4CFE3CBB2476E07A548644435980D5E17",
         "parts":{
            "total":1,
            "hash":"BE1B789969938DB061B7723BE45C8A7B4B27192339A8E0A4E216775B2CB58D97"
         }
      },
      "signatures":[
         {
            "block_id_flag":2,
            "validator_address":"03F1044A6DF782189C7061FF89146B3D33608F17",
            "timestamp":"2021-11-23T11:53:56.123958759Z",
            "signature":"q/XF7Nc2ThcQgWfqi6LYOUEqLcU+sgVPY1nB2CLWdjRo80WwI6xy6QaYx1B0lmcKAkWR0YMxbc7vJzKF70qwBA=="
         },
         {
            "block_id_flag":2,
            "validator_address":"04881EB0A0A4C1DB414C708249CEEC2FCF348F3E",
            "timestamp":"2021-11-23T11:53:56.036027188Z",
            "signature":"0bbxeviCvgLlyIF47JoY1CMN2e/MhHtFzhdgV0zCM+P3qeO/rkh+0TSxoRVUB1MDvMCoA8hyffCw3amxympMAA=="
         },
         {
            "block_id_flag":2,
            "validator_address":"31711F367349D1BD619BD0A39568A69614B8A048",
            "timestamp":"2021-11-23T11:53:56.135943844Z",
            "signature":"gT23rZ8+XcG5rQ9QS+uh+Wn5eAiJDVy8bh23Fb8hevnHsuO1er2892MXAohaLRF6TTWs/C6dItYph4B/k3b6DQ=="
         },
         {
            "block_id_flag":2,
            "validator_address":"5A253EC2A9AB20AFD48C7BED2AFCA53F5C80BCA6",
            "timestamp":"2021-11-23T11:53:56.081698742Z",
            "signature":"nMngIlJ7PPPtu0N20YwKhWt/H3/JrEKJC3rnS5KG/8J3IppTacuwjGDUqIuHpRlrD0MmWa1mlY+6+ulbytt2AA=="
         },
         {
            "block_id_flag":2,
            "validator_address":"79BEB39F4B396F9278DA03F1C97F9BE3B10B12D3",
            "timestamp":"2021-11-23T11:53:56.037896319Z",
            "signature":"wPAL/sK4YXSU7iRXl00GDLvi4IItVlkY2zRkxIUeV9VA3Tq8Tke6wGE0N6pXKmtMcKUMoyjm03RWHv4mrtj1BA=="
         },
         {
            "block_id_flag":1,
            "validator_address":"",
            "timestamp":"0001-01-01T00:00:00Z",
            "signature":null
         },
         {
            "block_id_flag":1,
            "validator_address":"",
            "timestamp":"0001-01-01T00:00:00Z",
            "signature":null
         },
         {
            "block_id_flag":2,
            "validator_address":"D345D62BBD18C301B843DF7C65F10E57AB17BD98",
            "timestamp":"2021-11-23T11:53:56.123499237Z",
            "signature":"puj5Epw3yPGjSsJk6aQI74S2prgL7+cuiEpCxXYzQxOi0kNIqh8UMZLYf+AVHDQNJXehSmrAK6+VsIt9NF0DDg=="
         },
         {
            "block_id_flag":2,
            "validator_address":"DEC2642E786A941511A401090D21621E7F08A36D",
            "timestamp":"2021-11-23T11:53:56.123136439Z",
            "signature":"J/lnFqARXj42Lfx5MGY0FO/wug+AyQRxTnQp1u1HyczvV+0hXXuk06Uosi61jQKgJG6JBJF2VidqA41/uKMEDw=="
         }
      ]
   },
   "validator_set":{
      "validators":[
         {
            "address":"03F1044A6DF782189C7061FF89146B3D33608F17",
            "pub_key":"sMcFgSIzlD77eZYgV7H4akyxoHCPc2oIQW05qWEB6b4=",
            "voting_power":5000,
            "proposer_priority":-40000
         },
         {
            "address":"04881EB0A0A4C1DB414C708249CEEC2FCF348F3E",
            "pub_key":"WdqZ8hoyc1HxZCJfQrAGKm2fFJZFg7PngPNGkA1RWXc=",
            "voting_power":5000,
            "proposer_priority":5000
         },
         {
            "address":"31711F367349D1BD619BD0A39568A69614B8A048",
            "pub_key":"pvwSRksq3ekXIiYK7IzjQJ870BxLqEma8zRr9n9VnXI=",
            "voting_power":5000,
            "proposer_priority":5000
         },
         {
            "address":"5A253EC2A9AB20AFD48C7BED2AFCA53F5C80BCA6",
            "pub_key":"RnmnTlKoKxNoh2TpohBDP3cKlx4ATiPOCvQFk/6xpUU=",
            "voting_power":5000,
            "proposer_priority":5000
         },
         {
            "address":"79BEB39F4B396F9278DA03F1C97F9BE3B10B12D3",
            "pub_key":"oh/N+GOIennBOAa/gPNCso1mDlqaHQNn7Op/X8opbeY=",
            "voting_power":5000,
            "proposer_priority":5000
         },
         {
            "address":"7F1105B7B219481810C49730AECB1A83036BCA3A",
            "pub_key":"Ow/AHP/Q3guPGymUKpvhnwae+QoCOpGztpVnP179IG8=",
            "voting_power":5000,
            "proposer_priority":5000
         },
         {
            "address":"87265CC17922E01497F40B701EC9F05373B83467",
            "pub_key":"MNi0Z+uNF5X1Bxj988IDXVl0BKUcLs7LItoMnX6dbg4=",
            "voting_power":5000,
            "proposer_priority":5000
         },
         {
            "address":"D345D62BBD18C301B843DF7C65F10E57AB17BD98",
            "pub_key":"4g3hhdyU4IIgWW/4sR0nax8bsC/M/fDbt1N8s/QanF8=",
            "voting_power":5000,
            "proposer_priority":5000
         },
         {
            "address":"DEC2642E786A941511A401090D21621E7F08A36D",
            "pub_key":"b+Vv6Lcp0bhIjOQncr+OYBHixCvU5+k34y4RqyvpluE=",
            "voting_power":5000,
            "proposer_priority":5000
         }
      ],
      "proposer":{
         "address":"03F1044A6DF782189C7061FF89146B3D33608F17",
         "pub_key":"sMcFgSIzlD77eZYgV7H4akyxoHCPc2oIQW05qWEB6b4=",
         "voting_power":5000,
         "proposer_priority":-40000
      }
   },
   "dah":{
      "row_roots":[
         "//////////7//////////uyLCVMJmAItYqbOqgHXm3OwHsq1xQiAX1kZV2Tgcobm",
         "/////////////////////ykyWNfDJZfigziZC5BN5L00KKuoyDPduwynDywauskL"
      ],
      "column_roots":[
         "//////////7//////////uyLCVMJmAItYqbOqgHXm3OwHsq1xQiAX1kZV2Tgcobm",
         "/////////////////////ykyWNfDJZfigziZC5BN5L00KKuoyDPduwynDywauskL"
      ]
   }
}
```

### Submit a PFD Transaction

In this example, we will be submitting a PayForData
transaction to the node's `/submit_pfd` endpoint.

Some things to consider:

* PFD is a PayForData Message.
* The endpoint also takes in a `namespace_id` and `data` values.
* Namespace ID should be 8 bytes.
* Data is in hex-encoded bytes of the raw message.
* `gas_limit` is the limit of gas to use for the transaction

We use the following `namespace_id` of `0000010000000100` and
the `data` value of `f1f20ca8007e910a3bf8b2e61da0f26bca07ef78717a6ea54165f5`.

You can generate your own `namespace_id` and data values using this
useful Golang Playground we created [here](https://go.dev/play/p/7ltvaj8lhRl).

We run the following:

```sh
curl -X POST -d '{"namespace_id": "0c204d39600fddd3", \
  "data": "f1f20ca8007e910a3bf8b2e61da0f26bca07ef78717a6ea54165f5", \
  "gas_limit": 60000}' http://localhost:26658/submit_pfd
```

We get the following output:

```json
{
   "height":2452,
   "txhash":"04A79AF9DA62FDB41ACD7D82EB0B9004AE4E4ED603B280A65816560B4F38A999",
   "data":"12200A1E2F7061796D656E742E4D7367506179466F7244617461526573706F6E7365",
   "raw_log":"[{\"msg_index\":0,\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/payment.MsgPayForData\"}]},{\"type\":\"payfordata\",\"attributes\":[{\"key\":\"signer\",\"value\":\"celestia1vdjkcetnw35kzvtgxvmxwmnwwaaxuet4xp3hxut6dce8wctsdq6hjwfcxd5xvvmyddsh5mnvvaaq6776xw\"},{\"key\":\"size\",\"value\":\"27\"}]}]}]",
   "logs":[
      {
         "msg_index":0,
         "events":[
            {
               "type":"message",
               "attributes":[
                  {
                     "key":"action",
                     "value":"/payment.MsgPayForData"
                  }
               ]
            },
            {
               "type":"payfordata",
               "attributes":[
                  {
                     "key":"signer",
                     "value":"celestia1vdjkcetnw35kzvtgxvmxwmnwwaaxuet4xp3hxut6dce8wctsdq6hjwfcxd5xvvmyddsh5mnvvaaq6776xw"
                  },
                  {
                     "key":"size",
                     "value":"27"
                  }
               ]
            }
         ]
      }
   ],
   "events":[
      {
         "type":"coin_spent",
         "attributes":[
            {
               "key":"spender",
               "value":"celestia10jhckjxxymsufflglvypxscnmggetwh0gfasws",
               "index":true
            },
            {
               "key":"amount",
               "value":"1utia",
               "index":true
            }
         ]
      },
      {
         "type":"coin_received",
         "attributes":[
            {
               "key":"receiver",
               "value":"celestia17xpfvakm2amg962yls6f84z3kell8c5lpnjs3s",
               "index":true
            },
            {
               "key":"amount",
               "value":"1utia",
               "index":true
            }
         ]
      },
      {
         "type":"transfer",
         "attributes":[
            {
               "key":"recipient",
               "value":"celestia17xpfvakm2amg962yls6f84z3kell8c5lpnjs3s",
               "index":true
            },
            {
               "key":"sender",
               "value":"celestia10jhckjxxymsufflglvypxscnmggetwh0gfasws",
               "index":true
            },
            {
               "key":"amount",
               "value":"1utia",
               "index":true
            }
         ]
      },
      {
         "type":"message",
         "attributes":[
            {
               "key":"sender",
               "value":"celestia10jhckjxxymsufflglvypxscnmggetwh0gfasws",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"fee",
               "value":"1utia",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"acc_seq",
               "value":"celestia10jhckjxxymsufflglvypxscnmggetwh0gfasws/267",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"signature",
               "value":"JMNihnKS/MtYJDprqEFGJuXh16tVADsDDxXaFFpvv2te57btl4LbiRzwRRiN2rvwkJ2zlAApu2ImT22MZBi5+A==",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"fee",
               "value":"",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"acc_seq",
               "value":"celestia13zx48t96zauht0kpcn0kcfykc9wn8fehzcp9wq/1024",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"signature",
               "value":"mIZIjbzN0/RQAlQN7TDWzqtey3vVBPe7IO3+IIDhJstIH8QU9vsHfl0Rql9qWMZQG4dM+77w9WmUcnCeS7edfw==",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"fee",
               "value":"",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"acc_seq",
               "value":"celestia1h36gnnwzneu0csqzn2waph5y983hf3dkaznlgz/0",
               "index":true
            }
         ]
      },
      {
         "type":"tx",
         "attributes":[
            {
               "key":"signature",
               "value":"sfy+XyP7iWU+V9q3zEIOWxbGihvhzUKRLNVeXP+a+5oRefIA/Pyqfm13A5NU9I27hhfvpqo9vhXW1waRgcI9OA==",
               "index":true
            }
         ]
      },
      {
         "type":"message",
         "attributes":[
            {
               "key":"action",
               "value":"/payment.MsgPayForData",
               "index":true
            }
         ]
      },
      {
         "type":"payfordata",
         "attributes":[
            {
               "key":"signer",
               "value":"celestia1vdjkcetnw35kzvtgxvmxwmnwwaaxuet4xp3hxut6dce8wctsdq6hjwfcxd5xvvmyddsh5mnvvaaq6776xw",
               "index":true
            },
            {
               "key":"size",
               "value":"27",
               "index":true
            }
         ]
      }
   ]
}
```

If you notice from the above output, it returns a `height` of
`2452` which we will use for the next command.

### Get Namespaced Shares by Block Height

After submitting your PFD transaction, upon success, the node will return
the block height for which the PFD transaction was included. You can then
use that block height and the namespace ID with which you submitted your
PFD transaction to get your message shares returned to you. In this example,
the block height we got was 589 which we will use for the following command.

```sh
curl -X GET \
  http://localhost:26658/namespaced_shares/0c204d39600fddd3/height/2452
```

Will generate the following output:

```json
{
   "shares":[
      "DCBNOWAP3dMb8fIMqAB+kQo7+LLmHaDya8oH73hxem6lQWX1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
   ],
   "height":2452
}
```

The output here is base64-encoded.
