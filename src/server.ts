import app from "./app.js"
import { port, environment } from "./config/server.config.js";
import { connectDatabase } from "./config/database.config.js";

const setupDB = async () => {
  try {
    await connectDatabase();
    console.log("Database connected successfully.");
  } catch (err) {
    console.error("[Startup] Database connection failed:", err);
    process.exit(1);
  }
};

app.listen(port, async (err) => {
    if (err) { console.error(err); process.exit(1); }
    
    await setupDB();

    console.log(`Server running on port ${port}, in ${environment}`);
});