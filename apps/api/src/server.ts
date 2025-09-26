import { app, startTime } from "./app.js";
import { connectDB, disconnectDB } from "./configs/database-lifecycle.js";
import { env } from "./configs/env.js";

await (async () => {
    try {
        await connectDB();
        const server = app.listen(env.PORT, () => {
            console.log(`Ready in ${new Date().getTime() - startTime}ms`);
            console.log("Server is listening on port:", env.PORT);
        });

        let shuttingDown = false;

        ["SIGTERM", "SIGINT"].forEach((signal) => {
            process.on(signal, () => {
                if (shuttingDown) return;
                shuttingDown = true;

                console.log(`Recieved ${signal}, shutting down gracefully...`);

                server.close(() => {
                    void (async () => {
                        console.log("HTTP server closed");
                        await disconnectDB();
                        process.exit(0);
                    })();
                });
            });
        });

        process.on("unhandledRejection", (error: Error) => {
            console.error("Unhandled Rejected Error:", error);
            process.exit(1);
        });

        process.on("uncaughtException", (error: Error) => {
            console.error("Uncaught Exception Error:", error);
            process.exit(1);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
    }
})();
