import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 to-pink-500 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">PAGE NOT FOUND</p>
      <Link to="/">
        <button className="px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          GO BACK HOME
        </button>
      </Link>
    </div>
  )
}

export default NotFoundPage;