"use client"

import { useSidebar } from "./ui/sidebar"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
    >
      {open ? (
        <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {open ? "اغلاق القائمة" : "إظهار القائمة"}
      </span>
    </button>
  )
}
