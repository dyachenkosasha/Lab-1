import express from "express";

import requestsRoutes from "./routes/requests.routes";
import usersRoutes from "./routes/users.routes";

import logger from "./middleware/requests.logger.middleware";
import errorHandler from "./middleware/error-handler.middleware";

const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/requests", requestsRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});