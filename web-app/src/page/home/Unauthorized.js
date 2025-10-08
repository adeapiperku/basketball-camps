import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#d32f2f', marginBottom: '16px' }}>
        You are not authorized to access this page.
      </h1>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#115293')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#1976d2')}
      >
        Go to home page
      </Link>
    </div>
  );
};

export default Unauthorized;
