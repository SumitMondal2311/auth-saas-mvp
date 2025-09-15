import { Application } from "@/types/application";
import { create } from "zustand";

type ApplicationStoreType = {
    usernameOpt: boolean;
    setUsernameOpt: (state: boolean) => void;
    phoneOpt: boolean;
    setPhoneOpt: (state: boolean) => void;
    githubOpt: boolean;
    setGithubOpt: (state: boolean) => void;
    applications: Application[];
    setApplications: (application: Application[]) => void;
};

export const applicationStore = create<ApplicationStoreType>((set) => ({
    usernameOpt: false,
    setUsernameOpt: (state) => set({ usernameOpt: state }),
    phoneOpt: false,
    setPhoneOpt: (state) => set({ phoneOpt: state }),
    githubOpt: false,
    setGithubOpt: (state) => set({ githubOpt: state }),
    applications: [],
    setApplications: (applications) => set({ applications }),
}));
