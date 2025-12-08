"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';
import { useWishList } from '@/context/WishListContext';
import { useCartItem } from '@/context/CartItemContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useVendor } from '@/context/VendorContext';
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import LoginModal from '../model/LoginModel';


function WishList() {
  const { products, isAuthenticated, isLoading }: any = useProducts();
  const { wishList, wishListLoading }: any = useWishList();
  const { cartItem }: any = useCartItem();
  const router = useRouter();
  const emptyImage = "https://www.lifecarenutritions.com/assets/images/empty_image.jpg";
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const { vendorId } = useVendor();
  const queryClient = useQueryClient();
  const [getUserName, setUserName] = useState<string | null>(null);
  const [signInmodal, setSignInModal] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedCartId = localStorage.getItem('cartId');

    setUserId(storedUserId);
    setCartId(storedCartId);
  }, []);

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
    const wishLists = wishList?.data?.find(
      (wish: any) => wish?.product === item?.id
    );
    return {
      ...item,
      isLike: wishLists ? true : false,
      wishListId: wishLists?.id
    };
  });

  const likedProducts = finalProductData?.filter((item: any) => item?.isLike);

  function slugConvert(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '');     // Remove non-word characters except hyphens
  }

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        const response = await updateCartitemsApi(`${id}/${type}/`)
        if (response) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      }

    } catch (error) {

    }
  }

  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      cart: getCartId,
      product: id,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user'
    }
    try {
      const response = await postCartitemApi(``, payload)
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  }


  const handleWishList = async (product: any) => {
    try {
      await postWishListApi('', {
        user: getUserId,
        product: product.id,
        vendor: vendorId,
        created_by: vendorId ? `user${vendorId}` : 'user'
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
        deleted_by: vendorId ? `user${vendorId}` : 'user'
      });
      toast.success('Product removed from wishlist!');
      queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);

    } catch (error) {
      console.log(error);
    }
  };


  return (
    // <div className="max-w-6xl mx-auto py-10 px-2 md:px-4">
    <div className="mx-auto 
">
      {/* <div className="text-center my-4">
        <h2 className="text-2xl text-gray-700 font-bold">My Wishlist</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>
      <div className="my-2 mb-5 flex">
        <ArrowLeft onClick={() => router.back()} className='text-gray-400 cursor-pointer' />
        <p className="text-md text-gray-400 flex mt-0.5 gap-1">
          <span className='cursor-pointer flex' onClick={() => router.back()} >
            Back</span> / <span className='text-[#13cea1]'>Wishlist</span></p>

      </div> */}

      {/* <h2 className="text-2xl font-bold mb-6 text-center">My Wishlist</h2> */}

      {/* Product Grid */}
      {likedProducts?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6" >
          {
            likedProducts?.map((product: any) => (
              <div className="bg-white relative h-auto p-2 rounded-md group hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
                {/* Product Image */}

                <div className="relative">
                  <Image
                    src={product?.image_urls[0]}
                    alt={product?.name}
                    width={280}
                    height={280}
                    className="h-52 w-full object-contain mx-auto"
                    onClick={() => router.push(`/products/${slugConvert(product.name)}`)}
                  />


                  {product?.isLike ? (
                    <button
                      onClick={() => handleDeleteWishList(product)}

                      className="absolute top-4 right-1
                                     md:opacity-0 md:group-hover:opacity-100 
                                     opacity-100 
                                     md:group-hover:translate-x-0 md:translate-x-full // Changed positioning for smooth reveal
                                     w-10 h-10 md:w-12 md:h-12 
                                     bg-red-500 text-white border-[3px] border-white rounded-full 
                                     flex items-center justify-center shadow hover:bg-red-600 
                                     transition-all duration-500 z-10"
                    >
                      <Heart size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleWishList(product)}
                      className="absolute top-4 right-1
                                     md:opacity-0 md:group-hover:opacity-100 
                                     opacity-100 
                                     md:group-hover:translate-x-0 md:translate-x-full // Changed positioning for smooth reveal
                                     w-10 h-10 md:w-12 md:h-12 
                                     bg-gray-200 border-[3px] border-white rounded-full 
                                     flex items-center justify-center shadow hover:bg-red-500 hover:text-white 
                                     transition-all duration-500 z-10"
                    >
                      <Heart size={20} />
                    </button>
                  )}
                </div>
                <div onClick={() => router.push(`/products/${slugConvert(product.name)}`)}>
                  {/* Divider */}
                  <span className="block w-full h-[1px] bg-[#d4b63a]" />
                  {/* Product Name */}
                  <h3 className="text-base font-medium text-gray-800 truncate px-4 mt-4 text-center">
                    <Link
                      href={`/products/${slugConvert(product.name)}`}
                      className="hover:text-[#d4b63a] transition"
                    >
                      <p className="text-center font-medium truncate">{product.name}</p>
                    </Link>
                  </h3>
                  {/* Price */}
                  <div className="text-center mt-3">
                    <p className="text-[#b39e49] text-xl font-semibold">₹{product?.price}</p>
                  </div>
                  {/* Add to Cart or Qty Counter */}
                  {product?.cartQty > 0 ? (
                    <div className="hidden group-hover:block group-hover:flex items-center justify-center mt-4 mb-4 space-x-4">
                      <button
                        onClick={() =>
                          handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                        }
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
                        className="w-full bg-[#b39e49] hover:bg-[#d4b63a] hover:text-white text-white py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                      >
                        <span className='flex justify-center'>Add to cart <span className='ml-2 mt-1 align-middle'><ShoppingCart size={16} /></span> </span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))
          }
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 13h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v13a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold">No Products Found</h3>
          <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
        </div>
      )}

      {signInmodal && (
        <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
      )}

    </div>
  );
}

export default WishList;
