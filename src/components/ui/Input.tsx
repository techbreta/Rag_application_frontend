"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 shadow-xs text-sm",
              icon && "pl-10",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600" />
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;