// import { useState, React } from 'react'

import galingatganda from '../../assets/galingatganda.png'
import brgy410 from '../../assets/brgy410.png'
import barangaylogo from '../../assets/Barangaylogo.svg'
// import dropdown from '../../assets/icoon-drop-down.svg'

import { Link } from 'react-router-dom'

const Navbar = () => {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleDropdown = () => setIsOpen(prev => !prev);

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

            <li>
              <Link to="/Contacts" className="hover:text-blue-600 transition">
                CONTACT US
              </Link>
            </li>

            <li>
              <Link to="/Login" className="hover:text-blue-600 transition">
                LOGIN
              </Link>
            </li>
            
            <li>
              <Link to="/Register" className="hover:text-blue-600 transition">
                REGISTER
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