import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Balance = () => {
  const { accountData } = useSelector((state) => state.account);
  const [isPinVerified, setIsPinVerified] = useState(false);

  useEffect(() => {
    if (accountData && !isPinVerified) {
      Swal.fire({
        title: "PIN REQUIRED",
        text: "Please enter your PIN to view your balance.",
        input: "password",
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return "Please enter your PIN.";
          } 
        },
      }).then((result) => {
        if (result.isConfirmed) {
          if (accountData.pin === result.value) {
            setIsPinVerified(true);
          } else {
            Swal.fire({
              title: "Incorrect PIN",
              text: "The entered PIN is incorrect.",
              icon: "error",
            });
          }
        }
      });
    }
  }, [accountData, isPinVerified]);

  if (!accountData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f4f8',
          padding: '20px',
        }}
      >
        <Typography variant="h5" color="error">
          Account data is not available. Please try again later.
        </Typography>
      </Box>
    );
  }

  if (!isPinVerified) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8',
        padding: '20px',
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          padding: '20px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '15px',
          backgroundColor: '#ffffff',
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="div"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#3f51b5',
            }}
          >
            Current Balance
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            <Typography
              variant="h3"
              component="div"
              sx={{
                color: '#3f51b5',
                zIndex: 1,
                fontWeight: 'bold',
              }}
            >
              ₹{accountData.initialDeposit}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Your current balance is up to date.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Balance;
