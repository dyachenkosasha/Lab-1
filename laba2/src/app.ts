import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes";
import requestsRoutes from "./routes/requests.routes";
import commentsRoutes from "./routes/comments.routes";
import logger from "./middleware/requests.logger.middleware";
import errorHandler from "./middleware/error-handler.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS: origin is not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/requests", requestsRoutes);
app.use("/api/v1/comments", commentsRoutes);

app.use(errorHandler);

export { app };