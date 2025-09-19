import { ApiErrorResponse } from "@/types/api-error-response";
import Image from "next/image";

export const CustomError = ({ statusCode, message }: ApiErrorResponse) => {
    return (
        <div className="flex h-screen flex-col items-center justify-center md:flex-row md:divide-x">
            <span className="absolute top-1/4 text-8xl text-neutral-200 md:static xl:text-[150px]">
                {statusCode}
            </span>
            <div className="z-10 flex h-full w-96 flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Image
                        src="/server-issue.png"
                        alt="server-error-icon"
                        height={50}
                        width={50}
                        className="hidden md:inline"
                    />
                    <span className="font-mono text-2xl">Oops! Something went wrong</span>
                </div>
                <span className="bg-destructive/80 rounded px-4 py-1 text-lg text-white">
                    {message}
                </span>
            </div>
        </div>
    );
};
