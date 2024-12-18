import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container } from '@mui/material';

function ChangePin() {
  const { accountData } = useSelector((state) => state.account);
  const navigate = useNavigate();

  const [inputAccountNumber, setInputAccountNumber] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleAccountNumberChange = (e) => setInputAccountNumber(e.target.value);
  const handleOldPinChange = (e) => setOldPin(e.target.value);
  const handlePinChange = (e) => setNewPin(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputAccountNumber === accountData.accountNumber && oldPin === accountData.pin) {
      try {
        const updatedData = { pin: newPin };

        await axios.patch(`http://localhost:5000/bankaccount/${accountData.id}`, updatedData);

        Swal.fire({
          title: 'Success!',
          text: 'PIN updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/Login');
        });

      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Error updating PIN',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Account number or old PIN does not match',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Box 
        className="shadow-2xl bg-white p-6 rounded-lg shadow-md" 
        sx={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px',  }}
      >
        <Typography variant="h4" component="h2" className="text-center mb-6" sx={{ marginBottom: '24px', fontWeight: 'bold' }}>
          Change PIN
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            id="inputAccountNumber"
            label="Account Number"
            variant="outlined"
            fullWidth
            value={inputAccountNumber}
            onChange={handleAccountNumberChange}
            required
            autoComplete="off"
          />
          <TextField
            id="oldPin"
            label="Old PIN"
            variant="outlined"
            type="password"
            fullWidth
            value={oldPin}
            onChange={handleOldPinChange}
            required
            autoComplete="current-password"
          />
          <TextField
            id="newPin"
            label="New PIN"
            variant="outlined"
            type="password"
            fullWidth
            value={newPin}
            onChange={handlePinChange}
            required
            autoComplete="new-password"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ padding: '12px', fontWeight: 'bold', textTransform: 'none' }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Update PIN
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default ChangePin;