const mongoose = require("mongoose");
const url = "mongodb+srv://yasmeen:1996292yaso@cluster0-l9jkx.mongodb.net/skinCancer?retryWrites=true&w=majority";
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://yasmeen:1996292yaso@cluster0-l9jkx.mongodb.net/skinCancer?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("We are connected");
});
module.exports = db;
// //Atlas connection
// const uri =
//   "mongodb+srv://smunawer:smunawer@skincancerdata.vymhw.gcp.mongodb.net/skinCancerData?retryWrites=true&w=majority";
// const client = new MongoClient(url);
// async function run() {
//   try {
//     await client.connect();
//     console.log("Connected correctly to server");
//   } catch (err) {
//     console.log(err.stack);
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);
