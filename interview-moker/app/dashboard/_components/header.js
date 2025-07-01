


// "use client";

// import React, { useEffect } from 'react';
// import { UserButton } from '@clerk/nextjs';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';
// // import Image from 'next/image';
// // import img from '../../../public/logo.jpeg'

// const HeaderDashboard = () => {
//     const path = usePathname();

//     useEffect(() => {
//         console.log("Current path:", path);
//     }, [path]);

//     return (
//         <div className='flex flex-row items-center justify-between bg-transparent p-4'>
//             <Link href='/'>
//                 {/* <Image src={img} alt='logo' width={20} height={200} /> */}
// <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
//     Skill<span className="bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">Verge</span>
// </h2>
//             </Link>

//             <ul className="hidden md:flex gap-6">
// <Link href="/dashboard">
//     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/dashboard' ? 'text-indigo-400 font-bold' : ''}`}>
//         Dashboard
//     </li>
// </Link>
// <Link href="/question">
//     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/question' ? 'text-indigo-400 font-bold' : ''}`}>
//         Questions
//     </li>
// </Link>
// <Link href="/upgrade">
//     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/upgrade' ? 'text-indigo-400 font-bold' : ''}`}>
//         Upgrade
//     </li>
// </Link>
// <Link href="/how">
//     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/how' ? 'text-indigo-400 font-bold' : ''}`}>
//         How it works?
//     </li>
// </Link>
//             </ul>

//             <UserButton />
//         </div>
//     );
// };

// export default HeaderDashboard;



"use client";
import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { RiCloseCircleFill } from "react-icons/ri";
import { usePathname } from "next/navigation";

import Link from "next/link";

const HeaderDashboard = () => {
    const path = usePathname();

    useEffect(() => {
        console.log("Current path:", path);
    }, [path]);
    const [nav, setnav] = useState(false);
    const handleNave = () => {
        setnav(!nav);
    };
    return (
        <div >
            <nav className="  sticky  shadow-sm ">
                <div className="max-w-screen-xl flex justify-between px-4 py-3 mx-auto">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
                            Skill<span className="bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">Verge</span>
                        </h2>
                    </div>

                    <div className="flex items-center justify-center ">
                        <ul className=" hidden md:flex flex-row font-bold mt-0 space-x-12 rtl:space-x-reverse text-sm">
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
                        {!nav ? (<div onClick={handleNave} className="md:hidden cursor-pointer">
                            <IoMdMenu size={25} />
                        </div>) : (<div
                            onClick={handleNave}
                            className=" rounded-full md:hidden  cursor-pointer"
                        >
                            <RiCloseCircleFill size={35} />
                        </div>)}
                    </div>
                </div>
            </nav>
            {/* MOBILE Nave */}
            <div className={`${nav && "md:hidden p-6 w-1/2"}`}>
                <div
                    className={`${nav
                        ? " w-[80%] sm:w-[70%] md:w-[85%]   ease-in duration-500"
                        : "fixed left-[-100%] p-10 ease-in duration-1000"
                        }`}
                >
                    {/* <div className=" p-8    flex item-center justify-between"> */}
                    {/* <div>
                            <a href="#" className="text-yellow-500 text-3xl font-bold">
                                Port<span className="text-indigo-600">folio</span>
                                <span className="text-yellow-500 text-4xl">.</span>
                            </a>
                        </div> */}
                    {/* <div
                            onClick={handleNave}
                            className=" rounded-full  cursor-pointer"
                        >
                            <RiCloseCircleFill size={35} />
                        </div> */}
                    {/* </div> */}
                    <ul className="flex flex-col uppercase space-y-2 mt-6 font-bold text-gray-600 ml-8 ">
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
                </div>
            </div>
        </div>
    );
};

export default HeaderDashboard;
