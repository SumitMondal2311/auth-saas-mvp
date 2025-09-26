export const maskedEmail = (email: string): string => {
    const [username, domain] = email.split("@");
    if (username.length <= 5) {
        return `${username[0]}${Array.from(
            {
                length: username.length - 1,
            },
            () => "*"
        ).join("")}@${domain}`;
    }

    return `${username[0]}${Array.from(
        {
            length: username.length - 2,
        },
        () => "*"
    ).join("")}${username[username.length - 1]}@${domain}`;
};
