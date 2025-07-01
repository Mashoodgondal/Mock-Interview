// "use client";
// import { useEffect, useRef, useState } from "react";
// import NET from "vanta/dist/vanta.net.min";
// import * as THREE from "three";

// const MeshBackground = ({ children }) => {
//     const vantaRef = useRef(null);
//     const [vantaEffect, setVantaEffect] = useState(null);

//     useEffect(() => {
//         if (!vantaEffect && typeof window !== "undefined") {
//             setVantaEffect(
//                 NET({
//                     el: vantaRef.current,
//                     THREE,
//                     mouseControls: true,
//                     touchControls: true,
//                     minHeight: 200.0,
//                     minWidth: 200.0,
//                     scale: 1.0,
//                     scaleMobile: 1.0,
//                     color: 0x3b82f6,
//                     backgroundColor: 0xffffff,
//                 })
//             );
//         }
//         return () => {
//             if (vantaEffect) vantaEffect.destroy();
//         };
//     }, [vantaEffect]);

//     return (
//         <div ref={vantaRef} className="min-h-screen w-full relative">
//             <div className="absolute inset-0 z-10">{children}</div>
//         </div>
//     );
// };

// export default MeshBackground;


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
                // NET({
                //     el: vantaRef.current,
                //     THREE,
                //     mouseControls: true,
                //     touchControls: true,
                //     minHeight: 200.0,
                //     minWidth: 200.0,
                //     scale: 1.0,
                //     scaleMobile: 1.0,


                //     color: 0x7f5af0,
                //     backgroundColor: 0x0f172a,
                //     points: 10.0,
                //     maxDistance: 25.0, // Distance between points
                //     spacing: 18.0, // Spacing of the mesh grid
                //     showDots: true, // Show connecting nodes
                // })

                NET({
                    el: vantaRef.current,
                    THREE,
                    mouseControls: true,
                    touchControls: true,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,

                    // Colors
                    color: 0x38bdf8,              // Sky blue
                    backgroundColor: 0x0f172a,    // Dark background

                    // Mesh appearance
                    points: 8.0,                  // Fewer points = larger spacing between them
                    maxDistance: 22.0,            // Connection distance
                    spacing: 20.0,                // Wider spacing = dots stand out more
                    showDots: true,               // Enable dots
                    opacity: 0.35,                // Semi-transparent lines
                })


            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div ref={vantaRef} className="min-h-screen w-full relative overflow-hidden">
            <div className="absolute inset-0 z-10">{children}</div>
        </div>
    );
};

export default MeshBackground;
