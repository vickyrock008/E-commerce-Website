import React from "react"
// ✨ 1. Import the certificate images from their new home in 'src/assets'
import fssaiImage from '../assets/images/certificates/fssai.png';
import gstImage from '../assets/images/certificates/gst.png';

export default function CertificationPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Our Certifications</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border p-4 rounded shadow">
          <h3 className="font-semibold mb-2">FSSAI License</h3>
          {/* ✨ 2. Use the imported fssaiImage variable here */}
          <img src={fssaiImage} alt="FSSAI License" className="w-full h-auto" />
        </div>
        <div className="border p-4 rounded shadow">
          <h3 className="font-semibold mb-2">GST Certificate</h3>
          {/* ✨ 3. Use the imported gstImage variable here */}
          <img src={gstImage} alt="GST Certificate" className="w-full h-auto" />
        </div>
      </div>
    </div>
  )
}