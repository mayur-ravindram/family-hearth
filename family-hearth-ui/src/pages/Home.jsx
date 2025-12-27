import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Home() {
  const { accessToken, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if the user is already logged in
    if (!loading && accessToken) {
      navigate('/dashboard');
    }
  }, [loading, accessToken, navigate]);

  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] py-12 md:py-20">
          {/* Left Column: Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              <span className="block">TBA</span>
              <span className="block text-blue-600">TBA</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
              A private, ad-free space exclusively for your family. Share memories, stay connected, and cherish your moments together in a place that belongs to you.
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Column: Illustration Placeholder */}
          <div className="relative h-64 md:h-full w-full">
             <div className="flex items-center justify-center w-full h-full bg-slate-200 rounded-2xl">
                <img
                  src="/illustration.png"
                  alt="Family Illustration"
                  className="max-h-full max-w-full object-contain"
                />
             </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wider uppercase">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to stay close
            </p>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
              FamilyHearth is designed to be your family's private corner of the internet.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Private & Secure</h3>
              <p className="mt-2 text-base text-slate-600">
                Your family's moments are yours alone. No ads, no tracking. Just a safe space for your family.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto">
                 <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Share Memories</h3>
              <p className="mt-2 text-base text-slate-600">
                Post photos, videos, and stories to a shared family timeline. Relive your favorite moments anytime.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto">
                 <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6l2-2h2z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Stay Connected</h3>
              <p className="mt-2 text-base text-slate-600">
                Create events, send messages, and keep up with family news, no matter where you are in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-500">
            <p>&copy; 2025 FamilyHearth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;