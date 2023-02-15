const express = require('express');
const fs = require('fs');
const proto = require('@cosmjs/proto-signing');
const stargate = require('@cosmjs/stargate');
const crypto = require('@cosmjs/crypto');
const custom_msg = require("./protogen/tx.js");
const http = require('http');
const fetch = require('node-fetch');

var cors = require("cors");
var bodyParser = require("body-parser");

const RPC_END_POINT = "http://0.0.0.0:26657";
const HOST_NAME = '127.0.0.1';
const PORT = 4001;

const URL_HOME = '/';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(cors());

app.post('/receive', (req, res) => {
  // console.log(req.body.address);
  // console.log(req.body.mnemonic);
  validate(req);
  res.end();
});

async function validate(req)
{
  const mnemonic = req.body.mnemonic;
  const wallet = await proto.DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const client = await stargate.SigningStargateClient.connectWithSigner(RPC_END_POINT, wallet);
  console.log(req.body.mnemonic);
  console.log(req.body.address);
  // const recipient = "cosmos1q9w4k4pee45sgktwurhh6dkmue3ef8fkgt4gag";
  // const amount = {
  //   denom: "token",
  //   amount: "100",
  // };
  // console.log("Reached");
  // const result = await client.sendTokens(req.body.address, recipient, [amount], "Have fun with your star coins");
  // console.log(result);
  // stargate.assertIsBroadcastTxSuccess(result);
}

app.get('/', (req, res) => {
  res.write("Hello I'm trusted entity");
  res.end();
});

app.listen(PORT, () => console.log(`Server running at: http://${HOST_NAME}:${PORT}`));

