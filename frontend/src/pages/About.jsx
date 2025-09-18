import React from 'react';
// ✨ 1. Import the logo from its new location
import meatImage from '../assets/images/beef_images/logo.png';

export default function About() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* ... (The top part of the file is the same) ... */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight leading-tight">
            Our Story, Our Craft, Our Commitment
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Classic Meat & Products is more than just a shop; it's a legacy of quality, passion, and trust.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12 transition-transform duration-500 ease-in-out hover:scale-[1.02]">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-red-700">A Tradition of Excellence</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Founded on the simple principle that good food starts with good meat, we have dedicated ourselves to sourcing the finest, responsibly raised products. Our journey began with a small local farm and has grown into a commitment to bringing exceptional quality to your table. We believe in transparency and the time-honored traditions of butchery.
            </p>
          </div>
          <div className="md:w-1/2">
            {/* ✨ 2. Use the imported logo variable here */}
            <img 
              src={meatImage} 
              alt="A butcher preparing meat" 
              className="rounded-lg shadow-lg w-full h-auto object-cover" 
            />
          </div>
        </div>
        {/* ... (The rest of the file is the same) ... */}
        <div className="grid md:grid-cols-3 gap-8 text-center mt-16">
          <div className="bg-white p-8 rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-gray-800">Quality You Can Taste</h3>
            <p className="mt-2 text-gray-600">
              From our farms to your fork, every cut is inspected to meet our strict standards for flavor, tenderness, and freshness.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-gray-800">Sustainably Sourced</h3>
            <p className="mt-2 text-gray-600">
              We partner with local farmers who share our commitment to ethical and sustainable farming practices.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-gray-800">Expertise & Passion</h3>
            <p className="mt-2 text-gray-600">
              Our team of expert butchers is passionate about their craft, providing personalized service and advice.
            </p>
          </div>
        </div>
        <div className="text-center mt-12 bg-red-700 text-white py-12 px-6 rounded-lg">
          <h2 className="text-3xl font-bold">Ready to Experience the Difference?</h2>
          <p className="mt-2 text-lg">
            Explore our selection of premium cuts and products.
          </p>
          <a href="/shop" className="mt-6 inline-block bg-white text-red-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300">
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}