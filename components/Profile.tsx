'use client';

import { deleteAddressApi, getAddressApi, getOrdersAndOrdersItemsApi } from '@/api-endpoints/CartsApi';
import { useVendor } from '@/context/VendorContext';
import { formatDate, formatPrice } from '@/lib/utils';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Package, Pencil, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AddressForm from './AddressForm';
import { patchUserSelectAddressAPi, updateUserAPi } from '@/api-endpoints/authendication';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import WishList from './wishlist/page';

const tabs = ['Orders', 'Wishlist', 'Address', 'Account Info'];

export default function Profile() {

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Orders');
    const [userId, setUserId] = useState<string | null>(null);
    
    useEffect(() => {
        if (router.isReady) {
            const tabFromQuery = router.query.tab as string;
            if (tabFromQuery) {
                setActiveTab(tabFromQuery);
            }
        }
    }, [router.isReady, router.query.tab]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            router.push('/login'); // 👈 Redirect if not logged in
        } else {
            setUserId(storedUserId);
        }
    }, [router]);
    // Optional: prevent rendering until check is done
    if (!userId) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 bg-white shadow rounded-lg my-4">
            <h1 className="text-2xl font-bold text-center mb-8 text-[#b39e49]">My Account</h1>

            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-4 border-b pb-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-medium rounded-t-md ${activeTab === tab
                            ? 'text-[#b39e49] border-b-2 border-[#d4b63a]'
                            : 'text-gray-600 hover:text-[#b39e49]'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 bg-gray-50 rounded-md">
                {activeTab === 'Orders' && <OrdersTab />}
                {activeTab === 'Wishlist' && <WishlistTab />}
                {activeTab === 'Address' && <AddressTab />}
                {activeTab === 'Account Info' && <AccountInfoTab />}
            </div>
        </div>
    );
}

// Dummy Tab Components
function OrdersTab() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const { vendorId } = useVendor();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);

    const { data } = useQuery({
        queryKey: ['getOrdersAndOrdersItemsApiData', userId, vendorId],
        queryFn: () => getOrdersAndOrdersItemsApi(`?vendor_id=${vendorId}&user_id=${userId}`),
        enabled: !!userId && !!vendorId,
    });

    const orders = data?.data || [];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Orders</h2>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div
                            key={order.id}
                            className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Order summary header */}
                            <div className="bg-slate-100 p-4 flex flex-wrap justify-between gap-4 rounded-t-lg">
                                <div>
                                    <p className="text-sm text-gray-500">Order Placed</p>
                                    <p className="font-medium text-gray-800">{formatDate(order.created_at)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-medium text-gray-800">#{order.id}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="font-medium text-[#b39e49]">{formatPrice(order.total_amount)}</p>
                                </div>

                                <div>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : order.status === 'Processing'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.status === 'Shipped'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : order.status === 'Cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="p-4 bg-gray-50 space-y-4">
                                {order.order_items.map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 border-b pb-4 last:border-none"
                                    >
                                        <div className="w-16 h-16 rounded overflow-hidden bg-white border">
                                            <Image
                                                src={
                                                    product?.product?.image_urls?.[0] ||
                                                    'https://semantic-ui.com/images/wireframe/image.png'
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                height={100}
                                                width={100}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{product?.product?.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white shadow rounded-md">
                    <Package className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-3 text-md font-semibold text-gray-800">No Orders Found</h3>
                    <p className="text-sm text-gray-500">Looks like you haven't placed any orders yet.</p>
                </div>
            )}
        </div>
    );
}

function WishlistTab() {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Wishlist</h2>
            {/* <p className="text-gray-500">Your wishlist is empty.</p> */}
            <WishList/>
        </div>
    );
}


function AddressTab() {
    const [openModal, setOpenMoadl] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editData, setEditData] = useState<any>('');
    const [deleteId, setDeleteId] = useState();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [getUserName, setUserName] = useState<string | null>(null);
    const { user } = useUser();


    useEffect(() => {

        setUserName(user?.data?.name);
        setUserId(user?.data?.id);
    }, []);

    const { data, isLoading }: any = useQuery({
        queryKey: ['getAddressData', userId],
        queryFn: () => getAddressApi(`user/${userId}`),
        enabled: !!userId,
    });

    const confirmDelete = async () => {
        if (deleteId) {
            setLoading(true);
            const response = await deleteAddressApi(deleteId, { deleted_by: 'user' });
            if (response) {
                queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
                setDeleteModal(false);
                setLoading(false);
            }
        }
    };

    const handleSelectAddress = async (id: any) => {
        try {
            const upadetApi = await patchUserSelectAddressAPi(
                `user/${userId}/address/${id?.id}`,
                { updated_by: getUserName }
            );
            if (upadetApi) {
                queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Addresses</h2>

                <button
                    onClick={() => {
                        setEditData(null); // Clear existing data
                        setOpenMoadl(true); // Open the modal
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#d4b63a] to-[#d4b63a] hover:from-[#d4b63a] hover:to-[#d4b63a] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Plus className="h-4 w-4" />
                    Add New Address
                </button>
            </div>

            {data?.data?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data?.data?.map((address: any) => (
                        <div key={address.id} className="relative border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
                            {/* Default Badge */}
                            {address?.selected_address && (
                                <div className="absolute top-2 right-2">
                                    <span className="bg-green-500/10 text-[#b39e49] text-xs font-medium px-2.5 py-0.5 rounded">
                                        Default
                                    </span>
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-2">
                                <h3 className="text-base font-semibold uppercase">{address?.address_type}</h3>
                                <p className="text-sm text-gray-500">Shipping Address</p>
                            </div>

                            {/* Address Content */}
                            <div className="text-sm text-gray-700">
                                {address?.contact_number}<br />
                                {address?.email_address}<br />
                                {address?.address_line1}<br />
                                {address?.address_line2 && (
                                    <>
                                        {address?.address_line2}<br />
                                    </>
                                )}
                                {address?.city}, {address?.state} {address?.postal_code}<br />
                                {address?.country}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 flex-wrap">
                                <button
                                    onClick={() => {
                                        setOpenMoadl(!openModal);
                                        setEditData(address);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 border text-sm rounded-md hover:bg-gray-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        setDeleteModal(!deleteModal);
                                        setDeleteId(address?.id);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 border border-red-500 text-sm text-red-600 rounded-md hover:bg-red-50"
                                >
                                    <Trash className="w-4 h-4" />
                                    Remove
                                </button>

                                {!address?.selected_address && (
                                    <button
                                        onClick={() => handleSelectAddress(address)}
                                        className="ml-auto px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100"
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
                </div>
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold mb-4">Delete Address</h2>
                        </div>

                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this address?
                        </p>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditData('');
                                    setLoading(false);
                                    setDeleteModal(false);
                                }}
                                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={loading}
                                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 gap-2 flex"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddressForm
                openModal={openModal}
                handleClose={() => setOpenMoadl(!openModal)}
                editData={editData}
            />
        </div>
    );
}


function AccountInfoTab() {
    const { user }: any = useUser();
    const { vendorId } = useVendor();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (user?.data) {
            setFormData({
                name: user.data.name || "",
                email: user.data.email || "",
                phone: user.data.contact_number || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await updateUserAPi(`/${user?.data?.id}`, {
                ...formData,
                contact_number: formData?.phone,
                updated_by: user?.data?.name ?  user?.data?.name:'user',
                role: 3,
                vendor: vendorId,
            });

            if (response) {
                queryClient.invalidateQueries(["gerUserData"] as InvalidateQueryFilters);
                // Optional: show toast or success message
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold">Account Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-[#b39e49] text-white text-sm font-medium rounded-md hover:bg-[#d4b63a] transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
