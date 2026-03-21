"use client";

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function HeaderAuth() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="px-4 py-2 rounded border border-black text-sm hover:bg-black hover:text-white transition-colors">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 rounded bg-black text-white text-sm hover:bg-zinc-700 transition-colors">
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}
