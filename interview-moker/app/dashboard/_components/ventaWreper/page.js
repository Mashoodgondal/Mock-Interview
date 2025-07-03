
"use client";
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
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
                    mouseControls: false,
                    touchControls: true,
                    gyroControls: true,
                    minHeight: 300.0,
                    minWidth: 300.0,
                    scale: 1.0,
                    scaleMobile: 1.0,

                    // Professional cool-toned colors for dark mode
                    color: 0x7dd3fc,              // Soft sky blue dots/lines
                    backgroundColor: 0x0f172a,    // Dark slate background
                    points: 22.0,                 // Denser dot count for subtle mesh
                    maxDistance: 5.0,           // More connected mesh feel
                    spacing: 8.0,               // Slightly tighter mesh
                    showDots: true,
                    opacity: 0.4,                // More visible lines but not overwhelming
                })




            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div ref={vantaRef} className="min-h-screen w-full relative">
            <div className="absolute inset-0 -z-10"></div>
            <div className="relative z-10">{children}</div>
        </div>

        // <div ref={vantaRef} className="min-h-full w-full relative">
        //     <div className="absolute inset-0 z-10">{children}</div>
        // </div>
    );
};

export default MeshBackground;
