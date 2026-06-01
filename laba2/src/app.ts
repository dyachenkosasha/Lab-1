import express from "express";
import usersRoutes from "./routes/users.routes";
import requestsRoutes from "./routes/requests.routes";
import commentsRoutes from "./routes/comments.routes";
import logger from "./middleware/requests.logger.middleware";
import errorHandler from "./middleware/error-handler.middleware";
const app = express();

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", usersRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/comments", commentsRoutes);

app.use(errorHandler);

export { app };