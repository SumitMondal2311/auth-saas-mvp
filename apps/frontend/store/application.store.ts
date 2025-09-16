import { Application } from "@/types/application";
import { create } from "zustand";

type ApplicationStoreType = {
    usernameLogIn: boolean;
    setUsernameLogIn: (state: boolean) => void;
    phoneLogIn: boolean;
    setPhoneLogIn: (state: boolean) => void;
    githubLogIn: boolean;
    setGithubLogIn: (state: boolean) => void;
    applications: Application[];
    setApplications: (application: Application[]) => void;
};

export const applicationStore = create<ApplicationStoreType>((set) => ({
    usernameLogIn: false,
    setUsernameLogIn: (state) => set({ usernameLogIn: state }),
    phoneLogIn: false,
    setPhoneLogIn: (state) => set({ phoneLogIn: state }),
    githubLogIn: false,
    setGithubLogIn: (state) => set({ githubLogIn: state }),
    applications: [],
    setApplications: (applications) => set({ applications }),
}));
