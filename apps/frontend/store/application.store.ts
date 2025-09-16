import { Application } from "@/types/application";
import { create } from "zustand";

type ApplicationStoreType = {
    username?: boolean;
    setUsername: (state: boolean) => void;
    phone?: boolean;
    setPhone: (state: boolean) => void;
    github?: boolean;
    setGithub: (state: boolean) => void;
    applications: Application[];
    setApplications: (application: Application[]) => void;
};

export const applicationStore = create<ApplicationStoreType>((set) => ({
    username: false,
    setUsername: (state) => set({ username: state }),
    phone: false,
    setPhone: (state) => set({ phone: state }),
    github: false,
    setGithub: (state) => set({ github: state }),
    applications: [],
    setApplications: (applications) => set({ applications }),
}));
