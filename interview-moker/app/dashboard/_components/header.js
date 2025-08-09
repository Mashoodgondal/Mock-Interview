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
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const menuItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "About", href: "/dashboard/about" },
        { label: "How it works?", href: "/dashboard/how" },
    ];

    return (
        <div className="w-full">
            <nav className="sticky top-0 shadow-sm bg-white/50 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50">
                <div className="max-w-screen-xl flex items-center justify-between px-4 py-3 mx-auto">
                    <Link href='/dashboard'>
                        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent tracking-wide hover:from-cyan-600 hover:to-purple-700 transition-all duration-300">
                            Skill<span className="text-gray-900 dark:text-white">Verge</span>
                        </h2>
                    </Link>

                    <ul className="hidden md:flex flex-1 justify-center font-bold space-x-12 text-sm">
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href} className="group">
                                <li
                                    className={`relative cursor-pointer transition-all duration-300
                                        ${path === item.href
                                            ? "text-indigo-600 dark:text-indigo-400 font-bold"
                                            : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                                        }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 
                                            ${path === item.href ? "w-full" : "w-0 group-hover:w-full"}`}
                                    ></span>
                                </li>
                            </Link>
                        ))}
                    </ul>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            {isMounted ? (
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8",
                                            userButtonPopoverCard: "bg-white dark:bg-gray-800",
                                            userButtonPopoverActionButtonText: "text-gray-700 dark:text-gray-200",
                                            userButtonPopoverFooter: "bg-gray-50 dark:bg-gray-700/50"
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            )}
                        </div>
                        <div
                            onClick={handleNav}
                            className="md:hidden cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                        >
                            {nav ? <RiCloseCircleFill size={30} /> : <IoMdMenu size={25} />}
                        </div>
                    </div>
                </div>
            </nav>

            {nav && (
                <div className="md:hidden fixed top-[73px] left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg z-40">
                    <div className="px-6 py-4">
                        <ul className="flex flex-col space-y-4 font-medium">
                            {menuItems.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setNav(false)}>
                                    <li
                                        className={`py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer
                                            ${path === item.href
                                                ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30"
                                                : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            }`}
                                    >
                                        {item.label}
                                    </li>
                                </Link>
                            ))}

                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    {isMounted ? (
                                        <UserButton
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-8 h-8",
                                                    userButtonPopoverCard: "bg-white dark:bg-gray-800",
                                                    userButtonPopoverActionButtonText: "text-gray-700 dark:text-gray-200",
                                                    userButtonPopoverFooter: "bg-gray-50 dark:bg-gray-700/50"
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderDashboard;