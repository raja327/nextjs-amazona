"use client"
import { ChevronUp } from "lucide-react";
import {Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="bg-black text-white underline-link">
            <div className="w-full">
                <Button variant={"ghost"} className="bg-gray-100 w-full rounded-none"
                onClick={()=>window.scrollTo({top: 0, behavior: "smooth"})}>
                <ChevronUp className="mr-2 h-4 w-4"/>Back to  top
                </Button>
            </div>
            <div className="p-4">
                <div className="flex justify-center gap-3 text-sm">
                    <Link href={"/page/conditions-of-use"} className="hover:underline">Conditions of use</Link>
                    <Link href={"/page/privacy-policy"} >Privacy policy</Link>
                    <Link href={"/page/help"} >Help</Link>
                </div>
                <div className="flex justify-center text-sm">© {new Date().getFullYear()} {APP_NAME},Inc.or its affiliates</div>
                <div className="mt-8 flex justify-center text-sm text-gray-400">123, Main Street, Kathmandu, Np 10001 |  +977-456-7890</div>
            </div>

        </footer>)}