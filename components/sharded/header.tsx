"use client"

import { CustomTrigger } from "../custom-sidebat-trigger"
import { Menu, User } from "lucide-react"
import { ModeToggle } from "../mode-toggle"

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <CustomTrigger />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <ModeToggle/>
      </div>


    </header>
  )
}

export default Header
