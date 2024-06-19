import { React, useState, useEffect } from 'react'
import './Banner.css'
import { FaCircleUser } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import LogoComponent from '../LogoComponent';
import useAuth from "../../hooks/useAuth";
import StudySpots from '../../Data/StudySpots';

const Banner = ({ filterSelected, onFilterSelect, cards, setCards }) => {
  const [searchTerm, setSearchTerm] = useState(''); // State to track whether a search term has been entered into search bar
  const [isOpen, setIsOpen] = useState(false); // State to track whether the auth navbar is open or closed
  const navigate = useNavigate();

  // Function to handle the change in the search bar
  const handleChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Function to handle search from search bar
  const handleSearch = async (e) => {
    // Perform search operation with searchTerm
    e.preventDefault();
    if (searchTerm.length === 0) {
      await onFilterSelect([]);
      await setCards(StudySpots);
    }
    if (searchTerm.length > 0) {
      const queriedStudySpots = StudySpots.filter((studySpot) => {
        return studySpot.name.toLowerCase().match(searchTerm);
      })
      await onFilterSelect([]);
      await setCards(queriedStudySpots);
    }
  };

  // Function to toggle the auth navbar state
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // for authorization
  const { setAuth, auth } = useAuth();
  const handleAuth = (auth) => {
    if (auth?.roles === 2004) {
      return (
        <div class="dropdown-content">
          <button onClick={() => { setAuth({}) }}>Sign out</button>
        </div>
      )
    } else {
      return (
        <div className="dropdown-content">
          <Link to="/signup">Sign up</Link>
          <Link to="/login">Log in</Link>
        </div>
      )
    }
  }

  return (
    <header>
      <div className="banner-container">
        <div className="logo-container">
          <LogoComponent />
          <button className="about-button" onClick={() => navigate("/about")}>About Us</button>
          <button className="goBack-button" onClick={() => navigate("/")}>Go Back</button>
          {/* <Link to="/about"> */}
          {/* </Link> */}
        </div>

        <div className="middle-container">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              className="input-search"
              type="text"
              value={searchTerm}
              onChange={handleChange}
              // onKeyDown={handleKeyDown}
              placeholder="Search study spots"
            />
            <button type="submit" className='search-button'><FaSearch className="icon" /></button>
          </form>
        </div>

        <div className="right-container">
          {/* Adding study spot btn */}

          <button className="suggest-button" onClick={() => navigate("spots")}>Suggest Spot</button>
          <div className={isOpen ? "user-nav open" : "user-nav"}>
            {/* User Navbar button */}
            <button className="dropdown-btn" onClick={toggleNavbar}>
              <GiHamburgerMenu className="icon" />
              <FaCircleUser className="icon" />
            </button>

            {/* User Navbar contents */}
            {isOpen && handleAuth(auth)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Banner