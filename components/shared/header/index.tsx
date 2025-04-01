import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Search from "./search";

import { Button } from "@/components/ui/button";
import { MenuIcon  } from "lucide-react";
import data from "@/lib/data";
import Menu from "./menu";

export default function Header() {
    return (
        <header className="bg-black text-white">
            <div className="px-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href={"/"} className="flex items-center header-button font-extrabold text-2xl m-1">
                        <Image  src="/icons/logo.svg" alt={`${APP_NAME} logo`} width={40} height={40} /> {APP_NAME}
                        </Link>
                    </div>
                    <div className="hidden md:block flex-1 max-w-xl">
                        <Search/>
                    </div>
                    <Menu/>
                </div>
                <div className="flex items-center px-3 mb-[1px] bg-gray-800">
                    <Button variant={"ghost"} className="dark header-button flex items-center gap-1 text-base [&_svg]:size-6">
                        <MenuIcon />
                        All
                    </Button>
                    <div className="flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]">
                        {data.headerMenus.map((menu)=>(<Link key={menu.name} href={menu.href} className="header-button!p-2">{menu.name}</Link>))}
                    </div>
                </div>
            </div>
        </header>
    )
}