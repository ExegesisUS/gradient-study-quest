import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { SubscriptionStatus } from './components/SubscriptionStatus';
import { PricingPage } from './pages/PricingPage';
import { SuccessPage } from './pages/SuccessPage';
import { GraduationCap, LogOut, CreditCard, Hop as Home } from 'lucide-react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && (
          <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex items-center space-x-2">
                  <GraduationCap className="w-8 h-8 text-indigo-600" />
                  <span className="text-xl font-bold text-gray-900">ADA Education</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/pricing"
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Plans</span>
                  </Link>
                  <SubscriptionStatus />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/success" element={<SuccessPage />} />
          <Route
            path="/pricing"
            element={
              user ? <PricingPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <div className="container mx-auto px-4 py-16">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to ADA Education
                      </h1>
                      <p className="text-xl text-gray-600">
                        Your personalized learning journey starts here
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Learning Tools
                        </h3>
                        <p className="text-gray-600">
                          Access comprehensive study materials and interactive learning tools.
                        </p>
                      </div>

                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                          <div className="w-6 h-6 bg-green-600 rounded"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Progress Tracking
                        </h3>
                        <p className="text-gray-600">
                          Monitor your learning progress and identify areas for improvement.
                        </p>
                      </div>

                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                          <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Flashcards
                        </h3>
                        <p className="text-gray-600">
                          Study efficiently with our intelligent flashcard system.
                        </p>
                      </div>
                    </div>

                    <div className="mt-12 text-center">
                      <Link
                        to="/pricing"
                        className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Upgrade Your Plan
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-screen flex items-center justify-center px-4">
                  <AuthForm onAuthSuccess={() => {}} />
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;