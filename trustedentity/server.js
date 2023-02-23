const express = require('express');
const proto = require('@cosmjs/proto-signing');
const stargate = require('@cosmjs/stargate');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  ADDRESS_OF_TRUSTED_ENTITY: process.env.ADDRESS_OF_TRUSTED_ENTITY,
  MNEMONIC_OF_TRUSTED_ENTITY: process.env.MNEMONIC_OF_TRUSTED_ENTITY,
};
var cors = require("cors");
var bodyParser = require("body-parser");

const RPC_END_POINT = "http://172.22.42.11:26657";  //wsl
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
  //console.log(res.body.mnemonic);
  await account_creation_tx(req.body.address);
  res.end();
});

async function account_creation_tx(reciever_address)
{
  try {
      const guardian_auth_address = process.env.ADDRESS_OF_TRUSTED_ENTITY
      const guardian_auth_mnemonic = process.env.MNEMONIC_OF_TRUSTED_ENTITY
      // const guardian_auth_address = ""
      // const guardian_auth_mnemonic = ""
      const guardian_auth_wallet = await proto.DirectSecp256k1HdWallet.fromMnemonic(guardian_auth_mnemonic);
      const guardian_auth = await stargate.SigningStargateClient.connectWithSigner(RPC_END_POINT, guardian_auth_wallet);
      console.log("Requester's address: ", reciever_address);
      const fee = {
        amount: [
            {
            denom: "token", // Use the appropriate fee denom for your chain
            amount: "10",
            },
        ],
        gas: "250000",
      };
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

