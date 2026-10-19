import { ENV } from "./config/env.js";
import app from "./server.js";

app.listen(ENV.PORT, "0.0.0.0", () => {
    console.log(`Server is running on ${ENV.PORT}`);
});

