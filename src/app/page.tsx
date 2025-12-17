"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { SignInButton, UserButton } from "@clerk/nextjs"

const HomePage = () => {
  return (
    <div>
      <SignInButton />
      <ThemeToggle />
      <UserButton />
    </div>
  )
}

export default HomePage