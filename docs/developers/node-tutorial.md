# Getting and Sending Transactions with Celestia Node

In this tutorial we will cover how to use the Celestia Node API to submit and
retrieve transactions from the Data Availability Layer by their namespace
merkle tree.

## Hardware Requirements

You can find hardware requirements [here](https://docs.celestia.org/nodes/bridge-validator-node#install-golang).

## Setting Up Dependencies

You can follow the tutorial for setting up the dependencies [here](https://docs.celestia.org/nodes/bridge-validator-node#setting-up-your-bridge-node).

## Installing Celestia App

In order to begin, we would need to compile the Celestia App binary.

```sh
cd $HOME
git clone https://github.com/celestiaorg/celestia-app.git
cd celestia-app/
git checkout tags/v0.4.0 -b v0.4.0
make install
```

For more information, you can follow the steps on compiling the binary [here](https://docs.celestia.org/nodes/bridge-validator-node#install-celestia-app).

### Generate A Wallet

Once the binary is compiled, you can use it to generate a wallet.

Run the following:

```sh
celestia-appd keys add developer --keyring-backend test
```

This generates a key called `developer` in `celestia-appd`.

Now, head over to the Celestia Discord channel `#faucet`.

You can request funds to your wallet address using the following command in Discord:

```console
$request <Wallet-Address>
```

Where `<Wallet-Address>` is the `celes1******` address generated
when you created the wallet.

With your wallet funded, you can move on to the next step.

## Celestia Node

In another terminal window, run the following:

```sh
cd $HOME
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
make install
```

Verify its installed by running the following command:

```console
$ celestia version
Semantic version: v0.2.0
Commit: 1fcf0c0bb5d5a4e18b51cf12440ce86a84cf7a72
Build Date: Fri 04 Mar 2022 01:15:07 AM CET
System version: amd64/linux
Golang version: go1.17.5
```

Now, let's instantiate a celestia-light node:

```sh
./build/celestia light init
```

With the light-node installed, we can proceed to copying over the keys from
the celestia-app to the celestia-node so they share the same key.

```sh
mkdir ~/.celestia-light/keys/keyring-test
cp ~/.celestia-app/keyring-test/* ~/.celestia-light/keys/keyring-test
```

This will copy over the keys to your Celestia Light node.

Let's now run the Celestia Light node with a GRPC connection to
an example public Core Endpoint.

> Note: You are also encouraged to find a community-run API endpoint
  and there are several in the Discord. This one is used for demonstration
  purposes.

```sh
./build/celestia light start --core.grpc http://64.227.74.87:26657/
```

## Node API Calls

### Balance

Now, let's query our wallet for its balance:

```sh
curl -X GET http://127.0.0.1:26658/balance/celes1v7qgpfwt7jxrhnqj943x584zrhk5wa2qwk67k0
```

It will output the following:

```json
{
   "denom":"uceles",
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

In this example, e will be submitting a transaction to the PFD endpoint.
PFD is a PayForData Message.
The endpoint also takes in a `namespace_id` and `data` values.

Namespace ID should be 8 bytes.
Data is in hex-encoded bytes of the raw message.

We use the following `namespace_id` of `0000010000000100` and
the `data` value of `68656c6c6f`.

You can generate your own `namespace_id` and data values using this
useful Golang Playground we created [here](https://go.dev/play/p/ZZWYSSHTRdo).

We run the following:

```sh
curl -X POST -d '{"namespace_id": "0000010000000100", \
  "data": "68656c6c6f", "gas_limit": 100000}' http://127.0.0.1:26658/submit_pfd
```

We get the following output:

```json
{
   "height":589,
   "txhash":"065ED98A1D75AF10EADF38FC4D2DF125920C696C525732DA094029FCC3D2FE6E",
   "data":"0A180A162F7061796D656E742E4D7367506179466F7244617461",
   "raw_log":"[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/payment.MsgPayForData\"}]},{\"type\":\"payfordata\",\"attributes\":[{\"key\":\"signer\",\"value\":\"celes1vdjkcetnxyc8gandddeh2wfcxe3ksdfn09axkdtrwdnryat3v3jkcut8wpjnjerj0y6hz6sga5fzu\"},{\"key\":\"size\",\"value\":\"256\"}]}]}]",
   "logs":[
      {
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
                     "value":"celes1vdjkcetnxyc8gandddeh2wfcxe3ksdfn09axkdtrwdnryat3v3jkcut8wpjnjerj0y6hz6sga5fzu"
                  },
                  {
                     "key":"size",
                     "value":"256"
                  }
               ]
            }
         ]
      }
   ],
   "gas_wanted":100000,
   "gas_used":38546
}
```

### Get Namespaced Shares by Block Height

After submitting your PFD transaction, upon success, the node will return
the block height for which the PFD transaction was included. You can then
use that block height and the namespace ID with which you submitted your
PFD transaction to get your message shares returned to you. In this example,
the block height we got was 589 which we will use for the following command.

```sh
curl -X GET http://127.0.0.1:26658/namespaced_shares/0000000000000001/height/589
```

Will generate the following output:

```json
{
   "shares":[
      "AAAAAAAAAAEAvgIKkQEKjAEKHC9jb3Ntb3MuYmFuay52MWJldGExLk1zZ1NlbmQSbAosY2VsZXMxeTRxcDBmbjU5OTlubjN6NXo2Mno4bWZ4ejdwc3hqenZ0YTZsOHMSLGNlbGVzMXQzNnNxc3RxZjIzZ2cwcGZ2Y3I5cmg5bWs3ZGxyeGZwdjdzMmU1Gg4KBWNlbGVzEgUxMDAwMBIAEmYKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQLEeDg/AraQeXdgchN+pl+hoedi33JUqqfCb4/CWUcHAxIECgIIfxgAEhIKDAoFY2VsZXMSAw==",
      "AAAAAAAAAAFSMjAwEIDxBBpAzSjtxXYP4iK7F9yf44c6ND1rqcLB9ZS5ScFmpJPDd5JUY91x3axSq+X+gMMdo731cd60XIv+hq7G7tiiVsH2fbsCCpsBCpgBCiMvY29zbW9zLnN0YWtpbmcudjFiZXRhMS5Nc2dEZWxlZ2F0ZRJxCixjZWxlczFuNXR2bXB6Z3JudHJnNTl1MGdhOXd2a3J0NzlsZDd0cHZxZ2ZxdhIzY2VsZXN2YWxvcGVyMW41dHZtcHpncm50cmc1OXUwZ2E5d3ZrcnQ3OWxkN3RwZmQ4dGh5GgwKBWNlbGVzEgMxNjISWQpRCkYKHy9jb3Ntbw==",
      "AAAAAAAAAAGYcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECWgWbvDZPaKewrL/QxZjSQVfZtLk/Ub0tiyDzkcZY49MSBAoCCAEY4BYSBBDAmgwaQHFw/iwCikuSl9PMrj4r5VhHp5FSD0v69CoLKNKEsSf+ROH+rYPESyhTjBR9ByTgi1hZrSPpPjNg1XguLgIPIGe6AgqaAQqXAQojL2Nvc21vcy5zdGFraW5nLnYxYmV0YTEuTXNnRGVsZWdhdGUScAosY2VsZXMxOXo4amd0bHA1eXpyeWw5eDl4ZnZyOWx6a2VmMGQ1YW5scGtzbmsSM2NlbGVzdmFsbw==",
      "AAAAAAAAAAEAcGVyMTl6OGpndGxwNXl6cnlsOXg5eGZ2cjlsemtlZjBkNWFuNnZlank3GgsKBWNlbGVzEgIxNBJZClEKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEC/nJ/fvgeT8SFYP1MlejXt3saD9NY0VDLrPbmhJJRW94SBAoCCAEYuzMSBBD0iAoaQEZM83j2PHH1npls+6dwjmvpXa7XtDBf7hc18f3WKbljalXsR7sJ182SCoPxrkqsRvgP1uUdZn8fMs4CffPJtaMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
   ],
   "height":589
}
```
