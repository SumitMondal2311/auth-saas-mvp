import { User } from "@/types/user";
import { create } from "zustand";

type UserStoreType = {
    user: User | null;
    setUser: (user: User) => void;
};

export const userStore = create<UserStoreType>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
