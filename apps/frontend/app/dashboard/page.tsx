import { ManageAccountModal } from "@/components/features/user/manage-account-modal";
import { ProfileMenuTrigger } from "@/components/features/user/profile-menu-trigger";

export default function DashboardPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <ManageAccountModal />
            <ProfileMenuTrigger />
            Welcome, User
        </div>
    );
}
