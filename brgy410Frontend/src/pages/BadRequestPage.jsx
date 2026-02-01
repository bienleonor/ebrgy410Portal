import React from 'react'
import { Link } from 'react-router-dom'

const BadRequestPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 text-white">
      <h1 className="text-6xl font-bold mb-4">400</h1>
      <p className="text-2xl mb-8">BAD REQUEST</p>
      <p className="text-lg mb-8">The request could not be understood or was missing required parameters</p>
      <Link to="/">
        <button className="px-6 py-3 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          GO BACK HOME
        </button>
      </Link>
    </div>
  )
}

export default BadRequestPage;
