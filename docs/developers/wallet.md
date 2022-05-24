# Wallet

## Create a Wallet

You can pick whatever wallet name you want.
For our example we used "validator" as the wallet name:

```sh
celestia-appd keys add validator
```

Save the mnemonic output as this is the only way to
recover your validator wallet in case you lose it!

## Fund a Wallet

For the public celestia address, you can fund the
previously created wallet via Discord by sending
this message to #faucet channel:

```text
$request celestia1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Wait to see if you get a confirmation that the
tokens have been successfully sent. To check if
tokens have arrived successfully to the destination
wallet run the command below replacing the public
address with your own:

```sh
celestia-appd q bank balances celestia1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
