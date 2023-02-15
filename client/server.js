const express = require('express');
const fs = require('fs');
const proto = require('@cosmjs/proto-signing');
const stargate = require('@cosmjs/stargate');
const crypto = require('@cosmjs/crypto');
const custom_msg = require("./protogen/tx.js");
const http = require('http');
const fetch = require('node-fetch');
var request = require('request');
var cors = require("cors");
var bodyParser = require("body-parser");

const CHAIN_ID = "testhellochain";
const HOST_NAME = '127.0.0.1';
const PORT = 4000;


const URL_HOME = '/';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(cors());

const accountDetails = { "address" : "", "mnemonic" : ""};
(async() =>{
  const launchpad = require("@cosmjs/launchpad")
  const {Secp256k1HdWallet} = launchpad;
  const secp256k1HdWalletOptions = {prefix: "cosmos"}
  const wallet = await Secp256k1HdWallet.generate(12, secp256k1HdWalletOptions);
  const [{ address }] = await wallet.getAccounts();
  accountDetails.address = address;
  accountDetails.mnemonic = wallet.mnemonic;
})();

app.post('/estimate', async (req, res) => {
  console.log("Mnemonic:",accountDetails.address);
  console.log("Address:", accountDetails.mnemonic);
  request({
    url: "http://127.0.0.1:4001/receive",
    method: "POST",
    json: true,
    body: accountDetails
  });
  res.end();
  //res.redirect("/");
});

app.get('/', (req, res) => {
  html = fs.readFileSync('./views/home.html');
  res.write(html);
  res.end();
});

app.listen(PORT, () => console.log(`Server running at: http://${HOST_NAME}:${PORT}`));

