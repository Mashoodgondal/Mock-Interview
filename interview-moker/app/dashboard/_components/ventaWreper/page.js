
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
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 300.0,
                    minWidth: 300.0,
                    scale: 1.0,
                    scaleMobile: 1.0,


                    color: 0x7dd3fc,
                    backgroundColor: 0x0f172a,
                    points: 22.0,
                    maxDistance: 5.0,
                    spacing: 8.0,
                    showDots: true,
                    opacity: 0.4,
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

    );
};

export default MeshBackground;
