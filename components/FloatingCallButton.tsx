"use client";

import Link from "next/link";
import { Phone } from "lucide-react"; // or react-icons if u prefer

interface FloatingCallButtonProps {
    phoneNumber?: string;
}

export default function FloatingCallButton({
    phoneNumber = "+918754698094",
}: FloatingCallButtonProps) {
    return (
        <Link
            href={`tel:${phoneNumber}`}
            className="fixed bottom-36 md:bottom-24 left-4 z-50 flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg border border-green-600 transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
            aria-label="Call Us"
        >
            {/* Optional pulsing ring effect */}
            {/* <span className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500 opacity-75 animate-ping"></span> */}

            <Phone size={22} className="sm:size-6 relative z-10" />
        </Link>
    );
}
