import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Static credentials
    if (credentials.username === 'admin' && credentials.password === 'krishna123') {
      onLogin(true);
      setError('');
    } else {
      setError('Invalid credentials');
      onLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-600 mt-2">Access your Kanha Collection dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-semibold"
            >
              Login to Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Demo Credentials: <br />
              Username: <code className="bg-gray-100 px-2 py-1 rounded">admin</code> <br />
              Password: <code className="bg-gray-100 px-2 py-1 rounded">krishna123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;