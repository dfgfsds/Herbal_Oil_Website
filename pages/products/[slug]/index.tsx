'use client';

import { useParams } from 'next/navigation';
import { useProducts } from '@/context/ProductsContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
    deleteCartitemsApi,
    postCartitemApi,
    updateCartitemsApi
} from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import LoginModal from '@/components/model/LoginModel';
import { useCartItem } from '@/context/CartItemContext';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { slugConvert } from '@/lib/utils';

const SingleProductPage = () => {
    const [getUserId, setUserId] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [getUserName, setUserName] = useState<string | null>(null);
    const [signInmodal, setSignInModal] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [cartData, setCartData] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);



    const { products }: any = useProducts();
    const { cartItem }: any = useCartItem();
    const { vendorId } = useVendor();
    const queryClient = useQueryClient();
    const params = useParams();
    const slug = params?.slug;

    useEffect(() => {
        if (products?.data && product) {
            const related = products.data.filter((p: any) =>
                p.id !== product.id &&
                (p.brand_name === product.brand_name || p.category === product.category)
            );
            setRelatedProducts(related.slice(0, 4)); // Show only first 4 related items
        }
    }, [products, product]);
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedCartId = localStorage.getItem('cartId');
        const storedUserName = localStorage.getItem('userName');
        setUserId(storedUserId);
        setCartId(storedCartId);
        setUserName(storedUserName);
    }, []);

    useEffect(() => {
        if (products?.data && slug) {
            const found = products.data.find((p: any) => slugConvert(p.name) === slug);
            if (found) {
                const cartMatch = cartItem?.data?.find((item: any) => item?.product === found.id);
                if (cartMatch) {
                    setCartData({
                        cartId: cartMatch.id,
                        quantity: cartMatch.quantity
                    });
                }
                setProduct(found);
            }
        }
    }, [products, slug, cartItem]);

    const handleUpdateCart = async (id: any, type: any, qty: any) => {
        try {
            if (qty === 1 && type === 'decrease') {
                await deleteCartitemsApi(`${id}`);
            } else {
                await updateCartitemsApi(`${id}/${type}/`);
            }
            queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleAddCart = async (id: any, qty: any) => {
        const payload = {
            cart: getCartId,
            product: id,
            user: getUserId,
            vendor: vendorId,
            quantity: qty,
            created_by: getUserName || 'user'
        };
        try {
            await postCartitemApi(``, payload);
            queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    if (!product) return <div className="p-8 text-center">Loading product details...</div>;

    const sliderSettings = {
        autoplay: true,
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: `${product.name}`, href: `/${product.name}`, isActive: true },
    ];

    const filteredMatchingProductsArray = relatedProducts?.map((product: any, index: number) => {
        const matchingCartItem = cartItem?.data?.find((item: any) => item?.product === product?.id);
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="container mx-auto px-4 py-6">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left - Image Carousel */}
                <div>
                    {product?.image_urls?.length > 1 ? (
                        <Slider {...sliderSettings}>
                            {product.image_urls.map((url: string, index: number) => (
                                <div key={index} className="p-2">
                                    <Image
                                        src={url}
                                        alt={`product-${index}`}
                                        width={500}
                                        height={500}
                                        className="w-full h-[400px] object-contain rounded border"
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <Image
                            src={product.image_urls[0]}
                            alt="product"
                            width={500}
                            height={500}
                            className="w-full h-[400px] object-contain rounded border"
                        />
                    )}
                </div>

                {/* Right - Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-gray-500 text-sm mt-1">Brand: {product.brand_name}</p>
                    <div className="flex items-baseline gap-4 mt-4">
                        <span className="text-2xl font-bold text-[#b39e49]">₹{product.price}</span>
                        {product.discount && product.discount !== product.price && (
                            <span className="text-lg line-through text-gray-400">₹{product.discount}</span>
                        )}
                    </div>
                    {/* <p className="text-sm mt-2 text-[#b39e49]">In stock: {product.stock_quantity} items</p> */}
                    {/* <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: product?.description }} className="quill-content text-gray-600 mt-2" />

                    {cartData ? (
                        <div className="flex items-center justify-start mt-4 space-x-4">
                            <button
                                onClick={() => handleUpdateCart(cartData.cartId, 'decrease', cartData.quantity)}
                                disabled={cartData.quantity <= 1}
                                className="bg-[#b39e49] text-white px-3 py-1 rounded hover:bg-[#d4b63a] disabled:opacity-50"
                            >
                                −
                            </button>
                            <span className="text-[#b39e49] font-semibold text-lg">{cartData.quantity}</span>
                            <button
                                onClick={() => handleUpdateCart(cartData.cartId, 'increase', cartData.quantity)}
                                className="bg-[#b39e49] text-white px-3 py-1 rounded hover:bg-[#d4b63a]"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => (getUserId ? handleAddCart(product.id, 1) : setSignInModal(true))}
                            className="w-full mt-4 bg-[#b39e49] hover:bg-[#d4b63a] text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
            {filteredMatchingProductsArray?.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMatchingProductsArray.map((related) => (
                            <div
                                key={related.id}
                                className="bg-white p-4 group relative border border-green-100 rounded-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                <Link href={`/products/${slugConvert(related.name)}`}>
                                    <Image
                                        src={related.image_urls[0]}
                                        alt={related.name}
                                        className="h-72 w-full object-contain mb-3"
                                        width={300}
                                        height={288}
                                    />
                                    <span className="block w-full h-[2px] bg-[#b39e49] rounded mb-2"></span>
                                </Link>

                                <h3 className="text-lg font-medium text-gray-800 truncate mt-3 text-center">
                                    <Link
                                        href={`/products/${slugConvert(related.name)}`}
                                        className="hover:underline hover:text-[#b39e49] transition-colors"
                                    >
                                        {related.name}
                                    </Link>
                                </h3>

                                <div className="mt-2 flex justify-center">
                                    <p className="text-[#b39e49] text-xl font-semibold">₹{related.price}</p>
                                </div>

                                {related?.cartQty > 0 ? (
                                    <div className="flex items-center justify-center mt-4 space-x-4">
                                        <button
                                            onClick={() =>
                                                handleUpdateCart(related?.cartId, 'decrease', related?.cartQty)
                                            }
                                            disabled={related.cartQty <= 1}
                                            className="bg-[#E1D6A8] text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                        >
                                            −
                                        </button>
                                        <span className="text-green-700 font-semibold text-lg">{related.cartQty}</span>
                                        <button
                                            onClick={() => handleUpdateCart(related?.cartId, 'increase', '')}
                                            className="bg-[#E1D6A8] text-white px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (getUserId) {
                                                handleAddCart(related.id, 1);
                                            } else {
                                                setSignInModal(true);
                                            }
                                        }}
                                        className="w-full mt-4 bg-[#b39e49] hover:bg-[#d4b63a] text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {signInmodal && (
                <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
            )}
        </div>
    );
};

export default SingleProductPage;

