import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Home() {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      navigate('/dashboard');
    }
  }, [loading, token, navigate]);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-gray-800 text-white text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Connect with your family in a private, ad-free space.</h1>
        <p className="text-xl mb-8">Share memories, stay in touch, and build a digital hearth for your loved ones.</p>
        <div className="space-x-4">
          <a href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
            Get Started
          </a>
          <a href="#features" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
            Learn More
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">Private & Secure</h3>
              <p>Your family's moments are yours alone. No ads, no tracking. Just a safe space for your family.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">Share Memories</h3>
              <p>Post photos, videos, and stories to a shared family timeline. Relive your favorite moments anytime.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
              <p>Create events, send messages, and keep up with family news, no matter where you are in the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>&copy; 2025 FamilyHearth. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
