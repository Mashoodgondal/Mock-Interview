"use client";
import { useEffect, useRef, useState } from "react";
import NET from "vanta/net"; // ✅ correct import
import * as THREE from "three";

const MeshBackground = ({ children }) => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (!vantaEffect && typeof window !== "undefined") {
            setVantaEffect(
                NET({
                    el: vantaRef.current,
                    THREE,
                    mouseControls: true,
                    touchControls: true,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: 0x3b82f6,
                    backgroundColor: 0xffffff,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div ref={vantaRef} className="min-h-screen w-full relative">
            <div className="absolute inset-0 z-10">{children}</div>
        </div>
    );
};

export default MeshBackground;
