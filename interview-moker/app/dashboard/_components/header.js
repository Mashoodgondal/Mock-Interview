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
            <nav className="sticky shadow-sm bg-transparent">
                <div className="max-w-screen-xl flex items-center justify-between px-4 py-3 mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
                        Skill
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent">
                            Verge
                        </span>
                    </h2>


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


                    <div className="flex items-center space-x-4">

                        <div className="hidden md:block">
                            <UserButton />
                        </div>


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


            {nav && (
                <div className="md:hidden p-6 w-full bg-transparent border-t border-gray-200">
                    <ul className="flex flex-col space-y-4 font-bold text-gray-700">
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


                        <div className="pt-4 border-t border-gray-300">
                            <UserButton />
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeaderDashboard;



