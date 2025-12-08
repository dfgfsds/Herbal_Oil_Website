'use client';
import { useParams } from 'next/navigation';
import { useProducts } from '@/context/ProductsContext';
import { useCategories } from '@/context/CategoriesContext';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, SearchCheck } from 'lucide-react';
import ProductModal from './model/ProductModal';
import { useEffect, useState } from 'react';
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import LoginModal from './model/LoginModel';
import Breadcrumb from './Breadcrumb';
import { useCartItem } from '@/context/CartItemContext';
import { slugConvert } from '@/lib/utils';

export default function CategoriesBasedProduct() {
    const { id } = useParams();
    const [getUserId, setUserId] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [getUserName, setUserName] = useState<string | null>(null);
    const [signInmodal, setSignInModal] = useState(false);
    const { products, isLoading }: any = useProducts();
    const { categories }: any = useCategories();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { vendorId } = useVendor();
    const { cartItem }: any = useCartItem();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedCartId = localStorage.getItem('cartId');
        const storedUserName = localStorage.getItem('userName');

        setUserId(storedUserId);
        setCartId(storedCartId);
        setUserName(storedUserName);
    }, []);

    // Find the category name by ID
    const category = categories?.data?.find(
        (cat: any) => cat.id?.toString() === id
    );
    const categoryName = category?.name || 'Category';

    // Filter products by category ID
    const filteredProducts = products?.data?.filter(
        (product: any) => product.category?.toString() === id
    );

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

    const filteredMatchingProductsArray = filteredProducts?.map((product: any, index: number) => {
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
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: `${categoryName}`, href: '/categories' },
        { name: 'Products', href: '/products', isActive: true },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <Breadcrumb items={breadcrumbItems} />
               <h1 className="text-3xl font-bold mb-4 mt-3 text-center">Shop by Category <span className='capitalize'>{categoryName}</span></h1>
            {/* <h1 className="text-3xl font-bold  text-green-500 mb-6 mt-6 text-center">
                {categoryName} Products
            </h1> */}

            {isLoading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : filteredMatchingProductsArray?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {filteredMatchingProductsArray.map((product: any) => (
                        <div key={product?.id} className="px-2 my-2">
                            <div className="bg-white p-4 group relative border border-green-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-md">
                                <Link
                                    href={`/products/${slugConvert(product.name)}`}>
                                    <Image
                                        src={product?.image_urls[0]}
                                        alt={product?.name}
                                        className="h-72 w-full object-contain mb-3"
                                        width={300}
                                        height={288}
                                    />
                                    <span className="block w-full h-[2px] bg-[#b39e49] rounded mb-2"></span>
                                </Link>
                                <h3 className="text-lg font-medium text-gray-800 truncate mt-3 text-center">
                                    <Link
                                        href={`/products/${slugConvert(product.name)}`}
                                        className="hover:underline hover:text-[#d4b63a] transition-colors"
                                    >
                                        {product.name}
                                    </Link>
                                </h3>

                                <div className="mt-2 flex justify-center">
                                    <p className="text-[#b39e49] text-xl font-semibold">₹{product?.price}</p>
                                </div>

                                {product?.cartQty > 0 ? (
                                    <div className="flex items-center justify-center mt-4 space-x-4">
                                        <button
                                            onClick={() =>
                                                handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                                            }
                                            disabled={product.cartQty <= 1}
                                            className="bg-[#b39e49] text-white px-3 py-1 rounded hover:bg-[#d4b63a] disabled:opacity-50"
                                        >
                                            −
                                        </button>
                                        <span className="text-[#b39e49] font-semibold text-lg">{product.cartQty}</span>
                                        <button
                                            onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
                                            className="bg-[#b39e49] text-white px-3 py-1 rounded hover:bg-[#d4b63a]"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (getUserId) {
                                                handleAddCart(product.id, 1);
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
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-5">No products found for this category.</p>
            )}
            <ProductModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={() => setModalOpen(false)}
            />
            {signInmodal && (
                <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
            )}
        </div>
    );
}