import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext.js';
import { api } from '../lib/api.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api('/session')
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch((error) => {
        if (active) setError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = { children: PropTypes.node.isRequired };
