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

module.exports = fetchAllChats;
