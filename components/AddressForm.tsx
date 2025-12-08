import { useState, useEffect } from 'react';
import { Loader, X } from 'lucide-react';
import { postAddressCreateApi, updateAddressApi } from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';

interface AddressFormProps {
    openModal: boolean;
    handleClose: () => void;
    editData: any;
}

export default function AddressForm({ openModal, handleClose, editData }: AddressFormProps) {

    const [formData, setFormData] = useState({
        customer_name: '',
        contact_number: '',
        email_address: '',
        address_line1: '',
        address_line2: '',
        address_type: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        landmark: '',
    });

    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useUser();

    useEffect(() => {

        setUserName(user?.data?.name);
        setUserId(user?.data?.id);
    }, []);

    useEffect(() => {
        if (editData !== null) {
            setFormData({
                customer_name: editData?.customer_name || '',
                contact_number: editData?.contact_number || '',
                email_address: editData?.email_address || '',
                address_line1: editData?.address_line1 || '',
                address_line2: editData?.address_line2 || '',
                address_type: editData?.address_type || '',
                city: editData?.city || '',
                state: editData?.state || '',
                postal_code: editData?.postal_code || '',
                country: editData?.country || '',
                landmark: editData?.landmark || '',
            });
        } else {
            setFormData({
                customer_name: '',
                contact_number: '',
                email_address: '',
                address_line1: '',
                address_line2: '',
                address_type: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
                landmark: '',
            });
        }

    }, [editData]);

    if (!openModal) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            user: userId,
            customer_name: userName ? userName : 'user',
            ...(editData ? { updated_by: userName ? userName : 'user' } : { created_by: userName ? userName : 'user' })
        };

        try {
            const response = editData
                ? await updateAddressApi(`${editData?.id}`, payload)
                : await postAddressCreateApi('', payload);

            if (response) {
                queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
                handleClose();
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const inputClass = "mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1001]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold mb-4">{editData ? 'Edit' : 'Add'} Address</h2>
                    <span onClick={handleClose} className="cursor-pointer">
                        <X />
                    </span>
                </div>
                <div
                    className="max-h-[70vh] overflow-y-auto pr-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black">Customer Name</label>
                                <input
                                    name="customer_name"
                                    value={formData.customer_name || ''}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black">Email</label>
                                <input name="email_address" value={formData.email_address} onChange={handleChange} required className={inputClass} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black">Contact</label>
                                <input name="contact_number" value={formData.contact_number} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Address Line 1</label>
                                <textarea name="address_line1" value={formData.address_line1} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Address Line 2</label>
                                <textarea name="address_line2" value={formData.address_line2} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Email</label>
                                <input name="email_address" value={formData.email_address} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Contact</label>
                                <input name="contact_number" value={formData.contact_number} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Address Type</label>
                                <input name="address_type" value={formData.address_type} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">City</label>
                                <input name="city" value={formData.city} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">State</label>
                                <input name="state" value={formData.state} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Pin Code</label>
                                <input type="number" name="postal_code" value={formData.postal_code} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Country</label>
                                <input name="country" value={formData.country} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Landmark</label>
                                <textarea name="landmark" value={formData.landmark} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#931607] text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 flex gap-2">
                                Save {loading && <Loader className="animate-spin" size={20} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}