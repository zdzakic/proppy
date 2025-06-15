import { useState, useContext } from 'react';
import axios from '../util/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../util/validators';
import Loader from '../components/Loader';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Invalid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    if (!valid) return;

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axios.post('/token/', { email, password });
      const { access, refresh, user } = res.data;

      login({ access, refresh, user });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative'>
      {loading && <Loader />}
    <div className="flex justify-center px-4 py-16 bg-light dark:bg-[#0e1625]">
      <div className="bg-white dark:bg-[#1a2538] rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 text-center">
          Sign in to Proppy
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="you@example.com"
              autoFocus
              className={`input input-bordered w-full bg-white dark:bg-[#1e2d45] text-navy dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border ${
                emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-2">{emailError}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input input-bordered w-full pr-10 bg-white dark:bg-[#1e2d45] text-navy dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border ${
                passwordError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 text-sm"
            >
              {showPassword ? '👁️' : '👁️'}
            </span>
            {passwordError && (
              <p className="text-sm text-red-500 mt-2">{passwordError}</p>
            )}
          </div>

          {/* GLOBAL ERROR */}
          {error && (
            <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
