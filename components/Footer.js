
import React from 'react';
import Image from 'next/legacy/image';

const Footer = () => {
    return (
        <footer className="bg-[#f5f5f5] text-gray-800 py-14 mt-20">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:justify-between">
                {/* Brand Section */}
            
                    <a className=" text-gray-800 hover:text-[#2b6cb0] ">
                        <Image src="/fklogo.png" alt="Logo" width={50} height={50} />
                        <span className="brandName  font-bold text-lg">fixKaput</span>
                    </a>
                

                {/* Navigation Links */}
                <div className="flex flex-wrap lg:w-2/3 mb-8 lg:mb-0">
                    <div className="w-full lg:w-1/4 px-4 mb-6 lg:mb-0">
                        <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">Company</h2>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-[#2b6cb0] transition duration-300">About Us</a></li>
                            <li><a href="#" className="hover:text-[#2b6cb0] transition duration-300">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-[#2b6cb0] transition duration-300">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="w-full lg:w-1/4 px-4 mb-6 lg:mb-0">
                        <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">For Customers</h2>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-[#2b6cb0] transition duration-300">Services Near You</a></li>
                            <li><a href="#" className="hover:text-[#2b6cb0] transition duration-300">Reviews</a></li>
                            <li><a href="#" className="hover:text-[#2b6cb0] transition duration-300">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="w-full lg:w-1/4 px-4">
                        <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-[#2b6cb0] transition duration-300">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-[#2b6cb0] transition duration-300">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-[#2b6cb0] transition duration-300">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-[#2b6cb0] transition duration-300">
                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-6 h-6" viewBox="0 0 24 24">
                                    <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                    <circle cx="4" cy="4" r="2" stroke="none"></circle>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;