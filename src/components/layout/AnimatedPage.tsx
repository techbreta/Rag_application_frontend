// Server-safe AnimatedPage helpers
// This file intentionally avoids client-only libraries (like framer-motion)
// so it can be used in Server Components. For client-side animations use
// `AnimatedPage.client.tsx` which contains the framer-motion implementation.

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedPage({
  children,
  className,
}: AnimatedPageProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  // Server-rendered placeholder — client pages may opt-in to animations
  return (
    <div className={className} data-anim="fade-in" data-anim-delay={delay}>
      {children}
    </div>
  );
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      data-anim="slide-in"
      data-anim-direction={direction}
      data-anim-delay={delay}
    >
      {children}
    </div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={className} data-anim="scale-in" data-anim-delay={delay}>
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-anim="stagger-container">
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-anim="stagger-item">
      {children}
    </div>
  );
}

export function FloatingElement({
  children,
  className,
  duration = 3,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <div
      className={className}
      data-anim="floating"
      data-anim-duration={duration}
    >
      {children}
    </div>
  );
}

export function GlowingOrb({ className }: { className?: string }) {
  return <div className={`absolute rounded-full blur-3xl ${className}`} />;
}
