"use client"

import { Search, Zap } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import useCommandCenter from "./useCommandCenter"
import { CaptionBrand } from "../typography"
// import { motion, AnimatePresence } from "framer-motion";

export default function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false)

  const commands = useCommandCenter()

  return (
    <div className="fixed bottom-8 right-0 px-4 md:px-6 lg:px-8 z-10 max-w-2xl">
      <div className="bg-sky-700 shadow-xl rounded-xl overflow-hidden p-2">
        {/* Contextual Quick Actions */}
        {isOpen && (
          <div className="border-b border-sky-200 pb-2 flex flex-row flex-wrap gap-2">
            {commands.map((c) => {
              return (
                <QuickActionBtn
                  key={c.label}
                  icon={<c.icon className="size-4 lg:size-5 text-sky-700" />}
                  label={c.label}
                  action={c.action}
                />
              )
            })}
          </div>
        )}

        {/* Search / Action Bar */}
        <div className={`flex items-center ${isOpen ? "pt-2" : ""} gap-2`}>
          {isOpen && (
            <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-sky-700 mr-2" />
              <input
                type="text"
                placeholder="Search vehicle or driver..."
                className="bg-transparent text-sm text-sky-700 outline-none w-full"
              />
            </div>
          )}

          <Button
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white hover:bg-sky-50 text-sky-700 p-3 rounded-lg transition-colors"
          >
            <Zap className={`size-5 ${isOpen ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}

function QuickActionBtn({
  icon,
  label,
  action,
}: {
  icon: any
  label: string
  action: () => void
}) {
  return (
    <button
      onClick={() => {
        action()
      }}
      className="flex bg-white gap-1 items-center justify-center p-2.5 lg:p-3 rounded-lg transition-all hover:bg-sky-50"
    >
      {icon}
      <CaptionBrand>{label}</CaptionBrand>
    </button>
  )
}
