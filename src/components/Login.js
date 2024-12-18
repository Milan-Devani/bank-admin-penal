import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from './LoginSlices/loginReducer.js';
import bgimg from '../assets/img/blur-img.jpeg'

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/auth?username=${form.username}&password=${form.password}&role=${form.role}`);
      const users = response.data;

      if (users.length > 0) {
        const user = users[0];
        dispatch(setUser(user));
        login(user);

        switch (user.role) {
          case 'admin':
            navigate('/admin-dashboard', { state: { user } });
            break;
          case 'user':
            navigate('/user-dashboard', { state: { user } });
            break;
          case 'employer':
            navigate('/employer-dashboard', { state: { user } });
            break;
          default:
            setError('Unexpected role. Please contact support.');
        }
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ backgroundImage: `url(${bgimg})` }} className="bg-cover bg-center h-screen">
      <div className='py-[120px]'>
        <div className='backdrop-blur-md bg-white/20 reletive z-[1] border rounded-2xl' style={styles.container}>
          <h2 className='text-center text-zinc-500 text-[42px] ' style={{ fontFamily: 'Georgia, serif' }}>LOGIN</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form className='pb-[20px]' onSubmit={handleSubmit} style={styles.form}>
            <div className='' style={styles.formGroup}>
              <label className='text-[21px] text-zinc-500 mb-[5px]'>Username :</label>
              <Grid item xs={12} >
                <TextField
                  margin="dense"
                  label="Username"
                  name="username"
                  variant="outlined"
                  fullWidth
                  value={form.username}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      border: '1px solid rgb(113 113 122)',
                      borderradius: '10px',
                      color: 'rgb(113 113 122)',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: 'rgb(113 113 122)',
                    },
                  }}

                />
              </Grid>
            </div>
            <div className='' style={styles.formGroup}>
              <label className='text-[21px] text-zinc-500'>Password:</label>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="off"
                  InputProps={{
                    style: {
                      border: '1px solid rgb(113 113 122)',
                      color: 'rgb(113 113 122)',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: 'rgb(113 113 122)',
                    },
                  }}

                />
              </Grid>
            </div>
            <div style={styles.formGroup}>
              <label className='text-[21px] mr-[10px] text-zinc-500'>Role :</label>
              <select className='text-[20px] rounded-[5px] bg-transparent text-zinc-500 border border-zinc-500' name="role" value={form.role} onChange={handleChange} style={styles.input}>
                <option className='text-[18px] backdrop-blur-md bg-white/20 text-zinc-500' value="user">User</option>
                <option className='text-[18px] backdrop-blur-md bg-white/20 text-zinc-500' value="employer">Employer</option>
                <option className='text-[18px] backdrop-blur-md bg-white/20 text-zinc-500' value="admin">Admin</option>
              </select>
            </div>
            <button className='px-[10px] py-[8px] border bg-[#2828bd] text-white rounded-[5px]' type="submit" style={styles.button}>Login</button>
          </form>
          <p className='text-zinc-500'>
           <strong> Don't have an account ? </strong><Link className='text-blue-600 underline' to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: 'auto', padding: '20px' },
  form: { display: 'flex', flexDirection: 'column' },
  formGroup: { marginBottom: '15px' },
  input: { padding: '8px', fontSize: '16px' },
  error: { color: 'red' },
};

export default Login;
