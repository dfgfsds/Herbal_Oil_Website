'use client';

import { Mail, Phone } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { useState } from 'react';
import axios from 'axios';
import ApiUrls from '@/api-endpoints/ApiUrls';
import toast from 'react-hot-toast';
import { useVendor } from '@/context/VendorContext';

const ContactUs = () => {
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Contact Us', href: '/contactUs', isActive: true },
    ];
    const { vendorId } = useVendor();
    const [form, setForm] = useState({
        name: "",
        email: "",
        description: "",
        contact_number: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(ApiUrls?.sendQuoteRequest, { ...form, vendor_id: vendorId });
            toast.success("Message sent successfully ✅");
            setForm({ name: "", email: "", contact_number: "", description: "" });
        } catch (err: any) {
            console.log(err);
            toast.error(err?.response?.data?.message || "Something went wrong, try again later");
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="">
            <div className="container mx-auto px-4 py-12">
                <Breadcrumb items={breadcrumbItems} />
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
                </div>
            </div>
            <div className='py-5 px-4 sm:px-8 max-w-7xl mx-auto'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Right: Contact Form (66%) */}
                    <div className=" bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                            Have a question about a product, our company, or just want to chat? Email us!
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-2xl">
                            We will be glad to assist you in any question and encourage you to share your ideas and improvements with us.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
                                <input
                                    id="name"
                                    name='name'
                                    value={form.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Name"
                                    className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
                                <input
                                    id="email"
                                    name='email'
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="Mobile" className="block text-sm font-semibold text-gray-800 mb-1">Mobile</label>
                                <input
                                    type="number"
                                    name="contact_number"
                                    value={form.contact_number}
                                    onChange={handleChange}
                                    placeholder="Mobile"
                                    className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Message"
                                    className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#b39e49] text-white px-6 py-2 rounded hover:bg-[#d4b63a] transition"
                            >
                                {/* Submit */}
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>

                    {/* Left: Contact Info (33%) */}
                    <div className="space-y-10">
                        {/* Customer Service */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">CUSTOMER SERVICE</h3>
                            <div className="flex items-start gap-3 text-sm text-gray-700 mt-2">
                                <Phone size={16} className="text-[#b39e49] mt-1" />
                                <div>
                                    <p className="text-gray-400">+91-8754698094</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-700 mt-2">
                                <Mail size={16} className="text-[#b39e49] mt-1" />
                                <div>
                                    <p className="text-gray-400">hussaindoctorherbaloil@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Products & Orders */}
                        {/* <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">PRODUCTS & ORDERS</h3>
                            <div className="flex items-start gap-3 text-sm text-gray-700">
                                <Phone className="text-indigo-600 mt-1" />
                                <div>
                                    <p className="text-gray-400">+91-7788996684</p>
                                    <p>Monday to Friday</p>
                                    <p>10am - 6.30pm (NewYork time)</p>
                                </div>
                            </div>
                        </div> */}

                        {/* Store Location */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">STORE LOCATOR</h3>
                            <p className="text-sm text-gray-700">Raheems Enterprises, 1/141, Main Road</p>
                            <p className="text-sm text-gray-700">Puthagaram, Enangudi, Nagapattinam, Tamil Nadu –  609701 </p>
                            {/* <p className="text-sm text-gray-700">(Near Casino Theatre, Next to Ola Electric Store)</p> */}
                        </div>
                        {/* MAP SECTION */}
                        <div className="mt-12 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.0563087907353!2d79.670346!3d10.883321899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a553f556ecdb38f%3A0xf86ad4ba1339e57b!2sHussain%20Doctor%20Herbal%20Oil!5e0!3m2!1sen!2sin!4v1760007413264!5m2!1sen!2sin"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;

// favicon.ico
