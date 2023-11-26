# Authorize Blockchain Project

The following image showcases the basic workflow that will be used in the project. It provides the basic internal working as well as the flow from onboarding to the first transaction.

![SOP flow chart](https://github.com/Darsuu/Authorize_Blockchain/assets/81075125/1e055456-cc34-4309-827b-248fa42e9697)

## First time login
To detect whether a client is coming for the first time or not we will look for the presence of a file `pass.txt` that will contain the SHA256 hash of the saved password along with the mnemonic of the client’s
wallet. If it is the first time a client is coming then we will ask and store the password in the `pass.txt` file by hashing it using the SHA256 algorithm.

## Authentication Process
To authenticate an onboarding client, a trusted entity is used which acts as an authoriser for blockchain. This trusted entity is a genesis account like alice or bob. The genesis account contains tokens which can be sent to the onboarding client to give the client some tokens to do transactions as well as add them to the blockchain.
The client can now perform a transaction to verify that it has indeed been added to the blockchain.

## Inner Working
In detail, the client accesses a web page which is hosted on a NodeJS server. After it has either logged in or signed up then the client has the option to send a HTTP request with its mnemonic and address (X) attached to authenticate itself. This HTTP request is received by the trusted client which initiates a gRPC call to the blockchain’s Tendermint node which is running at `http://0.0.0.0:26657` to transfer some tokens from itself to the client with address X. The client could now verify that it has indeed received some tokens using the Blockchain API that can be accessed at `http://0.0.0.0:1317`

## Prerequisite / Dependencies
- Ignite CLI
- Node

## Running the Blockchain
1. Split into 2 terminals
2. On one terminal, to run the blockchain use the command `ignite scaffold chain test_chain`
3. On the other terminal, move to the correct directory by running the command `cd client` and then `cd trustedclient`
4. To run the server, run the command `node server.js`

