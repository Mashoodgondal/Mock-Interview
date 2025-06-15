// "use client"
// import React, { useEffect } from 'react'
// // import Image from 'next/image'
// import { UserButton } from '@clerk/nextjs'
// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// const HeaderDashboard = () => {
//     const path = usePathname;
//     useEffect(() => {
//         console.log(path);

//     }, [])
//     return (
//         <div className='flex flex-row items-center justify-between bg-transparent p-4'>
//             <Link href='/'> <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
//                 Skill<span className=" bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">Verge</span>
//             </h2></Link>
//             <ul className="hidden md:flex gap-6">
//                 <Link href="/dashboard">
//                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/dashboard' ? 'text-indigo-400 font-bold' : ''}`}>Dashboard</li>
//                 </Link>
//                 <Link href="/question">
//                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/question' ? 'text-indigo-400 font-bold' : ''}`}>Questions</li>
//                 </Link>
//                 <Link href="/upgrade">
//                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/upgrade' ? 'text-indigo-400 font-bold' : ''}`}>Upgrade</li>
//                 </Link>
//                 <Link href="/how">
//                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/how' ? 'text-indigo-400 font-bold' : ''}`}>How it works?</li>
//                 </Link>
//             </ul>
//             <UserButton />
//         </div>
//     )
// }

// export default HeaderDashboard


"use client";

import React, { useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const HeaderDashboard = () => {
    const path = usePathname(); // ✅ FIXED: correctly calling the hook

    useEffect(() => {
        console.log("Current path:", path);
    }, [path]);

    return (
        <div className='flex flex-row items-center justify-between bg-transparent p-4'>
            <Link href='/'>
                <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
                    Skill<span className="bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">Verge</span>
                </h2>
            </Link>

            <ul className="hidden md:flex gap-6">
                <Link href="/dashboard">
                    <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/dashboard' ? 'text-indigo-400 font-bold' : ''}`}>
                        Dashboard
                    </li>
                </Link>
                <Link href="/question">
                    <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/question' ? 'text-indigo-400 font-bold' : ''}`}>
                        Questions
                    </li>
                </Link>
                <Link href="/upgrade">
                    <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/upgrade' ? 'text-indigo-400 font-bold' : ''}`}>
                        Upgrade
                    </li>
                </Link>
                <Link href="/how">
                    <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/how' ? 'text-indigo-400 font-bold' : ''}`}>
                        How it works?
                    </li>
                </Link>
            </ul>

            <UserButton />
        </div>
    );
};

export default HeaderDashboard;
