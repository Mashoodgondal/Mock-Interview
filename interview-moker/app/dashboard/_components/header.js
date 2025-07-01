"use client";
import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { RiCloseCircleFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const HeaderDashboard = () => {
    const path = usePathname();
    const [nav, setnav] = useState(false);
    const handleNave = () => setnav(!nav);

    return (
        <div>
            <nav className="sticky shadow-sm bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl flex items-center justify-between px-4 py-3 mx-auto">
                    {/* Logo */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
                        Skill
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">
                            Verge
                        </span>
                    </h2>

                    {/* Desktop Nav */}
                    <ul className="hidden md:flex flex-1 justify-center font-bold space-x-12 text-sm">
                        {[
                            { label: "Dashboard", href: "/dashboard" },
                            { label: "Questions", href: "/question" },
                            { label: "Upgrade", href: "/upgrade" },
                            { label: "How it works?", href: "/how" },
                        ].map((item) => (
                            <Link key={item.href} href={item.href}>
                                <li
                                    className={`hover:text-blue-400 transition-all cursor-pointer ${path === item.href
                                            ? "text-indigo-400 font-bold"
                                            : ""
                                        }`}
                                >
                                    {item.label}
                                </li>
                            </Link>
                        ))}
                    </ul>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* User Button (desktop only) */}
                        <div className="hidden md:block">
                            <UserButton />
                        </div>

                        {/* Mobile Toggle */}
                        <div onClick={handleNave} className="md:hidden cursor-pointer">
                            {nav ? (
                                <RiCloseCircleFill size={30} />
                            ) : (
                                <IoMdMenu size={25} />
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            {nav && (
                <div className="md:hidden p-6 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-col space-y-4 font-bold text-gray-700 dark:text-gray-300">
                        {[
                            { label: "Dashboard", href: "/dashboard" },
                            { label: "Questions", href: "/question" },
                            { label: "Upgrade", href: "/upgrade" },
                            { label: "How it works?", href: "/how" },
                        ].map((item) => (
                            <Link key={item.href} href={item.href}>
                                <li
                                    className={`hover:text-blue-400 transition-all cursor-pointer ${path === item.href
                                            ? "text-indigo-400 font-bold"
                                            : ""
                                        }`}
                                >
                                    {item.label}
                                </li>
                            </Link>
                        ))}

                        {/* User Button (mobile) */}
                        <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                            <UserButton />
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeaderDashboard;



// "use client";
// import { useState, useEffect } from "react";
// import { IoMdMenu } from "react-icons/io";
// import { RiCloseCircleFill } from "react-icons/ri";
// import { usePathname } from "next/navigation";

// import Link from "next/link";
// import { UserButton } from "@clerk/nextjs";

// const HeaderDashboard = () => {
//     const path = usePathname();

//     useEffect(() => {
//         console.log("Current path:", path);
//     }, [path]);
//     const [nav, setnav] = useState(false);
//     const handleNave = () => {
//         setnav(!nav);
//     };
//     return (
//         <div >
//             <nav className="  sticky  shadow-sm ">
//                 <div className="max-w-screen-xl flex justify-between px-4 py-3 mx-auto">
//                     <div>
//                         <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
//                             Skill<span className="bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">Verge</span>
//                         </h2>
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <div>
//                             <ul className=" hidden md:flex flex-row font-bold mt-0 space-x-12 rtl:space-x-reverse text-sm">
//                                 <Link href="/dashboard">
//                                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/dashboard' ? 'text-indigo-400 font-bold' : ''}`}>
//                                         Dashboard
//                                     </li>
//                                 </Link>
//                                 <Link href="/question">
//                                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/question' ? 'text-indigo-400 font-bold' : ''}`}>
//                                         Questions
//                                     </li>
//                                 </Link>
//                                 <Link href="/upgrade">
//                                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/upgrade' ? 'text-indigo-400 font-bold' : ''}`}>
//                                         Upgrade
//                                     </li>
//                                 </Link>
//                                 <Link href="/how">
//                                     <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/how' ? 'text-indigo-400 font-bold' : ''}`}>
//                                         How it works?
//                                     </li>
//                                 </Link>

//                             </ul>
//                         </div>
//                         <div>
//                             <UserButton />
//                         </div>
//                         {!nav ? (<div onClick={handleNave} className="md:hidden cursor-pointer">
//                             <IoMdMenu size={25} />
//                         </div>) : (<div
//                             onClick={handleNave}
//                             className=" rounded-full md:hidden  cursor-pointer"
//                         >
//                             <RiCloseCircleFill size={35} />
//                         </div>)}
//                     </div>
//                 </div>
//             </nav>
//             {/* MOBILE Nave */}
//             <div className={`${nav && "md:hidden p-6 w-1/2"}`}>
//                 <div
//                     className={`${nav
//                         ? " w-[80%] sm:w-[70%] md:w-[85%]   ease-in duration-500"
//                         : "fixed left-[-100%] p-10 ease-in duration-1000"
//                         }`}
//                 >

//                     <ul className="flex flex-col uppercase space-y-2 mt-6 font-bold text-gray-600 ml-8 ">
//                         <Link href="/dashboard">
//                             <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/dashboard' ? 'text-indigo-400 font-bold' : ''}`}>
//                                 Dashboard
//                             </li>
//                         </Link>
//                         <Link href="/question">
//                             <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/question' ? 'text-indigo-400 font-bold' : ''}`}>
//                                 Questions
//                             </li>
//                         </Link>
//                         <Link href="/upgrade">
//                             <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/upgrade' ? 'text-indigo-400 font-bold' : ''}`}>
//                                 Upgrade
//                             </li>
//                         </Link>
//                         <Link href="/how">
//                             <li className={`hover:text-blue-400 hover:font-bold transition-all cursor-pointer ${path === '/how' ? 'text-indigo-400 font-bold' : ''}`}>
//                                 How it works?
//                             </li>
//                         </Link>

//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HeaderDashboard;
