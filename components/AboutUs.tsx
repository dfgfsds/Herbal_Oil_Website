'use client';

import Breadcrumb from "./Breadcrumb";

const AboutUs = () => {
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/aboutUs', isActive: true },
    ];

    return (
        <section className="bg-gradient-to-b ">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 mt-5">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Main Section */}
            <div className="mt-5 px-6 sm:px-10 lg:px-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-[#b39e49] mb-6 tracking-wide">
                        About Our Herbal Body Pain Relief Oil
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        <span className="block mb-5">
                            <strong className="text-[#b39e49]">Raheems Herbal Body Pain Relief Oil</strong> is crafted with the wisdom of traditional Ayurvedic herbs and the power of natural essential oils.
                        </span>
                        This oil provides fast and effective relief from muscle stiffness, joint pain, backaches, and body fatigue — without any side effects. 
                        Each drop is made from 100% natural ingredients that help relax muscles, improve blood circulation, and rejuvenate your body.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <div className="w-40 h-1 text-[#b39e49] rounded"></div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-[#b39e49] mb-4">🌿 100% Natural Ingredients</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Made with herbal extracts such as eucalyptus, camphor, and wintergreen — known for their deep-penetrating relief and healing properties.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-[#b39e49] mb-4">💪 Fast Pain Relief</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Provides instant cooling and soothing sensation that helps reduce inflammation, muscle soreness, and stiffness within minutes.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-[#b39e49] mb-4">🌸 Gentle on Skin</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Non-sticky, light, and absorbs quickly — leaving your skin nourished and refreshed with a calming herbal aroma.
                        </p>
                    </div>
                </div>

                {/* Vision / Mission */}
                <div className="mt-24 max-w-5xl mx-auto text-center">
                    <h3 className="text-3xl sm:text-4xl font-bold text-[#b39e49] mb-6">Our Mission & Promise</h3>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                        Our mission is to bring back the power of nature through herbal wellness.  
                        We are committed to producing quality herbal solutions that are safe, effective, and rooted in tradition.  
                        <span className="block mt-4 font-semibold text-[#b39e49]">
                            With Raheems Herbal Oil — let your body heal the natural way.
                        </span>
                    </p>

                    <div className="mt-10 flex justify-center">
                        <div className="w-32 h-1 text-[#b39e49]rounded"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
