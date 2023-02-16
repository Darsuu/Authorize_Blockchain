const express = require('express');
const fs = require('fs');
var request = require('request');
var cors = require("cors");
var bodyParser = require("body-parser");
const {Secp256k1HdWallet} = require("@cosmjs/launchpad")

const HOST_NAME = '127.0.0.1';
const PORT = 4000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(cors());

(async() =>{
  
  
})();

app.post('/estimate', async (req, res) => {
  const wallet = await Secp256k1HdWallet.generate(12, {prefix: "cosmos"});
  const [{ address }] = await wallet.getAccounts();
  console.log("Address:", address);
  request({
    url: "http://127.0.0.1:4001/receive",
    method: "POST",
    json: true,
    body: {address: address}
  });
  res.end();
});

app.get('/', (req, res) => {
  html = fs.readFileSync('./views/home.html');
  res.write(html);
  res.end();
});

app.listen(PORT, () => console.log(`Client Server running at: http://${HOST_NAME}:${PORT}`));

