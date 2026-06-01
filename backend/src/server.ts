import { app } from "./app";
import { migrate } from "./db/migrate";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function bootstrap() {
  await migrate();
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});