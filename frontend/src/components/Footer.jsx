import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-white w-full">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
       {/* Left Section */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
            nobis quam quia molestias dolorum dicta, voluptate dolor officiis ab
            magni facere quaerat tenetur, sequi fuga.
          </p>
        </div>
        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/delivery">Delivery</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
         {/* Contact */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><a href="tel:+12124567890">+1-212-456-7890</a></li>
            <li><a href="mailto:info@company.com">info@company.com</a></li>
          </ul>
        </div>
        

      </div>
      {/*Copyright section*/}
        <div className="w-full"> 
          <hr className="w-full border-gray-300"/>
          <p className='py-5 text-sm text-center'>
            Copyright 2025@ forever.com - All rights reserved.
          </p>
        </div>
    </div>
  );
};

export default Footer;

