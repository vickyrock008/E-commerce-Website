// src/pages/CertificationPage.jsx

import React from "react"
import fssaiImage from '../assets/images/certificates/fssai.png';
import gstImage from '../assets/images/certificates/gst.png';
import { motion } from 'framer-motion';

import certBgImage from '@/assets/images/bg_img/cert.png';


export default function CertificationPage() {
  return (
    <div
      className="w-full min-h-screen page-section flex items-center"
      style={{
        backgroundImage: `url(${certBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            Our Certifications
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            We are committed to quality, safety, and transparency.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-6 rounded-xl shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
            <h3 className="text-2xl font-bold text-red-700 mb-4 text-center">FSSAI License</h3>
            <img 
              src={fssaiImage} 
              alt="FSSAI License" 
              className="w-full h-auto rounded-lg shadow-md" 
              onError={(e) => { e.target.src = 'https://placehold.co/600x400/fecaca/b91c1c?text=FSSAI+Image' }}
            />
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-6 rounded-xl shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
            <h3 className="text-2xl font-bold text-red-700 mb-4 text-center">GST Certificate</h3>
            <img 
              src={gstImage} 
              alt="GST Certificate" 
              className="w-full h-auto rounded-lg shadow-md" 
              onError={(e) => { e.target.src = 'https://placehold.co/600x400/dbeafe/1d4ed8?text=GST+Image' }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
