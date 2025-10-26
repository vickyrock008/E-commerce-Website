// src/pages/Contact.jsx

import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';

// Using one of the provided images
import contactBgImage from '../assets/images/bg_img/contact.png';

const faqData = [
  {
    question: "Do you offer delivery services?",
    answer: "Yes, we offer delivery within a 50-mile radius of our shop. You can select the delivery option at checkout."
  },
  {
    question: "What are your business hours?",
    answer: "Our shop is open Monday to Saturday from 9:00 AM to 6:00 PM. We are closed on Sundays."
  },
  {
    question: "Can I place a custom order?",
    answer: "Absolutely! For custom cuts or bulk orders, please contact us at least 48 hours in advance to ensure we can meet your needs."
  },
  {
    question: "How do you ensure the quality of your meat?",
    answer: "We source our meat from local, sustainable farms that adhere to strict ethical and quality standards. Our expert butchers perform a final inspection on every cut."
  }
];

export default function Contact() {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.promise(
      api.post('/api/contact/', formData),
      {
        loading: 'Sending your message...',
        success: () => {
          setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form
          setIsSubmitting(false);
          return 'Message sent successfully!';
        },
        error: () => {
          setIsSubmitting(false);
          return 'Failed to send message.';
        },
      }
    );
  };

  const FormInput = ({ label, name, type = 'text', required = false, value, onChange }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
        required={required}
      />
    </div>
  );

  return (
    <div
      className="w-full min-h-screen page-section"
      style={{
        backgroundImage: `url(${contactBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Get In Touch
          </h1>
          <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto">
            We're here to answer any questions you may have.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
              <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              <FormInput label="Phone Number (Optional)" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Your Inquiry *
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border-b border-gray-300 last:border-b-0">
                  <button
                    onClick={() => handleToggle(index)}
                    className="flex justify-between items-center w-full py-4 text-left text-lg font-medium text-gray-800 hover:text-red-700 transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-6 h-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-600 text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
