
import { createServer, IncomingMessage, ServerResponse, type Server } from "node:http";
import { routeHandler } from "./routes/product.routes";
import { config } from "./config";
import {Pool} from "pg";

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_wtqurXDe71Iv@ep-billowing-sunset-b34zzycv.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})
// console.log(pool)
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT,
      is_Active BOOLEAN DEFAULT true,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    console.log("Database connected!!");
  } catch (error) {
    console.log(error);
  }
};

initDB();

const server: Server = createServer(
    (req:IncomingMessage,res:ServerResponse) => {
        routeHandler(req,res)

    }
);

server.listen(config.port,() => {
    console.log(`Server is running on port ${config.port}`)
})