import BestSellers from "@/components/BestSellers";
import Categories from "@/components/CategoriesSlider";
import HeroSection from "@/components/HeroSection";
import ReviewCarousel from "@/components/ReviewCarousel";
import SpecialSection from "@/components/SpecialSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Categories />
      <BestSellers />
      <ReviewCarousel />
      <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
            About Raheems Enterprises
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            <span className="block mb-5">
              <strong className="text-[#b39e49]">Raheems Herbal Body Pain Relief Oil</strong> is crafted with the wisdom of traditional Ayurvedic herbs and the power of natural essential oils.
            </span>
            This oil provides fast and effective relief from muscle stiffness, joint pain, backaches, and body fatigue — without any side effects.
            Each drop is made from 100% natural ingredients that help relax muscles, improve blood circulation, and rejuvenate your body.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="w-32 h-1 bg-[#E1D6A8] rounded"></div>
          </div>
        </div>
      </div>
      {/* <div className="w-full max-w-3xl mx-auto my-8 px-4">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/azYMOjWgMCs?si=hW3TK9AdmXBlT0TW"
            title="BMC Introduction Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      </div> */}

      <SpecialSection />
    </div>
  );
}