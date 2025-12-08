'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useVendor } from '@/context/VendorContext';
import url from '@/api-endpoints/ApiUrls';
import { getCartApi } from '@/api-endpoints/CartsApi';
import { useRouter } from 'next/router';
import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from '@/api-endpoints/authendication';

const LoginForm = () => {
    const { vendorId } = useVendor();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '', mobile: '', otp: '' });

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) router.push('/profile');
        else setUserId(storedUserId);
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = {
            email: formData.email ? '' : 'Email is required',
            password: formData.password ? '' : 'Password is required',
            mobile: '',
            otp: '',
        };
        setErrors(validationErrors);

        const hasError = Object.values(validationErrors).some((msg) => msg !== '');
        if (hasError) return;

        try {
            setLoading(true);
            const response = await axios.post(url.signIn, {
                ...formData,
                vendor_id: vendorId,
            });

            if (response?.data?.user_id) {
                localStorage.setItem('userId', response.data.user_id);

                const updateApi = await getCartApi(`user/${response.data.user_id}`);
                if (updateApi?.data?.length > 0) {
                    localStorage.setItem('cartId', updateApi.data[0].id);
                }

                router.push('/products');
                window.location.reload();
            }
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Something went wrong, please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ OTP LOGIN FLOW
    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const res = await postSendSmsOtpUserApi({
                contact_number: mobile,
                vendor_id: vendorId,
            });
            if (res?.data?.token) {
                setOtpSent(true);
                setToken(res.data.token);
                setLoading(false);

            }
        } catch (err: any) {
            setLoading(false);
            setError(err?.response?.data?.error || 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await postVerifySmsOtpApi({
                otp: otp,
                token: token,
                login_type: "user",
                vendor_id: vendorId,
            });

            const userId = res?.data?.user_id;
            if (userId) {
                localStorage.setItem('userId', userId);
                const cartRes = await getCartApi(`user/${userId}`);
                if (cartRes) {
                    localStorage.setItem('cartId', cartRes.data[0]?.id);
                    setLoading(false);
                    window.location.reload();
                }
            }
            // if (response?.data?.user_id) {
            //   toast.success('Login successful!');
            //   localStorage.setItem('userId', response.data.user_id);

            //   const cartRes = await getCartApi(`user/${response.data.user_id}`);
            //   localStorage.setItem('cartId', cartRes?.data[0]?.id);

            //   handleClose();
            //   window.location.reload();
            // }
        } catch (err: any) {
            setLoading(false);
            setError(err?.response?.data?.error || 'Invalid OTP');
        }
    };


    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'email'
                            ? 'border-[#b39e49] text-[#b39e49]'
                            : 'text-gray-600 border-transparent'
                            }`}
                    >
                        Email Login
                    </button>
                    <button
                        onClick={() => setActiveTab('otp')}
                        className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'otp'
                            ? 'border-[#b39e49] text-[#b39e49]'
                            : 'text-gray-600 border-transparent'
                            }`}
                    >
                        OTP Login
                    </button>
                </div>

                {activeTab === 'email' && (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#b39e49] text-white py-2 rounded hover:bg-[#d4b63a] transition"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                )}

                {activeTab === 'otp' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile"
                                value={mobile}
                                onChange={(e) => {
                                    setMobile(e.target.value);
                                    setErrors({ ...errors, mobile: '' });
                                }}
                                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter mobile number"
                            />
                            {errors.mobile && <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>}
                        </div>

                        {!otpSent ? (
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-[#b39e49] text-white py-2 rounded hover:bg-[#d4b63a] transition"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium">Enter OTP</label>
                                    <input
                                        required
                                        type="text"
                                        name="otp"
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value);
                                            setErrors({ ...errors, otp: '' });
                                        }}
                                        className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.otp ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter the OTP"
                                    />
                                    {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp}</p>}
                                </div>
                                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    className="w-full bg-[#b39e49] text-white py-2 rounded hover:bg-[#d4b63a] transition"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </button>
                            </>
                        )}
                    </div>
                )}

                <p className="text-sm text-center mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[#b39e49] hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
