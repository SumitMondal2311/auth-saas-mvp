import EmailVerificationForm from "./form";
import Loader from "./loader";

export default function EmailVerificationPage() {
    return (
        <Loader>
            <EmailVerificationForm />
        </Loader>
    );
}
