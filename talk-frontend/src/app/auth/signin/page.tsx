import { SignInPage } from "@/components/Pages/SignIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const SignIn = () => <SignInPage />;

export default SignIn;
