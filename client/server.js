const express = require('express');
const fs = require('fs');
var request = require('request');
var cors = require("cors");
var bodyParser = require("body-parser");
const proto = require('@cosmjs/proto-signing');
const stargate = require('@cosmjs/stargate');
const crypto = require('crypto');
const readline = require('readline');
const {Secp256k1HdWallet} = require("@cosmjs/launchpad")

const HOST_NAME = '127.0.0.1';
const PORT = 4000;
const algorithm = 'aes-256-cbc';
// const RPC_END_POINT = "http://172.22.42.11:26657";
const RPC_END_POINT = "http://192.168.56.1:26657";
const iv = crypto.randomBytes(16);
var decrypt_key = '';
var encrypted_data = '';
var decrypted_mnemonic = '';
var sender_address = '';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

app.use(express.static('views'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(cors());

async function send_token_tx(sending_amount, receiver_address)
{
  try {
      const sender_wallet = await proto.DirectSecp256k1HdWallet.fromMnemonic(Object.values({decrypted_mnemonic})[0]);
      const client = await stargate.SigningStargateClient.connectWithSigner(RPC_END_POINT, sender_wallet);
      console.log("Requester's address: ", receiver_address);
      const fee = {
        amount: [
            {
            denom: "token", // Use the appropriate fee denom for your chain
            amount: "10",
            },
        ],
        gas: "250000",
      };
      console.log("***************", sender_address, receiver_address);
      const result = await client.sendTokens(sender_address, receiver_address, [{denom: "token", amount: sending_amount.toString()}], fee);
      console.log(result);
      stargate.assertIsDeliverTxSuccess(result);
  } catch(err) {
    console.log(err)
  }
}

async function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(decrypt_key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function createPassFile(pass)
{
  const wallet = await proto.DirectSecp256k1HdWallet.generate(24);
  //console.log(wallet.mnemonic);
  var key1 = crypto.createHash('sha256').update(String(pass)).digest('hex').substring(0, 32);
  var encrypted = await encrypt(wallet.mnemonic, key1);
  fs.writeFile('pass.txt', encrypted.encryptedData + "\n" + key1, function (err) {
  if (err) throw err;
  console.log('File created successfully.');
  });
  return encrypted;
}

async function encrypt(text, key) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'),
  encryptedData: encrypted.toString('hex') };
}

app.get('/logged-in', async (req, res) => {
  html = fs.readFileSync('./views/logged-in.html');
  res.write(html);
  res.end();
});

app.get('/', (req, res) => {
  var html;
  if(fs.existsSync("./pass.txt"))
  {
      html = fs.readFileSync('./views/login.html');
  } 
  else html = fs.readFileSync('./views/signup.html');
  res.write(html);
  res.end();
});

app.get('/login', (req, res) => {
  html = fs.readFileSync('./views/login.html');
  res.write(html);
  res.end();
});

app.get('/home', (req, res) => {
  html = fs.readFileSync('./views/home.html');
  res.write(html);
  res.end();
});

app.post('/login', async (req, res) => {
  const pass = crypto.createHash('sha256').update(String(req.body.pass)).digest('hex').substring(0, 32);
  const fileStream = fs.createReadStream('./pass.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  const credentials = [];
  for await (const line of rl) {
    credentials.push(line);
  }
  if(credentials[1] === pass)
  {
    console.log("Login successful");
    decrypt_key = pass;
    decrypted_mnemonic = await decrypt(encrypted_data);
    // console.log(Object.values({decrypted_mnemonic})[0]);
    // console.log(typeof(Object.values({decrypted_mnemonic})[0]));
    res.end();
  } 
  else console.log("Login failed");
  
});

app.post('/signup', async (req, res) => {
  const pass = req.body.pass;
  const confirmpass = req.body.confirmPass;
  if(pass === confirmpass)
  {
      encrypted_data = await createPassFile(pass);
      console.log("Sign up successful");
      res.end();
  }
  else console.log("Password and Confirm Password must be equal");
});

app.post('/activate', async (req, res) => {
  const wallet = await Secp256k1HdWallet.generate(12, {prefix: "cosmos"});
  const some_add = await wallet.getAccounts();
  sender_address = some_add[0].address;
  //console.log(sender_address)
  //console.log("Address:", address, "Mnemonic: ", Object.values({decrypted_mnemonic})[0]);
  request({
    url: "http://127.0.0.1:4001/receive",
    method: "POST",
    json: true,
    body: {address: sender_address, mnemonic: Object.values({decrypted_mnemonic})[0]}
  });
  res.end();
});

app.post('/transfer', async (req, res) => {
  await send_token_tx(req.body.amount, req.body.receiverAddress);
  res.end();
});

app.listen(PORT, () => console.log(`Client Server running at: http://${HOST_NAME}:${PORT}`));

