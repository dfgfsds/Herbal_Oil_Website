// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { formatDate, slugConvert } from "../../../lib/utils";
// import ReactMarkdown from "react-markdown";
// import axios from "axios";
// import { useVendor } from "@/context/VendorContext";
// import { baseUrl } from "@/api-endpoints/ApiUrls";

// interface Blog {
//     id: number;
//     title: string;
//     content: string;
//     banner_url: string;
//     created_at: string;
//     author: string;
// }

// export default function BlogDetail() {
//     const params = useParams();
//     const [blog, setBlog] = useState<Blog | null>(null);
//     const [loading, setLoading] = useState(true);
//     const { vendorId } = useVendor();

//     useEffect(() => {
//         const fetchBlog = async () => {
//             try { // change later if needed
//                 const response = await axios.get(
//                     `${baseUrl}/blog/?vendor_id=${vendorId}`
//                 );

//                 const blogs: Blog[] = response.data?.blogs || [];
//                 const found = blogs.find(
//                     (b) => slugConvert(b.title) === params.id
//                 );
//                 setBlog(found || null);
//             } catch (error) {
//                 console.error("Error fetching blog:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (params?.id) {
//             fetchBlog();
//         }
//     }, [params?.id,vendorId]);

//     if (loading) {
//         return <div className="text-center py-20">Loading blog...</div>;
//     }

//     if (!blog) {
//         return <div className="text-center py-20">Blog not found</div>;
//     }

//     return (
//         <div className="max-w-4xl mx-auto py-16 px-6">
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
//             <div className="text-sm text-gray-400 mb-6">
//                 {formatDate(blog.created_at)} · by {blog.author}
//             </div>

//             <div className="relative w-full h-96 mb-8">
//                 <Image
//                     src={blog.banner_url}
//                     alt={blog.title}
//                     // fill
//                     height={500}
//                     width={800}
//                     className="object-cover rounded-lg"
//                 />
//             </div>

//             <div className="prose prose-lg prose-gray max-w-none leading-relaxed mt-10">
//                 <ReactMarkdown>{blog.content}</ReactMarkdown>
//             </div>
//         </div>
//     );
// }

import { GetServerSideProps } from "next";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { formatDate, slugConvert } from "../../../lib/utils";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";

interface Blog {
    id: number;
    title: string;
    content: string;
    banner_url: string;
    created_at: string;
    author: string;
    description:string;
}

interface BlogDetailProps {
    blog: Blog | null;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
    if (!blog) {
        return <div className="text-center py-20 text-gray-600 text-lg">Blog not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            {/* ===== Blog Title Section ===== */}
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
                    {blog.title}
                </h1>
                <div className="w-24 h-1 bg-[#b39e49] mx-auto mb-4 rounded-full"></div>
                <p className="text-sm text-gray-500">
                    {formatDate(blog.created_at)} &nbsp;•&nbsp; by{" "}
                    <span className="font-medium text-gray-700">{blog.author}</span>
                </p>
            </div>

            {/* ===== Banner Image ===== */}
            <div className="relative w-full mb-10">
                <Image
                    src={blog.banner_url}
                    alt={blog.title}
                    height={500}
                    width={800}
                    className="object-cover rounded-xl shadow-md w-auto h-auto mx-auto"
                />
            </div>

            {/* ===== Description Section ===== */}
            {blog?.description && (
                <section className="mt-12">
                    <h2 className="text-2xl  font-bold text-[#b39e49] mb-4 text-center uppercase tracking-wide">
                        Description
                    </h2>
                    <div className="w-16 h-1 bg-[#b39e49] mx-auto mb-6 rounded-full"></div>
                    <div
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                        className="quill-content prose prose-lg prose-gray max-w-none leading-relaxed text-gray-700"
                    />
                </section>
            )}

            {/* ===== Content Section ===== */}
            {blog?.content && (
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-[#b39e49] mb-4 text-center uppercase tracking-wide">
                        Content
                    </h2>
                    <div className="w-16 h-1 bg-[#b39e49] mx-auto mb-6 rounded-full"></div>
                    <div
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                        className="quill-content prose prose-lg prose-gray max-w-none leading-relaxed text-gray-700"
                    />
                </section>
            )}
        </div>
    );
}


// ✅ SSR fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };

    try {
        // fetch blogs by vendor (if vendor is fixed, you can hardcode or fetch via context/session)
        const vendorId = 114; // replace with dynamic vendorId if needed
        const response = await axios.get(`https://test-ecomapi.justvy.in/blog/?vendor_id=${vendorId}`);
        const blogs: Blog[] = response.data?.blogs || [];
        const found = blogs.find((b) => slugConvert(b.title) === id);

        return {
            props: {
                blog: found || null,
            },
        };
    } catch (error) {
        console.error("Error fetching blog:", error);
        return {
            props: {
                blog: null,
            },
        };
    }
};


