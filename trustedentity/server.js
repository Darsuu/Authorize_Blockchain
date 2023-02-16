const express = require('express');
const proto = require('@cosmjs/proto-signing');
const stargate = require('@cosmjs/stargate');

var cors = require("cors");
var bodyParser = require("body-parser");

// const RPC_END_POINT = "http://0.0.0.0:26657";
const RPC_END_POINT = "https://kunjan-shah-fictional-carnival-w59w5qxrw9vhvqg7-26657.preview.app.github.dev/";     // github codespace url
const HOST_NAME = '127.0.0.1';
const PORT = 4001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(cors());

app.post('/receive', async (req, res) => {
  await account_creation_tx(req.body.address);
});

async function account_creation_tx(reciever_address)
{
  try {
      const guardian_auth_address = "cosmos1deeksqtv3kf2s3q0d5c5dnm72plu6neklg0pkv"
      const guardian_auth_mnemonic = "access slender design violin rabbit useless divorce debris wage muscle clean mind giant speed close license usual cruise explain chuckle solar flip finish tent";
      const guardian_auth_wallet = await proto.DirectSecp256k1HdWallet.fromMnemonic(guardian_auth_mnemonic);
      const guardian_auth = await stargate.SigningStargateClient.connectWithSigner(RPC_END_POINT, guardian_auth_wallet);
      console.log("Requester's address: ", reciever_address);
      // const amount = {
      //   denom: "token",
      //   amount: "100",
      // };
      const fee = {
        amount: [
            {
            denom: "token", // Use the appropriate fee denom for your chain
            amount: "10",
            },
        ],
        gas: "250000",
      };
      console.log("Reached");
      // const result = await guardian_auth.sendTokens(guardian_auth_address, reciever_address, [amount], stargate.StdFee);
      const result = await guardian_auth.sendTokens(guardian_auth_address, reciever_address, [{denom: "token", amount: "100"}], fee);
      console.log(result);
      stargate.assertIsDeliverTxSuccess(result);
  } catch(err) {
    console.log(err)
  }
}

app.get('/', (req, res) => {
  res.write("Hello I'm trusted entity");
  res.end();
});

app.listen(PORT, () => console.log(`Trusted Server running at: http://${HOST_NAME}:${PORT}`));

