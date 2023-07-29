import express from "express";
import dbConnect from"./config/dbConnect.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import "dotenv/config";
import routes from "./routes/index.js";

const app = express();

dbConnect();

app.use(cors({
  origin: true,
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", routes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Connected to Server, Port: ${port}`);
});
