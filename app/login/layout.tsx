import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
};

export default function loginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        {children}
    </>
}
