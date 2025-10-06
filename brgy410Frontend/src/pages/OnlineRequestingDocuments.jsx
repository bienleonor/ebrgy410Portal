import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const Form = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="h-screen">
      <Navbar />
      <div className="bg-white/25 backdrop-blur-md border border-pink-700/20 rounded-4xl shadow-xl m-10 p-6 h-100">
        <h2 className="text-center text-3xl font-bold">
          Online Document Requesting System
        </h2>

        <div className="relative w-full p-10">
          <select
            name="docuType"
            id="docuType"
            className="w-full appearance-none text-xl font-semibold border border-pink-700/20 rounded-2xl p-5 pr-12 backdrop-blur-md focus:outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <option value="">Choose from:</option>
            <option value="Clearance">Certificate of Clearance</option>
            <option value="Indigency">Certificate of Indigency</option>
            <option value="BusinessPermit">Business Certification (Permit)</option>
            <option value="FirstTimeJobSeeker">First Time Job Seeker Permit</option>
            <option value="WorkingPermit">Working Permit</option>
          </select>

          <div className="pointer-events-none absolute right-14 top-[47%] transform -translate-y-1/2 text-pink-700 transition-transform duration-300">
            <ChevronDown
              className={`w-6 h-6 transform transition-transform ${
                isFocused ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
