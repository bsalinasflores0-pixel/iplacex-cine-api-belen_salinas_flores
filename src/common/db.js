import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://bsalinasflores0_db_user:f4INME08yvgNWcRL@cluster-express.tdj6udf.mongodb.net/?appName=cluster-express";

export const cliente = new MongoClient(uri, {
    serverApi: {
       version: ServerApiVersion.v1,
       strict: true,
       deprecationErrors: true 
    }
});