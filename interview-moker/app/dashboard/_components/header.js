

"use client";
import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { RiCloseCircleFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const HeaderDashboard = () => {
    const path = usePathname();
    const [nav, setNav] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const handleNav = () => setNav(!nav);

    // Ensure component is mounted before rendering UserButton
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const menuItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "About", href: "/dashboard/about" },
        { label: "Upgrade", href: "/upgrade" },
        { label: "How it works?", href: "/how" },
    ];

    return (
        <div className="w-full">
            <nav className="sticky top-0 shadow-sm dark:bg-gray-400/30 z-50">
                <div className="max-w-screen-xl flex items-center justify-between px-4 py-3 mx-auto">

                    <Link href='/splash'>
                        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide cursor-pointer">
                            Skill
                            <span className="bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">
                                Verge
                            </span>
                        </h2>
                    </Link>


                    <ul className="hidden md:flex flex-1 justify-center font-bold space-x-12 text-sm text-amber-100 dark:text-amber-100">
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href} className="group">
                                <li
                                    className={`relative cursor-pointer transition-all 
                                        ${path === item.href ? "text-indigo-500 dark:text-indigo-400 font-bold" : "text-gray-800 dark:text-white"}
                                        group-hover:text-blue-400`}
                                >
                                    {item.label}
                                    <span
                                        className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"
                                    ></span>
                                </li>
                            </Link>
                        ))}
                    </ul>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            {isMounted ? (
                                <UserButton />
                            ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                            )}
                        </div>
                        <div onClick={handleNav} className="md:hidden cursor-pointer text-gray-700 dark:text-gray-300">
                            {nav ? <RiCloseCircleFill size={30} /> : <IoMdMenu size={25} />}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {nav && (
                <div className="md:hidden px-6 py-4 w-full bg-white/70 dark:bg-gray-500/50 border-t border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-col space-y-4 font-bold text-gray-700 dark:text-gray-300">
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <li
                                    className={`hover:text-blue-400 transition-all cursor-pointer ${path === item.href
                                        ? "text-indigo-500 dark:text-indigo-400 font-bold"
                                        : ""
                                        }`}
                                >
                                    {item.label}
                                </li>
                            </Link>
                        ))}

                        <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
                            {isMounted ? (
                                <UserButton />
                            ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                            )}
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeaderDashboard;