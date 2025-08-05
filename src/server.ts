import app from "./app.js"
import { port, environment } from "./config/server.config.js";

app.listen(port, (err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(`Server running on port ${port}, in ${environment}`);
});