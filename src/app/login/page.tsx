"use client";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <React.Fragment>Loading...</React.Fragment>;
  }
  if (session) {
    redirect("/dashboard");
  }

  return (
    <React.Fragment>
      <button onClick={() => signIn("okta")}>Sign in with Okta</button>
    </React.Fragment>
  );
}
