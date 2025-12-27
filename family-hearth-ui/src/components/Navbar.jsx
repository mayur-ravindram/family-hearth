import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { accessToken, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`;
  const desktopNavLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`;

  const UserAvatar = () => (
    user?.avatarUrl ? (
      <img src={user.avatarUrl} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
    ) : (
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-[2px]">
        <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
          {user && user.firstName ? (user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase()) : 'U'}
        </div>
      </div>
    )
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            {/* add poppins style to his NavLink */}
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            </style>
            <NavLink to="/" className="text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>
            TBA
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/" className={desktopNavLinkClasses}>Home</NavLink>
              {accessToken && (
                <>
                  <NavLink to="/dashboard" className={desktopNavLinkClasses}>Family Feed</NavLink>
                  <NavLink to="/create-post" className={desktopNavLinkClasses}>Share a Moment</NavLink>
                  <NavLink to="/create-family" className={desktopNavLinkClasses}>Start a Family</NavLink>
                  <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Sign Out</button>
                  <NavLink to="/profile">
                    <UserAvatar />
                  </NavLink>
                </>
              )}
              {!accessToken && (
                <NavLink to="/login" className={desktopNavLinkClasses}>Sign In</NavLink>
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
              <div className="flex items-center justify-between">
                <NavLink to="/dashboard" className={navLinkClasses}>Family Feed</NavLink>
                <NavLink to="/profile">
                  <UserAvatar />
                </NavLink>
              </div>
              <NavLink to="/create-post" className={navLinkClasses}>Share a Moment</NavLink>
              <NavLink to="/create-family" className={navLinkClasses}>Start a Family</NavLink>
              <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Sign Out</button>
            </>
          )}
          {!accessToken && (
            <NavLink to="/login" className={navLinkClasses}>Sign In</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
