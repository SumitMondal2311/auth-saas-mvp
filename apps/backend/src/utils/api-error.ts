export class APIError extends Error {
    statusCode: number;

    constructor(
        statusCode: number,
        {
            message,
        }: {
            message: string;
        }
    ) {
        super(message);

        this.statusCode = statusCode;
    }

    toJSON() {
        return {
            name: "API-Error",
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}
