import { randomInt } from "crypto";

export const randomOTP = (length: number) => {
    return Array.from(
        {
            length,
        },
        () => randomInt(0, 10)
    ).join("");
};
