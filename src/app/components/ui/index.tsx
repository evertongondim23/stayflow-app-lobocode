import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm',
      outline: 'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900',
      ghost: 'hover:bg-slate-100 hover:text-slate-900',
      destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
      link: 'text-sky-600 underline-offset-4 hover:underline',
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Card
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Avatar
export const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
));
Avatar.displayName = "Avatar";

export const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-500", className)} {...props} />
));
AvatarFallback.displayName = "AvatarFallback";

export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(({ className, ...props }, ref) => (
  <img ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";

// Badge
export const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'border-transparent bg-sky-600 text-white hover:bg-sky-700',
    secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
    destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
    outline: 'text-slate-950',
  };
  return (
    <div ref={ref} className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2", variants[variant], className)} {...props} />
  );
});
Badge.displayName = "Badge";

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
});
Input.displayName = "Input";
