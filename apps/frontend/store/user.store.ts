import { ProfileInfo } from "@/types/profile-info";
import { create } from "zustand";

type UserStoreType = {
    profileInfo: ProfileInfo | null;
    setProfileInfo: (info: ProfileInfo) => void;
    primaryEmail: string;
    setPrimaryEmail: (email: string) => void;
    primaryPhone: string;
    setPrimaryPhone: (email: string) => void;
};

export const userStore = create<UserStoreType>((set) => ({
    profileInfo: null,
    setProfileInfo: (info) => set({ profileInfo: info }),
    primaryEmail: "",
    setPrimaryEmail: (email) => set({ primaryEmail: email }),
    primaryPhone: "",
    setPrimaryPhone: (phone) => set({ primaryPhone: phone }),
}));
