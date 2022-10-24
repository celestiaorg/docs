---
sidebar_label: Node API
---

# Celestia Node API Docs
<!-- markdownlint-disable MD013 -->

This is the Celestia Node API Docs reference page for being able to make API
requests to your Celestia Node.

In order to query the API, you will need to setup your node. Resources on
how to do this can be found in the following [guide](../nodes/validator-node.md#deploy-the-celestia-node).

## Endpoints

### Header endpoints

#### GET /header/{height}

Returns the header of the given height.

Request

```sh
curl -X GET http://<ip-address>:26658/header/300
```

Response

```json
{
   "header":{
      "version":{
         "block":11
      },
      "chain_id":"devnet-2",
      "height":300,
      "time":"2021-11-23T13:13:21.208225643Z",
      "last_block_id":{
         "hash":"7BA28942BB87007324F0332BEB4B3FA57F63BB6FA424B3281D28DFB237AE1A01",
         "parts":{
            "total":1,
            "hash":"5FE2802B7A4D9A0281011401640BFC64854683168BD0FBEC04EFC8065CBE8EA0"
         }
      },
      "last_commit_hash":"82E20D9E023C5B27A71D8AC5FAB8B8BEEAFE735E880386C899D7DE24D3735102",
      "data_hash":"7B578B351B1B0BBD70BB350019EBC964C44A140A37EF715B552A7F8F315ACD19",
      "validators_hash":"7F4EA93A134DEDBDA6A1FDD30D05760DD98A2B5FBA95DB3EFFFE7FCE4B361855",
      "next_validators_hash":"7F4EA93A134DEDBDA6A1FDD30D05760DD98A2B5FBA95DB3EFFFE7FCE4B361855",
      "consensus_hash":"048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
      "app_hash":"528DBBF7330CF30BFAD76EDB1E19935D9CBD7AE522E1D4CC51A6FF0B58ABB72E",
      "last_results_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "evidence_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "proposer_address":"31711F367349D1BD619BD0A39568A69614B8A048"
   },
   "commit":{
      "height":300,
      "round":0,
      "block_id":{
         "hash":"D63D40F570E90E5757AD72DA6EB839B9B47E78AB760FFBDF0275CBC6B9A74D30",
         "parts":{
            "total":1,
            "hash":"676A9F3EA11F828E58F44C600762FD09C4DE95611FD1EF8522A3198D29B8B1C9"
         }
      },
      "signatures":[
         {
            "block_id_flag":2,
            "validator_address":"03F1044A6DF782189C7061FF89146B3D33608F17",
            "timestamp":"2021-11-23T13:13:36.603550499Z",
            "signature":"/14ReW+Ig0xf8Ew4SE2WtaCWnaWcB+RHsIosjo+uJUfANhceVVpQtCfO2wQtjtPk/JIBcoq/XcomkqsbOlYwBA=="
         },
         {
            "block_id_flag":2,
            "validator_address":"04881EB0A0A4C1DB414C708249CEEC2FCF348F3E",
            "timestamp":"2021-11-23T13:13:36.60149343Z",
            "signature":"XesoBDBgX1eJDIuVmcQIHIKqDTKZdSCMNcWjdk3xeiTgVNB5TYGlO6n7UUAZE5Gf4OZoOzqPPo847VERdWcgBQ=="
         },
         {
            "block_id_flag":2,
            "validator_address":"31711F367349D1BD619BD0A39568A69614B8A048",
            "timestamp":"2021-11-23T13:13:36.602220136Z",
            "signature":"rqpLcPFCFOOBRDB1Uxc9v+6i/GEoFMBIlJlYgFGWtWFSTu4Btr4ByyjRMo9tO9LIIlLW8guyHNS0+2i6ZcuRCg=="
         },
         {
            "block_id_flag":2,
            "validator_address":"5A253EC2A9AB20AFD48C7BED2AFCA53F5C80BCA6",
            "timestamp":"2021-11-23T13:13:36.673438724Z",
            "signature":"MofRin9HeWVw8ENHIdakr4PBN/Vsf1KeeZxFNW4KAJT6rYJKlTSCIGtfTcGgZgA5B2xyqW2aItQ+NAx/uVoPAg=="
         },
         {
            "block_id_flag":2,
            "validator_address":"79BEB39F4B396F9278DA03F1C97F9BE3B10B12D3",
            "timestamp":"2021-11-23T13:13:36.607283878Z",
            "signature":"/3VQESw+WIxWFgy9VnhSikzkr4qs36ZwSx9oweUnov7Gu/NgdnF94vm560YsObV6ZwN5h3xg7JQp1H+xgfOUCQ=="
         },
         {
            "block_id_flag":2,
            "validator_address":"7F1105B7B219481810C49730AECB1A83036BCA3A",
            "timestamp":"2021-11-23T13:13:36.644589313Z",
            "signature":"pj7uUGGZRDy2P2DsBcVUXZP50tDEpmm5bDen2B0ede8GgcNI8VjfZJKAx8ptps8TJrsThDTQdq6cx2Jj6jfuCA=="
         },
         {
            "block_id_flag":2,
            "validator_address":"87265CC17922E01497F40B701EC9F05373B83467",
            "timestamp":"2021-11-23T13:13:36.605958421Z",
            "signature":"dWHenir11St4TAVNp/yPY+GQSBVypMRulP3wHbWIoZILMzfcirxjfTqlM+0FLtO5B8TNcrk9y9FofBJkcsB/BA=="
         },
         {
            "block_id_flag":2,
            "validator_address":"D345D62BBD18C301B843DF7C65F10E57AB17BD98",
            "timestamp":"2021-11-23T13:13:36.609916618Z",
            "signature":"nOHLUTES3ZHJWGL5C0OW8qJR6Vhn2Ru8TQn2FHCaEnksOqtbehz/9+gZhoTndQHmpI6vQzCXHJc8GoxufYb0Aw=="
         },
         {
            "block_id_flag":2,
            "validator_address":"DEC2642E786A941511A401090D21621E7F08A36D",
            "timestamp":"2021-11-23T13:13:36.602919116Z",
            "signature":"EzKh/zkc+ghJhlkmiqldSdWDfTm4NRfZ/rT58sfAa8cNCztGm0ysCaCItTb88qJzDtB/HsdfWuvjkGezKRiACw=="
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

### Share endpoints

#### GET /namespaced_data/{nID}/height/{height}

Returns original messages of the given namespace ID `nID` from the given block height.

Request

```sh
curl -X GET http://<ip>:26658/namespaced_data/0c204d39600fddd3/height/182038
```

Response

```json
{
   "data":[
      "8fIMqAB+kQo7+LLmHaDya8oH73hxem6lQWX1"
   ],
   "height":182038
}
```

#### GET /namespaced_shares/{nID}

Returns shares of the given namespace ID `nID` from the latest block (chain head).

Request

```sh
curl -X GET http://<ip>:26658/namespaced_shares/0c204d39600fddd3
```

Response

```json
{
   "shares":[
      "DCBNOWAP3dMb8fIMqAB+kQo7+LLmHaDya8oH73hxem6lQWX1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
   ],
   "height":2452
}
```

#### GET /namespaced_shares/{nID}/height/{height}

Returns shares of the given namespace ID `nID` from the block of the given
height `height`.

Request

```sh
curl -X GET http://<ip-address>:26658/namespaced_shares/0c204d39600fddd3/height/2452
```

Response

```json
{
   "shares":[
      "DCBNOWAP3dMb8fIMqAB+kQo7+LLmHaDya8oH73hxem6lQWX1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
   ],
   "height":2452
}
```

### State endpoints

#### GET /head

Returns the tip (head) of the node's current chain.

Request

```sh
curl -X GET http://<ip>:26658/head
```

Returns

```json
{
   "header":{
      "version":{
         "block":11,
         "app":0
      },
      "chain_id":"mamaki",
      "height":32281,
      "time":"2022-06-06T14:48:57.070758938Z",
      "last_block_id":{
         "hash":"C71A7289E67D0A4C3B9C7B35DE534D9D7B1A9CA968507E08A8CCC1D2D1F2A85C",
         "parts":{
            "total":1,
            "hash":"7EF3C6168F5AD4BA4F71D38D759359745137EEE5E20B9D3BC48A8164DC9FABB7"
         }
      },
      "last_commit_hash":"2587A80B0E50C68CDADDB37646BB21A71DFA4AAE43002942880DBE609B51D3A7",
      "data_hash":"7E134D5EA9EA6EE04377765775CCBDE7848587AE832E4D37F5D6E6DB50CFAC3E",
      "validators_hash":"ABD182BE0E866A31A1381E43F87F306609463A5AA8311FF5E6D57CEA98C77FD7",
      "next_validators_hash":"ABD182BE0E866A31A1381E43F87F306609463A5AA8311FF5E6D57CEA98C77FD7",
      "consensus_hash":"048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
      "app_hash":"02D749BD7A79C35DD5696DA1B74194869893717C3A76AB77C10CD5326201F95E",
      "last_results_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "evidence_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "proposer_address":"604377BC74F4F27274825A564761D9875B31AF05"
   },
   "commit":{
      "height":32281,
      "round":0,
      "block_id":{
         "hash":"7E43D3AC65581540DC0F795BC14025D42086492DFDE8AF3361B229B700E8D1D7",
         "parts":{
            "total":1,
            "hash":"00F3A00AC0BC5C781E683918DC890C4EDD4FB1D7E9D77C56304AB07E87EEF96C"
         }
      },
      "signatures":[
         {
            "block_id_flag":1,
            "validator_address":"",
            "timestamp":"0001-01-01T00:00:00Z",
            "signature":null
         },
         {
            "block_id_flag":2,
            "validator_address":"94692789BFAB19CEEB36689B7A509063D717DE78",
            "timestamp":"2022-06-06T14:49:23.14315697Z",
            "signature":"1hzw5xiIXmqOBv4EUtSbH8SDSnmeCvVFjJ8X5LRFiRsJfYz0xI265hYebYvMpKlSV3gd1A0gZfO3+djy4mkbDA=="
         },
         {
            "block_id_flag":2,
            "validator_address":"773E2B801BA253394B2A9963C4FE8DE03566D6D2",
            "timestamp":"2022-06-06T14:49:23.133305419Z",
            "signature":"88Nc/FcKuikZRCg4igVYoE4uJbKBHj7GQjbKi7rqSfZ5kA0am9moCglsM5sONEhF4xgjoMyA/L+xijXw9dEiBw=="
         },
         {
            "block_id_flag":2,
            "validator_address":"0B76107110A486E8767FA1997EA0C4B40B7851AF",
            "timestamp":"2022-06-06T14:49:23.152517011Z",
            "signature":"FbnZ5GYZd5n4P96lNcDZabAO5Ku4xr1/jxlFZh+4CB+rybEnXMpOhPhryiIb5r+EFOF6oPX3Po+g7chjHsh0CQ=="
         },
         {
            "block_id_flag":2,
            "validator_address":"46E301E7829AF0CF4C3C91371F6687EE0D5A9B95",
            "timestamp":"2022-06-06T14:49:23.31013935Z",
            "signature":"53mM7To7SgNCQTPK0aX8H5HeBuhOEU8fkOJBc+d16KF+8On1qD8Hh2YSxk3ATK9fhBjdsiCVIDSjkGoskEqeAw=="
         },
         {
            "block_id_flag":2,
            "validator_address":"2F192A85E9117A3C166584F8AB20B315D8788C5E",
            "timestamp":"2022-06-06T14:49:23.146908495Z",
            "signature":"jZB/C0X0Q5ovwU5Iy8xGHO79Nugs1fXCGPQcM8Z6ctxk622KPT75tk6V4F4UpmeFH8dZStI/l6uBB/ViFJITDA=="
         },
         {
            "block_id_flag":1,
            "validator_address":"",
            "timestamp":"0001-01-01T00:00:00Z",
            "signature":null
         },
         {
            "block_id_flag":2,
            "validator_address":"1DF34566F0F2781A91DF7035D0C70921CABD901E",
            "timestamp":"2022-06-06T14:49:23.141170328Z",
            "signature":"RHYPM2mcjD9/ggauNP2DDBgMPyevFzVQKT5wzlLe87JQGYF439A8nVKqvT2zi4lBX1Qj9Wb9PEcxs87FbDArCg=="
         },
...
}
```

#### GET /data_available/{height}

Returns whether data is available at a specific block height and the probability
that it is available based on the amount of samples collected.

Request

```sh
curl -X GET http://<ip>:26658/data_available/25000
```

Response

```json
{
  "available":true,
  "probability_of_availability":"0.9899774042423815",
}
```

#### GET /balance

Returns the balance of the default account address of the node.

Request

```sh
curl -X GET http://<ip>:26658/balance
```

Response

```json
{
   "denom":"utia",
   "amount":"999995000000000"
}
```

#### GET /balance/{address}

Returns the balance of the given address.

Request

```sh
curl -X GET http://<ip-address>:26658/balance/celes1vuw7pdcyap2u62x6dyqjdzznlg25jll6jj76d0
```

Response

```json
{
   "denom":"utia",
   "amount":"999995000000000"
}
```

#### POST /submit_tx

Submits the given transaction to a running instance of celestia-app.

Request

```sh
curl -X POST -d '{"tx": "0A83080AFE070A1A2F7061796D656E742E4D736757697265506179466F724461746112DF070A2C63656C65733133753364376D6E757930327070397A6B337A707165706A66746A66376476727A6E6B6C333271120802020202020202021880042280040202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202326608101220B0429A0DB28AE163D9C1A300B320B19CEF93EC90AE87B4BA7ECF76C0703A9F891A408FA20C490F620B6A02E7FF5FA4139B997969BADE13A5E4F1A35086670FDC71550447A4759D57C844E836947F4BB73039D0E836511F3B1B8D8F1D317248DAF707326608201220B0429A0DB28AE163D9C1A300B320B19CEF93EC90AE87B4BA7ECF76C0703A9F891A408FA20C490F620B6A02E7FF5FA4139B997969BADE13A5E4F1A35086670FDC71550447A4759D57C844E836947F4BB73039D0E836511F3B1B8D8F1D317248DAF707326608401220B0429A0DB28AE163D9C1A300B320B19CEF93EC90AE87B4BA7ECF76C0703A9F891A408FA20C490F620B6A02E7FF5FA4139B997969BADE13A5E4F1A35086670FDC71550447A4759D57C844E836947F4BB73039D0E836511F3B1B8D8F1D317248DAF70732670880011220B0429A0DB28AE163D9C1A300B320B19CEF93EC90AE87B4BA7ECF76C0703A9F891A408FA20C490F620B6A02E7FF5FA4139B997969BADE13A5E4F1A35086670FDC71550447A4759D57C844E836947F4BB73039D0E836511F3B1B8D8F1D317248DAF707186312550A4E0A460A1F2F636F736D6F732E63727970746F2E736563703235366B312E5075624B657912230A210318F208E403FE5881227DD423254DA2BD4C11BAD740820B23DA352EF0E7581E6412040A020801120310904E1A405311CD1C8888C562CAA95BF4FBBD6646604D59D66FDD8E291A1C1B2C5286727464E0B3DD9E7DF38F681E0D7A2A154AED45810B6A59D351DE105D11D9383E0D44"}'\
  http://<ip-address>:26658/submit_tx
```

Response

```json
{
   "txhash":"63F2F87C2602A2F93585FB23691D17E36F9EA8F47CF50083C88941548F28B588",
   "codespace":"sdk",
   "code":30,
   "raw_log":"block height: 5361, timeout height: 99: tx timeout height",
   "logs":null,
   "gas_wanted":10000
}
```

#### POST /submit_pfd

Constructs, signs and submits a PayForData message to a running instance
of celestia-app. The body of the `/submit_pfd` request should contain the
hex-encoded `namespace_id`, the hex-encoded `data`, and the `gas_limit`
as a uint64.

Request

```sh
curl -X POST -d '{"namespace_id": "0c204d39600fddd3", "data": "f1f20ca8007e910a3bf8b2e61da0f26bca07ef78717a6ea54165f5", "gas_limit": 60000}'\
  http://<ip-address>:26658/submit_pfd
```

Response

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
