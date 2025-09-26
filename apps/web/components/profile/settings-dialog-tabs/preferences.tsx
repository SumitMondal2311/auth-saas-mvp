import { Input } from "@/components/ui/input";
import { UserProfileImage } from "@/components/user-profile-image";
import { userStore } from "@/store/user.store";

export const Preferences = () => {
    const { primaryEmail, primaryPhone } = userStore();
    return (
        <>
            <h2 className="text-lg font-medium">Preferences</h2>
            <section className="flex w-full flex-col divide-y">
                <div className="p-2">
                    <UserProfileImage className="size-20" />
                </div>
                <div className="flex items-center justify-between p-2">
                    <span>Email address</span>
                    <Input disabled value={primaryEmail} className="w-60" />
                </div>
                <div className="flex items-center justify-between p-2">
                    <span>Phone Number</span>
                    <Input disabled value={primaryPhone} className="w-60" />
                </div>
            </section>
        </>
    );
};
