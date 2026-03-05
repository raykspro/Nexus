import * as React from "react"
import { cn } from "@/lib/utils"

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block text-left">{children}</div>
)

export const DropdownMenuTrigger = ({ children, ...props }: any) => (
  <button {...props} className={cn("focus:outline-none", props.className)}>{children}</button>
)

export const DropdownMenuContent = ({ children, className }: any) => (
  <div className={cn(
    "absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200", 
    className
  )}>
    <div className="py-2 p-1">{children}</div>
  </div>
)

export const DropdownMenuItem = ({ children, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "block w-full px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 rounded-xl transition-colors duration-200", 
      className
    )}
  >
    {children}
  </button>
)
