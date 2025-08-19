import React from 'react';
import FreeChatBot from './components/FreeChatBot';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <header className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-pink-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 drop-shadow-lg">
                      LashBeauty
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 drop-shadow-lg">
                      ByKim
                    </span>
                  </h1>
                </div>
                <div className="ml-4">
                  <p className="text-pink-200/80 font-light">Premium Lash Extensions & Beauty</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <nav className="flex space-x-8">
                  <a href="#services" className="text-pink-200 hover:text-pink-400 transition-colors duration-300 hover:drop-shadow-lg">Services</a>
                  <a href="#about" className="text-pink-200 hover:text-pink-400 transition-colors duration-300 hover:drop-shadow-lg">About</a>
                  <a href="#contact" className="text-pink-200 hover:text-pink-400 transition-colors duration-300 hover:drop-shadow-lg">Contact</a>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 drop-shadow-2xl">
                Book Your Perfect
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 drop-shadow-2xl">
                Lash Experience
              </span>
            </h2>
            <div className="relative">
              <p className="text-xl text-pink-200/90 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm">
                Chat with <span className="text-pink-400 font-semibold glow-text">Lash Beauty Bot</span>, our AI assistant, to find the perfect lash service and book your appointment instantly. 
                Get personalized recommendations and answers to all your lash questions!
              </p>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-pink-400/50 rounded-full animate-ping"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-500/50 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="group relative bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 hover:border-pink-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-pink-400 mb-4 group-hover:text-pink-300 transition-colors duration-300">
                  <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-200 transition-colors duration-300">Expert Consultation</h3>
                <p className="text-pink-200/80 group-hover:text-pink-100/90 transition-colors duration-300">Get personalized lash recommendations based on your eye shape, lifestyle, and preferences.</p>
              </div>
            </div>

            <div className="group relative bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 hover:border-pink-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-pink-400 mb-4 group-hover:text-pink-300 transition-colors duration-300">
                  <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-200 transition-colors duration-300">Instant Booking</h3>
                <p className="text-pink-200/80 group-hover:text-pink-100/90 transition-colors duration-300">Book your appointment in real-time with our intelligent scheduling system.</p>
              </div>
            </div>

            <div className="group relative bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 hover:border-pink-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-pink-400 mb-4 group-hover:text-pink-300 transition-colors duration-300">
                  <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-200 transition-colors duration-300">Premium Care</h3>
                <p className="text-pink-200/80 group-hover:text-pink-100/90 transition-colors duration-300">Enjoy luxury lash services with the highest quality materials and techniques.</p>
              </div>
            </div>
          </div>

          <FreeChatBot />
        </main>

        <footer className="relative z-10 bg-black/60 backdrop-blur-lg border-t border-pink-500/20 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500 drop-shadow-lg">LashBeauty</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-lg">ByKim</span>
                </h3>
                <p className="text-pink-200/80 mb-4">
                  Premium lash extension services by Kim with personalized booking assistance.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-pink-300/60 hover:text-pink-400 transition-colors duration-300 hover:drop-shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-pink-300/60 hover:text-pink-400 transition-colors duration-300 hover:drop-shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.747.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-pink-300/60 hover:text-pink-400 transition-colors duration-300 hover:drop-shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-pink-300">Services</h4>
                <ul className="space-y-2 text-pink-200/60">
                  <li><a href="#" className="hover:text-pink-400 transition-colors duration-300">Classic Lashes</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors duration-300">Volume Lashes</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors duration-300">Mega Volume</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors duration-300">Lash Lift & Tint</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-pink-300">Contact</h4>
                <div className="space-y-2 text-pink-200/60">
                  <p>📍 123 Beauty Lane, City</p>
                  <p>📞 (555) 123-4567</p>
                  <p>✉️ hello@lashbeautybykim.com</p>
                  <p>🕒 Mon-Sat: 9AM-7PM</p>
                </div>
              </div>
            </div>
            <div className="border-t border-pink-500/20 mt-8 pt-8 text-center text-pink-200/60">
              <p>&copy; 2024 LashBeautyByKim. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;