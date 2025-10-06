import { useState, React } from 'react'

import galingatganda from '../../assets/galingatganda.png'
import brgy410 from '../../assets/brgy410.png'
import barangaylogo from '../../assets/Barangaylogo.svg'
import dropdown from '../../assets/icoon-drop-down.svg'

import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-8xl p-4">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <ul className="flex items-center gap-8">
            <li>
              <Link to="/">
                <img src={galingatganda} alt="GALING AT GANDA" className="w-[140px]" />
              </Link>
            </li>
            <li>
              <Link to="/">
                <img src={brgy410} alt="Barangay Logo" className="w-20" />
              </Link>
            </li>
            <li className="text-xl font-semibold">
              <h2>
                Barangay 410 <br /> Zone 42
              </h2>
            </li>
          </ul>

          {/* Right Section */}
          <ul className="flex items-center gap-8 text-xl font-bold">
            <li>
              <Link to="/AboutUs" className="hover:text-blue-600 transition">
                ABOUT US
              </Link>
            </li>
            <li>
              <Link to="/ResolutionandOrdinance" className="hover:text-blue-600 transition">
                RESOLUTION & ORDINANCE
              </Link>
            </li>

            {/* Dropdown */}
            <li className="relative cursor-pointer">
              <div onClick={toggleDropdown} className="inline-flex items-center select-none">
                SERVICES
                <img src={dropdown} alt="Dropdown" className="w-5 ml-2" />
              </div>

              {isOpen && (
                <ul className="absolute bg-white border border-black mt-3 rounded z-50 min-w-[200px] shadow-lg">
                  <li className="p-2 hover:bg-gray-200">
                    <Link to="/OnlineRequestingDocuments">Online Requesting Document</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-200">tba</li>
                  <li className="p-2 hover:bg-gray-200">tba</li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/Contacts" className="hover:text-blue-600 transition">
                CONTACT US
              </Link>
            </li>

            <li>
              <img src={barangaylogo} alt="MANILA LOGO" className="w-[60px]" />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;