import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={styles.container}>
      <h2>Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/user-dashboard">Go to Dashboard</Link>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
};

export default Unauthorized;
