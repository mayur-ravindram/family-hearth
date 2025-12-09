import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { accessToken, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`;
  const desktopNavLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold">FamilyHearth</NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={desktopNavLinkClasses}>Home</NavLink>
              {accessToken && (
                <>
                  <NavLink to="/dashboard" className={desktopNavLinkClasses}>Dashboard</NavLink>
                  <NavLink to="/create-post" className={desktopNavLinkClasses}>Create Post</NavLink>
                  <NavLink to="/create-family" className={desktopNavLinkClasses}>Create Family</NavLink>
                  <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Logout</button>
                </>
              )}
              {!accessToken && (
                <NavLink to="/login" className={desktopNavLinkClasses}>Login</NavLink>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleMenu} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/" className={navLinkClasses}>Home</NavLink>
          {accessToken && (
            <>
              <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>
              <NavLink to="/create-post" className={navLinkClasses}>Create Post</NavLink>
              <NavLink to="/create-family" className={navLinkClasses}>Create Family</NavLink>
              <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Logout</button>
            </>
          )}
          {!accessToken && (
            <NavLink to="/login" className={navLinkClasses}>Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
