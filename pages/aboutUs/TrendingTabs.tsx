"use client";
import { useState, useEffect } from "react";
import TabsData from "./TabsData.json";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function TrendingTabs() {
    const [activeTab, setActiveTab] = useState("gallery");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // default mobile = 5

    // ✅ Detect screen size and adjust items per page
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(10); // Desktop (lg breakpoint)
            } else {
                setItemsPerPage(5); // Mobile/tablet
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    const tabs = [
        { id: "gallery", label: "Gallery" },
        { id: "videos", label: "Videos" },
        { id: "customers", label: "Happy Customers" },
    ];

    const getItemsForPage = (items: any[]) => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    };

    const items =
        activeTab === "gallery"
            ? TabsData.gallery
            : activeTab === "videos"
                ? TabsData.videos
                : TabsData.customers;

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">

            {/* Tabs */}
            <div className="overflow-x-auto scrollbar-hide mb-6">
                <div className="flex gap-4 md:gap-6 border-b border-gray-200 px-2 md:px-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setPage(1);
                            }}
                            className={`relative flex-shrink-0 px-4 py-2 font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "text-[#b39e49] border-b-2 border-[#b39e49]"
                                : "text-gray-500 hover:text-[#d4b63a]"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {getItemsForPage(items).map((item, idx) => {
                    const isTrending = idx === 0; // First item marked as trending
                    return (
                        <div
                            key={item.id}
                            className={`relative overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl ${isTrending ? "lg:col-span-2 lg:row-span-2" : ""}`}
                        >
                            {activeTab === "videos" ? (
                                <div className="px-4 sm:px-0">
                                    <div className="">
                                        <iframe
                                            className="w-full aspect-video rounded-2xl"
                                            src={item.src}
                                            title={`YouTube video ${item.id}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        ></iframe>

                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={item.src}
                                    alt={`${activeTab} ${item.id}`}
                                    className="w-full md:h-48 sm:h-60 lg:h-full object-cover"
                                />
                            )}

                            {/* TRENDING Badge */}
                            {/* {isTrending && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  TRENDING
                </span>
              )} */}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2 items-center flex-wrap">
                <button
                    onClick={() => page > 1 && setPage(page - 1)}
                    className="px-3 py-2 rounded-full bg-gray-100 hover:bg-[#d4b63a] text-gray-700"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 sm:px-4 py-2 rounded-full font-semibold transition ${page === i + 1
                            ? "bg-[#b39e49] text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-[#d4b63a]"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => page < totalPages && setPage(page + 1)}
                    className="px-3 py-2 rounded-full bg-gray-100 hover:bg-[#d4b63a] text-gray-700"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}