"use client";

import { Copyright, Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-black opacity-60 w-full flex flex-col items-center py-4 px-3 gap-y-4">
        <span className="text-xl text-white text-center">Follow us</span>
        {/* <img src="/logo.png" alt="Company Logo" className="w-[100px] h-[100px]"/> */}
        {/* <input
            type="text"
            placeholder="Enter your email address here"
            className="border-b border-gray-100 focus:outline-none placeholder:text-white w-full px-4 py-1 text-white"
        /> */}
        {/* <button className="py-2 px-4 text-base text-white bg-transparent rounded-2xl border border-gray-200">Subscribe now</button>
        <div className="flex justify-between w-full px-5">
            <div className="flex flex-col gap-y-2">
                <span className="text-base text-white">Help</span>
                <span className="text-base text-white">FAQ</span>
                <span className="text-base text-white">Customer Service</span>
                <span className="text-base text-white">How to guides</span>
                <span className="text-base text-white">Contact us</span>
            </div>
            <div className="flex flex-col gap-y-2">
                <span className="text-base text-white">Other</span>
                <span className="text-base text-white">Privacy Policy</span>
                <span className="text-base text-white">Sitemap</span>
                <span className="text-base text-white">Previous Order</span>
            </div>
        </div> */}
        <div className="flex justify-between w-full px-5">
            
        <Instagram className="size-9 text-white"/>
        
        <Facebook className="size-9 text-black bg-white rounded-full p-1"/>

        <Youtube className="size-9 text-black bg-white rounded-full p-1"/>

        <Linkedin className="size-9 text-black bg-white rounded-full p-1"/>

        <X className="size-9 text-black bg-white rounded-full p-1"/>
        </div>
        <div className="flex justify-between w-full px-5">
            
        <span className="text-xl text-white text-center">All rights reserved</span>
        <span className="text-xl text-white text-center flex items-center gap-x-1">© 2025</span>
        </div>
    </div>
  )
}

export default Footer