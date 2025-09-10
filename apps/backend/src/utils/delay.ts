export const delay = async (delay: number): Promise<void> => {
    await new Promise((res) => setTimeout(res, delay));
};
