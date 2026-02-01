import React from 'react'
import { Link } from 'react-router-dom'

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500 text-white">
      <h1 className="text-6xl font-bold mb-4">401</h1>
      <p className="text-2xl mb-8">UNAUTHORIZED</p>
      <p className="text-lg mb-8">You need to log in to access this page</p>
      <Link to="/login">
        <button className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          GO TO LOGIN
        </button>
      </Link>
    </div>
  )
}

export default UnauthorizedPage;
