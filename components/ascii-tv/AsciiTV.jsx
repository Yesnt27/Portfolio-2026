"use client";

import { useEffect, useRef } from "react";
import "./ascii-tv.css";

export default function AsciiTV({ className = "", ...options }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let dispose;
        let cancelled = false;

            // Lazy-load the scene code (and three.js) only on the client.
        import('./createAsciiTV').then(({ createAsciiTV }) => {
        if (!cancelled) dispose = createAsciiTV(containerRef.current, options);
        });

        // Cleanup on unmount (also covers React Strict Mode's double-mount in dev).
        return () => {
        cancelled = true;
        dispose?.();
        };
        // Options are read once on mount. Change the `key` prop to rebuild with new options.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
        ref={containerRef}
        className={className}
        role="img"
        aria-label="Old television drawn in ASCII characters, showing the Frends Ga-lore app icon and a Peak Prep walkthrough"
        // pointer-events: none so the empty parts of the box never block the
        // page; the screen itself opts back in for its hover (ascii-tv.css).
        style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}
        />
    );
    }
