const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const connectionString = process.env.mongodb_connection_string;
const database_name = process.env.mongodb_database_name;
const fetchAllChats = async (req, res) => {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    const database = client.db(database_name);
    const collection = database.collection("analytics");
    const documents = await collection.find({}).toArray();
    return res.send(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).send("Error fetching documents");
  }
};

const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    console.log('id-from-frontend',chatId) ;
    const client = new MongoClient(connectionString);
    await client.connect();
    const database = client.db(database_name);
    const collection = database.collection("analytics");
    const requiredItem = collection.findOne({chatId}) ;
    await collection.deleteOne(requiredItem) ;
    return res.status(200).send({ message: "Chat deleted successfully" });
  } catch (error) {
    return res.status(500).send("Error fetching documents");
  }
};

module.exports = {fetchAllChats , deleteChat}
