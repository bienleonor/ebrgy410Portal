import React from 'react'
import { Link } from 'react-router-dom'

const RequestTimeoutPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 to-purple-500 text-white">
      <h1 className="text-6xl font-bold mb-4">408</h1>
      <p className="text-2xl mb-8">REQUEST TIMEOUT</p>
      <p className="text-lg mb-8">The server timed out waiting for the request</p>
      <Link to="/">
        <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          GO BACK HOME
        </button>
      </Link>
    </div>
  )
}

export default RequestTimeoutPage;
