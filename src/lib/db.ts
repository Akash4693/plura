/* import { MongoClient } from "mongodb";

if (!process.env.LOCAL_DATABASE_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri: string = process.env.LOCAL_DATABASE_URL;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).

  let globalWithMongoClientPromise = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
  };

  if (!globalWithMongoClientPromise._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongoClientPromise._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongoClientPromise._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
  
} 

clientPromise
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process on connection failure
  });

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
 */

import mongoose from "mongoose";

// Mongo URI from environment
const MONGODB_URI = process.env.LOCAL_DATABASE_URL;


if (!MONGODB_URI) {
  throw new Error(
    "❌ Please define the LOCAL_DATABASE_URL environment variable."
  );
}

let isConnected = false;

// Connect to the database
export const connectDB = async () => {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use global variable to preserve connection across HMR
    let globalWithMongoConnection = global as typeof globalThis & {
      _mongooseConnection: any;
    };

    if (globalWithMongoConnection._mongooseConnection) {
      isConnected =
        globalWithMongoConnection._mongooseConnection.readyState === 1;
      if (isConnected) {
        console.log("✅ MongoDB is already connected in development.");
        return;
      }
    }

    try {
      const mongooseConnection = await mongoose.connect(MONGODB_URI);
      globalWithMongoConnection._mongooseConnection = mongooseConnection;
      isConnected = true;
      console.log("✅ MongoDB connected successfully in development mode");
    } catch (error: any) {
      console.error("❌ MongoDB connection failed:", error.message);
      process.exit(1); // Immediately exit with error code
    }
  } else {
    // In production, always ensure a fresh connection
    if (isConnected) {
      console.log("✅ MongoDB is already connected.");
      return;
    }

    try {
      const mongooseConnection = await mongoose.connect(MONGODB_URI!);
      isConnected = true;
      console.log("✅ MongoDB connected successfully in production mode");
    } catch (error: any) {
      console.error("❌ MongoDB connection failed:", error.message);
      process.exit(1);
    }
  }
};

// Event listeners for monitoring connection state
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB Event: Connected");
  isConnected = true;
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Event: Connection Error:", err.message);
  isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Event: Disconnected");
  isConnected = false;
});
