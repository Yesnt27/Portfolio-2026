"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /* Stagger in ms, applied as a transition delay. */
  delay?: number;
  style?: CSSProperties;
};

/* Fades + lifts its content into place the first time it scrolls into view. */
export default function Reveal({ children, as: Tag = "div", className = "", delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.dataset.reveal = "in";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { ...style, ["--reveal-delay" as string]: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
