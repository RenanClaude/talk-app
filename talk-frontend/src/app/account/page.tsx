import { AccountPage } from "@/components/Pages/Account";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha conta",
};

const Account = () => <AccountPage />;

export default Account;
