import { useContext } from 'react';
   import { Link } from 'react-router-dom';
   import { AuthContext } from '../context/AuthContext';

   function Navbar() {
     const { user, logout } = useContext(AuthContext);
     console.log('Navbar.jsx: User state:', user);

     return (
       <nav className="header">
         <h1 className="title">Personal Finance Assistant</h1>
         <div>
           {user ? (
             <>
               <Link to="/" className="nav-link">Dashboard</Link>
               <Link to="/upload" className="nav-link">Upload Receipt</Link>
               <button onClick={logout} className="submit-button" style={{ padding: '5px 15px', width: 'auto' }}>Logout</button>
             </>
           ) : (
             <>
               <Link to="/login" className="nav-link">Login</Link>
               <Link to="/register" className="nav-link">Register</Link>
             </>
           )}
         </div>
       </nav>
     );
   }

   export default Navbar;