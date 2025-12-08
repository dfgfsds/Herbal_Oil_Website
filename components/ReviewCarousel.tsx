// 'use client'

// import React, { useEffect, useState } from 'react'
// import 'keen-slider/keen-slider.min.css'
// import { useKeenSlider } from 'keen-slider/react'
// import { Star } from 'lucide-react'
// import axios from 'axios'
// import { baseUrl } from '@/api-endpoints/ApiUrls'
// import { useVendor } from '@/context/VendorContext'

// // const reviews = [
// //     {
// //         stars: 5,
// //         text: `Having the distressing experience with some online shops before decided to say “THANK YOU” to all personnel of this store. You are not only friendly but deliver really good products in the shortest possible terms. In a word, I am absolutely happy with my purchase and the service. Everything was perfect!`,
// //         name: 'Virginia Ubert',
// //     },
// //     {
// //         stars: 5,
// //         text: `Fast delivery and the product quality is amazing! Customer support was responsive and polite.`,
// //         name: 'Jonathan Wells',
// //     },
// //     {
// //         stars: 4,
// //         text: `Good experience overall, would purchase again. A bit slow delivery but worth the wait.`,
// //         name: 'Sandra Kim',
// //     },
// // ]

// export default function ReviewCarousel() {
//     const [sliderRef] = useKeenSlider<HTMLDivElement>({
//         loop: true,
//         slides: { perView: 1 },
//     })
//     const { vendorId } = useVendor();
//     const [reviews, setReviews] = useState<any[]>([]);

//     const staticImages = [
//         "https://randomuser.me/api/portraits/women/44.jpg",
//         "https://randomuser.me/api/portraits/men/32.jpg",
//         "https://randomuser.me/api/portraits/women/68.jpg",
//         "https://randomuser.me/api/portraits/men/55.jpg",
//         "https://randomuser.me/api/portraits/women/12.jpg",
//         "https://randomuser.me/api/portraits/men/41.jpg",
//         "https://randomuser.me/api/portraits/women/70.jpg",
//         "https://randomuser.me/api/portraits/men/85.jpg",
//     ];

//     const reviewsGetApi = async () => {
//         try {
//             const res = await axios.get(`${baseUrl}/testimonial/?vendor_id=${vendorId}`);
//             console.log(res)
//             if (res?.data) {
//                 const reviewsWithImages = res?.data?.testimonials?.map((review: any, index: any) => ({
//                     ...review,
//                     img: staticImages[index % staticImages.length],
//                     stars: Math.floor(Math.random() * 3) + 3,
//                 }));
//                 setReviews(reviewsWithImages);
//             } else {
//                 console.warn('Unexpected API response:', res.data);
//             }
//         } catch (error) {
//             console.log('Error fetching banners:', error);
//         }
//     };

//     useEffect(() => {
//         reviewsGetApi();
//     }, [vendorId]);

//     return (
//         <section className="py-10 px-4 bg-white">
//             <div className="text-center mb-8">
//                 <h3 className='text-2xl font-bold text-[#b39e49] mb-10 mt-4 text-center'>What our customer says!</h3>
//             </div>

//             <div ref={sliderRef} className="keen-slider max-w-3xl mx-auto ">
//                 {reviews?.map((review, idx) => (
//                     <div
//                         key={idx}
//                         className="keen-slider__slide p-6 bg-[#b39e49] text-white rounded-lg shadow-md"
//                     >
//                         {/* <div className="flex gap-1 mb-4">
//                             {[...Array(review?.stars)].map((_, i) => (
//                                 <Star key={i} className="w-5 h-5 text-white fill-white" />
//                             ))}
//                         </div> */}
//                         <p className="mb-6 leading-relaxed">{review?.description}</p>
//                         <p className="font-semibold">{review?.title}</p>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     )
// }


'use client'

import React, { useEffect, useState } from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import axios from 'axios'
import { baseUrl } from '@/api-endpoints/ApiUrls'
import { useVendor } from '@/context/VendorContext'

export default function ReviewCarousel() {
  const { vendorId } = useVendor();
  const [reviews, setReviews] = useState<any[]>([]);
  const [perView, setPerView] = useState(3);

  const staticImages = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/men/55.jpg",
    "https://randomuser.me/api/portraits/women/12.jpg",
    "https://randomuser.me/api/portraits/men/41.jpg",
    "https://randomuser.me/api/portraits/women/70.jpg",
    "https://randomuser.me/api/portraits/men/85.jpg",
  ];

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: reviews.length > 3,
    slides: { perView: perView, spacing: 20 },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 15 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 10 },
      },
    },
  });

  const reviewsGetApi = async () => {
    try {
      const res = await axios.get(`${baseUrl}/testimonial/?vendor_id=${vendorId}`);
      if (res?.data) {
        const reviewsWithImages = res?.data?.testimonials?.map((review: any, index: number) => ({
          ...review,
          img: staticImages[index % staticImages.length],
        }));
        setReviews(reviewsWithImages);
        setPerView(reviewsWithImages.length > 3 ? 3 : reviewsWithImages.length);
      }
    } catch (error) {
      console.log('Error fetching testimonials:', error);
    }
  };

  useEffect(() => {
    reviewsGetApi();
  }, [vendorId]);

  return (
    <section className="py-12 px-4 bg-white">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-[#b39e49]">What our customer says!</h3>
      </div>

      <div ref={sliderRef} className="keen-slider max-w-6xl mx-auto">
        {reviews?.map((review, idx) => (
          <div
            key={idx}
            className="keen-slider__slide flex flex-col items-center justify-between bg-[#b39e49] text-white rounded-2xl shadow-lg p-8 text-center transition-transform duration-300 hover:scale-[1.03]"
          >
            {/* Reviewer Image */}
            {/* <img
              src={review?.img}
              alt={review?.title}
              className="w-20 h-20 rounded-full object-cover border-4 border-white mb-4"
            /> */}
    
            {/* Review Text */}
            <p className="text-base leading-relaxed mb-6 italic">
              “{review?.description || 'They were professional and fast. Highly recommend.'}”
            </p>

            {/* Reviewer Name */}
            <p className="font-semibold text-lg">{review?.title || 'Great Service!'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
