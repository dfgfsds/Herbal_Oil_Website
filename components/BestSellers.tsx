// 'use client';

// import React, { useEffect, useState } from 'react';
// import Slider from 'react-slick';
// import { Heart, ShoppingCart } from 'lucide-react';
// import ProductModal from './model/ProductModal';
// import { useProducts } from '@/context/ProductsContext';
// import Link from 'next/link';
// import Image from 'next/image';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
// import { useVendor } from '@/context/VendorContext';
// import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
// import LoginModal from './model/LoginModel';
// import { useCartItem } from '@/context/CartItemContext';
// import { slugConvert } from '@/lib/utils';
// import { useWishList } from '@/context/WishListContext';
// import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';

// const BestSellers = () => {
//     const [getUserId, setUserId] = useState<string | null>(null);
//     const [getCartId, setCartId] = useState<string | null>(null);
//     const [getUserName, setUserName] = useState<string | null>(null);
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [signInmodal, setSignInModal] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const { products, isLoading }: any = useProducts();
//     const { vendorId } = useVendor();
//     const queryClient = useQueryClient();
//     const { cartItem }: any = useCartItem();
//     const { wishList, wishListLoading }: any = useWishList();
//     const router = useRouter();

//     useEffect(() => {
//         setUserId(localStorage.getItem('userId'));
//         setCartId(localStorage.getItem('cartId'));
//         setUserName(localStorage.getItem('userName'));
//     }, []);

//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 5,
//         slidesToScroll: 1,
//         responsive: [
//             { breakpoint: 1024, settings: { slidesToShow: 3 } },
//             { breakpoint: 768, settings: { slidesToShow: 2 } },
//             { breakpoint: 640, settings: { slidesToShow: 1 } },
//         ],
//     };

//     const matchingProductsArray = products?.data?.map((product: any, index: number) => {
//         const matchingCartItem = cartItem?.data?.find(
//             (item: any) => item?.product === product?.id
//         );

//         if (matchingCartItem) {
//             return {
//                 ...product,
//                 Aid: index,
//                 cartQty: matchingCartItem?.quantity,
//                 cartId: matchingCartItem.id,
//             };
//         }

//         return product;
//     });


//     const finalProductData = matchingProductsArray?.map((item: any) => {
//         const wishLists = wishList?.data?.find(
//             (wish: any) => wish?.product === item?.id
//         );
//         return {
//             ...item,
//             isLike: !!wishLists,
//             wishListId: wishLists?.id
//         };
//     });


//     const handleAddCart = async (id: any, qty: any) => {
//         const payload = {
//             cart: getCartId,
//             product: id,
//             user: getUserId,
//             vendor: vendorId,
//             quantity: qty,
//             created_by: getUserName ? getUserName : 'user',
//         };
//         try {
//             const response = await postCartitemApi(``, payload);
//             if (response) {
//                 queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
//             }
//         } catch (error) { }
//     };

//     const handleUpdateCart = async (id: any, type: any, qty: any) => {
//         try {
//             if (qty === 1) {
//                 const updateApi = await deleteCartitemsApi(`${id}`);
//                 if (updateApi) {
//                     queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
//                 }
//             } else {
//                 const response = await updateCartitemsApi(`${id}/${type}/`);
//                 if (response) {
//                     queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
//                 }
//             }
//         } catch (error) { }
//     };

//     // Skeleton loader for 5 slides
//     const skeletonArray = Array(5).fill(null);

//     const handleWishList = async (product: any) => {
//         try {
//             await postWishListApi('', {
//                 user: getUserId,
//                 product: product.id,
//                 vendor: vendorId,
//                 created_by: vendorId ? `user${vendorId}` : 'user'
//             });
//             toast.success('Product added in wishlist!');
//             queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleDeleteWishList = async (product: any) => {
//         try {
//             await deleteWishListApi(`${product?.wishListId}`, {
//                 deleted_by: vendorId ? `user${vendorId}` : 'user'
//             });
//             toast.success('Product removed from wishlist!');
//             queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);

//         } catch (error) {
//             console.log(error);
//         }
//     };


//     return (
//         <section className="bg-white">
//             <h2 className=" text-3xl font-bold  text-[#b39e49] mb-2 mt-6 text-center ">
//                 Shop Best Sellers
//             </h2>
//             <div className="flex justify-end">
//                 <Link href="/products">
//                     <button className="text-sm px-4 py-1.5 mr-6 border border-[#b39e49] text-[#b39e49] rounded-md shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
//                         View all
//                     </button>
//                 </Link>
//             </div>

//             {isLoading ? (
//                 <Slider {...settings}>
//                     {skeletonArray.map((_, idx) => (
//                         <div key={idx} className="px-2 my-4">
//                             <div className="bg-white h-[400px] rounded-md overflow-hidden border border-gray-200 p-4 animate-pulse">
//                                 <div className="bg-gray-200 h-52 w-full mb-4 rounded"></div>
//                                 <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
//                                 <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
//                                 <div className="h-10 bg-gray-200 rounded w-full"></div>
//                             </div>
//                         </div>
//                     ))}
//                 </Slider>
//             ) : (
//                 <Slider {...settings}>
//                     {finalProductData?.slice(0, 10)?.map((product: any, index: number) => (
//                         <div key={index} className="px-2 my-4"
//                         >
//                             <div className="bg-white relative h-auto rounded-md group hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
//                                 {/* Product Image */}
//                                 <div className="relative p-4">
//                                     <Image
//                                         src={product?.image_urls[0]}
//                                         alt={product?.name}
//                                         width={280}
//                                         height={280}
//                                         className="h-24 w-40 object-contain mx-auto"
//                                         onClick={() => router.push(`/products/${slugConvert(product.name)}`)}
//                                     />

//                                     {/* Wishlist Button */}
//                                     {/* This assumes the button's immediate parent is the product image container, which has 'relative' positioning. */}
//                                     {product?.isLike ? (
//                                         <button
//                                             onClick={() => handleDeleteWishList(product)}
//                                             // The key changes are in positioning and visibility:
//                                             className="absolute top-4 right-4 
//                    md:opacity-0 md:group-hover:opacity-100 
//                    opacity-100 
//                    md:group-hover:translate-x-0 md:translate-x-full // Changed positioning for smooth reveal
//                    w-10 h-10 md:w-12 md:h-12 
//                    bg-red-500 text-white border-[3px] border-white rounded-full 
//                    flex items-center justify-center shadow hover:bg-red-600 
//                    transition-all duration-500 z-50"
//                                         >
//                                             <Heart size={20} />
//                                         </button>
//                                     ) : (
//                                         <button
//                                             onClick={() => handleWishList(product)}
//                                             // The key changes are in positioning and visibility:
//                                             className="absolute top-4 right-0 
//                    md:opacity-0 md:group-hover:opacity-100 
//                    opacity-100 
//                    md:group-hover:translate-x-0 md:translate-x-full // Changed positioning for smooth reveal
//                    w-10 h-10 md:w-12 md:h-12 
//                    bg-gray-200 border-[3px] border-white rounded-full 
//                    flex items-center justify-center shadow hover:bg-red-500 hover:text-white 
//                    transition-all duration-500 z-50"
//                                         >
//                                             <Heart size={20} />
//                                         </button>
//                                     )}
//                                 </div>
//                                 <div onClick={() => router.push(`/products/${slugConvert(product.name)}`)}>
//                                     {/* Divider */}
//                                     <span className="block w-full h-[1px] bg-green-100" />

//                                     {/* Product Name */}
//                                     <h3 className="text-base font-medium text-gray-800 truncate px-4 mt-4 text-center">
//                                         <Link
//                                             href={`/products/${slugConvert(product.name)}`}
//                                             className="hover:text-[#d4b63a] transition"
//                                         >
//                                             <p className="text-center font-medium truncate">{product.name}</p>
//                                         </Link>
//                                     </h3>

//                                     {/* Price */}
//                                     <div className="text-center mt-3">
//                                         <p className="text-[#b39e49] text-xl font-semibold">₹{product?.price}</p>
//                                     </div>

//                                     {/* Add to Cart / Qty */}
//                                     {product?.cartQty > 0 ? (
//                                         <div className="hidden group-hover:flex items-center justify-center mt-4 mb-4 space-x-4">
//                                             <button
//                                                 onClick={() => handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)}
//                                                 disabled={product.cartQty <= 1}
//                                                 className="bg-[#E1D6A8] text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
//                                             >
//                                                 −
//                                             </button>
//                                             <span className="text-green-700 font-semibold text-lg">{product.cartQty}</span>
//                                             <button
//                                                 onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
//                                                 className="bg-[#E1D6A8] text-white px-3 py-1 rounded hover:bg-green-700"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <div className="p-4 pt-2 hidden group-hover:block">
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     getUserId ? handleAddCart(product.id, 1) : setSignInModal(true);
//                                                 }}
//                                                 className="w-full bg-[#b39e49] hover:bg-[#d4b63a] hover:text-white text-white py-2 rounded-md font-medium shadow-sm transition-all duration-200 flex justify-center items-center gap-2"
//                                             >
//                                                 Add to cart <ShoppingCart size={16} />
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                 </Slider>
//             )}

//             {/* Modal */}
//             <ProductModal
//                 isOpen={isModalOpen}
//                 product={selectedProduct}
//                 onClose={() => setModalOpen(false)}
//             />
//             {signInmodal && (
//                 <LoginModal
//                     open={signInmodal}
//                     handleClose={() => setSignInModal(false)}
//                     vendorId={vendorId}
//                 />
//             )}
//         </section>
//     );
// };

// export default BestSellers;

'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductModal from './model/ProductModal';
import { useProducts } from '@/context/ProductsContext';
import Link from 'next/link';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { useVendor } from '@/context/VendorContext';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import LoginModal from './model/LoginModel';
import { useCartItem } from '@/context/CartItemContext';
import { slugConvert } from '@/lib/utils';
import { useWishList } from '@/context/WishListContext';
import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const BestSellers = () => {
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [getUserName, setUserName] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [signInmodal, setSignInModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, isLoading }: any = useProducts();
  const { vendorId } = useVendor();
  const queryClient = useQueryClient();
  const { cartItem }: any = useCartItem();
  const { wishList }: any = useWishList();
  const router = useRouter();

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setCartId(localStorage.getItem('cartId'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const matchingProductsArray = products?.data?.map((product: any, index: number) => {
    const matchingCartItem = cartItem?.data?.find(
      (item: any) => item?.product === product?.id
    );
    if (matchingCartItem) {
      return {
        ...product,
        Aid: index,
        cartQty: matchingCartItem?.quantity,
        cartId: matchingCartItem.id,
      };
    }
    return product;
  });

  const finalProductData = matchingProductsArray?.map((item: any) => {
    const wishLists = wishList?.data?.find((wish: any) => wish?.product === item?.id);
    return {
      ...item,
      isLike: !!wishLists,
      wishListId: wishLists?.id,
    };
  });

  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      cart: getCartId,
      product: id,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user',
    };
    try {
      const response = await postCartitemApi(``, payload);
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {}
  };

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`);
        if (updateApi) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        const response = await updateCartitemsApi(`${id}/${type}/`);
        if (response) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      }
    } catch (error) {}
  };

  const handleWishList = async (product: any) => {
    try {
      await postWishListApi('', {
        user: getUserId,
        product: product.id,
        vendor: vendorId,
        created_by: vendorId ? `user${vendorId}` : 'user',
      });
      toast.success('Product added in wishlist!');
      queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteWishList = async (product: any) => {
    try {
      await deleteWishListApi(`${product?.wishListId}`, {
        deleted_by: vendorId ? `user${vendorId}` : 'user',
      });
      toast.success('Product removed from wishlist!');
      queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
    } catch (error) {
      console.log(error);
    }
  };

  // Skeleton loader
  const skeletonArray = Array(5).fill(null);

  // 👉 Main condition: grid or slider
  const shouldUseSlider = finalProductData?.length > 3;

  return (
    <section className="bg-white">
      <h2 className="text-3xl font-bold text-[#b39e49] mb-2 mt-6 text-center">
        Shop Best Sellers
      </h2>
      <div className="flex justify-end">
        <Link href="/products">
          <button className="text-sm px-4 py-1.5 mr-6 border border-[#b39e49] text-[#b39e49] rounded-md shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200">
            View all
          </button>
        </Link>
      </div>

      {isLoading ? (
        <Slider {...settings}>
          {skeletonArray.map((_, idx) => (
            <div key={idx} className="px-2 my-4">
              <div className="bg-white h-[400px] rounded-md overflow-hidden border border-gray-200 p-4 animate-pulse">
                <div className="bg-gray-200 h-52 w-full mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </Slider>
      ) : shouldUseSlider ? (
        // 👉 Slider view (for >3)
        <Slider {...settings}>
          {finalProductData?.slice(0, 10)?.map((product: any, index: number) => (
            <ProductCard
              key={index}
              product={product}
              getUserId={getUserId}
              handleAddCart={handleAddCart}
              handleUpdateCart={handleUpdateCart}
              handleWishList={handleWishList}
              handleDeleteWishList={handleDeleteWishList}
              setSignInModal={setSignInModal}
              router={router}
            />
          ))}
        </Slider>
      ) : (
        // 👉 Grid view (for ≤3)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 my-6">
          {finalProductData?.slice(0, 10)?.map((product: any, index: number) => (
            <ProductCard
              key={index}
              product={product}
              getUserId={getUserId}
              handleAddCart={handleAddCart}
              handleUpdateCart={handleUpdateCart}
              handleWishList={handleWishList}
              handleDeleteWishList={handleDeleteWishList}
              setSignInModal={setSignInModal}
              router={router}
            />
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setModalOpen(false)}
      />

      {signInmodal && (
        <LoginModal
          open={signInmodal}
          handleClose={() => setSignInModal(false)}
          vendorId={vendorId}
        />
      )}
    </section>
  );
};

// ✅ Reusable Product Card
const ProductCard = ({
  product,
  getUserId,
  handleAddCart,
  handleUpdateCart,
  handleWishList,
  handleDeleteWishList,
  setSignInModal,
  router,
}: any) => (
  <div className="px-2 my-4">
    <div className="bg-white relative h-auto rounded-md group hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
      <div className="relative p-4">
        <Image
          src={product?.image_urls[0]}
          alt={product?.name}
          width={280}
          height={280}
          className="h-24 w-40 object-contain mx-auto"
          onClick={() => router.push(`/products/${slugConvert(product.name)}`)}
        />
        {product?.isLike ? (
          <button
            onClick={() => handleDeleteWishList(product)}
            className="absolute top-4 right-4 md:opacity-0 md:group-hover:opacity-100 opacity-100 
              w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full 
              flex items-center justify-center shadow hover:bg-red-600 transition-all duration-500 z-50"
          >
            <Heart size={20} />
          </button>
        ) : (
          <button
            onClick={() => handleWishList(product)}
            className="absolute top-4 right-0 md:opacity-0 md:group-hover:opacity-100 opacity-100 
              w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full 
              flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-50"
          >
            <Heart size={20} />
          </button>
        )}
      </div>

      <div onClick={() => router.push(`/products/${slugConvert(product.name)}`)}>
        <span className="block w-full h-[1px] bg-green-100" />
        <h3 className="text-base font-medium text-gray-800 truncate px-4 mt-4 text-center">
          <p className="text-center font-medium truncate">{product.name}</p>
        </h3>
        <div className="text-center mt-3">
          <p className="text-[#b39e49] text-xl font-semibold">₹{product?.price}</p>
        </div>

        {product?.cartQty > 0 ? (
          <div className="hidden group-hover:flex items-center justify-center mt-4 mb-4 space-x-4">
            <button
              onClick={() => handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)}
              disabled={product.cartQty <= 1}
              className="bg-[#E1D6A8] text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
            >
              −
            </button>
            <span className="text-green-700 font-semibold text-lg">{product.cartQty}</span>
            <button
              onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
              className="bg-[#E1D6A8] text-white px-3 py-1 rounded hover:bg-green-700"
            >
              +
            </button>
          </div>
        ) : (
          <div className="p-4 pt-2 hidden group-hover:block">
            <button
              onClick={(e) => {
                e.stopPropagation();
                getUserId ? handleAddCart(product.id, 1) : setSignInModal(true);
              }}
              className="w-full bg-[#b39e49] hover:bg-[#d4b63a] hover:text-white text-white py-2 rounded-md font-medium shadow-sm transition-all duration-200 flex justify-center items-center gap-2"
            >
              Add to cart <ShoppingCart size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default BestSellers;

