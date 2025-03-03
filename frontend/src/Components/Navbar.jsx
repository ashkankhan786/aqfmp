import { WiDaySunny } from "react-icons/wi";
import { Link } from "react-router-dom";
import './navbar.css';
const Navbar = () => {
    
  return (
    <nav className="bg text-white p-4 shadow-md w-screen">
      <div className="container mx-auto flex gap-10 items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <WiDaySunny className="text-yellow-300 mr-2" size={32} />
          Air Quality
        </h1>
        <Link to="/" className="flex items-center justify-center font-semibold cursor-pointer">Home</Link>
        <Link to="/about" className="flex items-center justify-center font-semibold cursor-pointer">About</Link>
        <Link to="/help" className="flex items-center justify-center font-semibold cursor-pointer">Help</Link>
      </div>
    </nav>
  );
};

export default Navbar;
