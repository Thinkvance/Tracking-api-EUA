import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import vendor from "./routes/routes.js";
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8001;

app.use(
  cors({
    origin: "*", // or "*"
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

app.use("/api/tracking/v3", vendor);

app.get("/", (req, res) => {
  res.send("Tracking Service!!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} updated on 31 Oct, 25`);
});
