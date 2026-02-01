import React from 'react'
import { Link } from 'react-router-dom'

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-400 to-red-500 text-white">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <p className="text-2xl mb-8">FORBIDDEN</p>
      <p className="text-lg mb-8">You don't have permission to access this resource</p>
      <Link to="/">
        <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          GO BACK HOME
        </button>
      </Link>
    </div>
  )
}

export default ForbiddenPage;
