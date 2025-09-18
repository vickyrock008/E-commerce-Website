import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Meat3D from '../components/Meat3D'

export default function ProductDetail({ addToCart }){
  const { id } = useParams()
  const [p, setP] = useState(null)
  
  useEffect(()=>{
    axios.get(import.meta.env.VITE_API_URL + '/api/products/' + id + '/').then(r=>setP(r.data)).catch(()=>{})
  },[id])

  if(!p) return <div>Loading...</div>

  return (
    <div className='grid md:grid-cols-2 gap-12 items-center'>
      <div className="w-full h-[32rem]">
        <Meat3D />
      </div>
      <div>
        <h1 className='text-4xl font-extrabold tracking-tight'>{p.name}</h1>
        <p className='mt-4 text-gray-600 leading-relaxed'>{p.description}</p>
        <div className='mt-6 text-3xl font-bold text-red-700'>₹{p.price}</div>
        
        <div className="mt-6">
            {p.stock > 0 ? (
                <>
                    <p className="text-lg text-green-700 font-semibold mb-3">{p.stock} in stock</p>
                    <button 
                        onClick={() => addToCart(p)}
                        className='w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105'>
                        Add to Cart
                    </button>
                </>
            ) : (
                <div className="text-center font-bold text-xl text-red-700 bg-red-100 py-4 rounded-lg">
                    Currently Out of Stock
                </div>
            )}
        </div>
      </div>
    </div>
  )
}