"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllApplication } from "@/hooks/use-get-all-application";
import { applicationStore } from "@/store/application.store";
import { useEffect } from "react";

export const Applications = () => {
    const { mutate, isSuccess, data } = useGetAllApplication();
    const { applications, setApplications } = applicationStore();

    useEffect(() => {
        mutate(undefined);
    }, [mutate]);

    useEffect(() => {
        if (isSuccess) {
            setApplications(data.data.applications);
        }
    }, [isSuccess, data, setApplications]);

    return (
        <>
            {applications
                ? applications.map((app, idx) => (
                      <div
                          key={idx}
                          className="hover:bg-accent flex h-60 cursor-pointer items-center justify-center rounded-md border transition-colors"
                      >
                          {app.name}
                      </div>
                  ))
                : Array.from({ length: 5 }, (_, idx) => <Skeleton key={idx} className="h-60" />)}
        </>
    );
};
