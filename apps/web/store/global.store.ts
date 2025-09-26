import { create } from "zustand";

type GlobalStoreType = {
    openProfileModel: boolean;
    setOpenProfileModel: (open: boolean) => void;
};

export const globalStore = create<GlobalStoreType>((set) => ({
    openProfileModel: false,
    setOpenProfileModel: (open) => set({ openProfileModel: open }),
}));
