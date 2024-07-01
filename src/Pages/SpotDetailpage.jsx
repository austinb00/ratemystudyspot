import { React, useState, useEffect } from 'react'
import getDistanceFromLatLonInKm from '../Helpers/GetDistanceLatLon';
import Banner from '../Components/Banner/Banner';
import { useLocation } from 'react-router-dom';
import { getLocation } from '../Services/Utils/location';
import { BiVolumeMute } from "react-icons/bi";
import { TbSofa, TbBatteryCharging2, TbLockOpen, TbMicrowave } from "react-icons/tb";
import { MdOutlineFastfood, MdOutlineDoorFront, } from "react-icons/md";
import { GoRepoLocked } from "react-icons/go";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import './SpotDetailpage.scss'
import ReviewCard from '../Components/Review/ReviewCard';
import { Rating } from "@mui/material";
import AllReviewsCard from '../Components/Review/AllReviewsCard';
import { getReviewsByStudySpot } from '../Services/review';
import UBCMap from '../Components/UBCMap/UBCMap';
import { CircularProgress } from '@mui/material';
import { GiConsoleController } from 'react-icons/gi';
import AddReviewCard from '../Components/Review/AddReviewCard';
import Gallery from '../Components/Gallery/Gallery';

const images = require.context('../Components/Assets', true);

function getImage(imageLink) {
  const image = (typeof (imageLink) != 'undefined') ? images(`./${imageLink}`) : images(`./404.png`)
  return image;
}

const SpotDetailpage = () => {
  let location = useLocation();
  let state = location.state;

  const [summaryCardLoaded, setSummaryCardLoaded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  const filterOptions = [
    { label: 'Quiet', value: 'quiet', icon: <BiVolumeMute size={20} className="filter-icon" /> },
    // { label: 'Comfy', value: 'comfy', icon: <TbSofa size={20} className="filter-icon"/> },
    // { label: 'Not busy', value: 'not-busy', icon: <MdOutlineGroupOff size={20} className="filter-icon"/> },
    { label: 'Outlets', value: 'outlets', icon: <TbBatteryCharging2 size={20} className="filter-icon" /> },
    { label: 'Study Rooms', value: 'study-rooms', icon: <GoRepoLocked size={20} className="filter-icon" /> },
    { label: 'Microwaves', value: 'microwaves', icon: <TbMicrowave size={20} className="filter-icon" /> },
    { label: 'Food Near', value: 'food-near', icon: <MdOutlineFastfood size={20} className="filter-icon" /> },
    { label: 'Open Now', value: 'open-now', icon: <MdOutlineDoorFront size={20} className="filter-icon" /> },

    // Add more filter options as needed
  ];

  // const getCurrentLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => { // success case
  //       let user_lon = position.coords.longitude;
  //       let user_lat = position.coords.latitude;
  //       setCurrentLocation([user_lon, user_lat]);
  //     },
  //     async () => { // error case
  //       const { location: { longitude, latitude } } = await getLocation();
  //       setCurrentLocation([longitude, latitude]);
  //     });
  // }

  const [currentLocation, setCurrentLocation] = useState(state?.currentLocation);
  const [showAddReviewCard, setShowAddReviewCard] = useState(false);

  const toggleAddReviewCardVisibility = () => {
    setShowAddReviewCard((prevState) => !prevState)
  }

  const getDistance = () => {
    let user_lon = currentLocation[0];
    let user_lat = currentLocation[1];
    let spot_lon = state?.studySpot.location.coordinates[0];
    let spot_lat = state?.studySpot.location.coordinates[1];

    let distance = getDistanceFromLatLonInKm(user_lat, user_lon, spot_lat, spot_lon);
    let unit = "km"

    if (distance >= 10) { // if distance is more or equal than 10 km away, remove float
      distance = Math.round(distance);
    }
    if (distance < 1) { // if ditance is lesser than 1 km away, use meters
      distance *= 1000.0;
      distance = distance.toFixed(1);
      unit = "m"
    }
    return `${distance} ${unit}`;
  }

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    // fetch study spot images and then store in state array
    state?.studySpot?.image_links.map((image_link) => {
      setGalleryImages((prevGalleryImages) => {
        return prevGalleryImages.concat(
          [<img src={getImage(image_link)} alt="Gallery Image" />]
        )
      })
    })

    // fetch reviews
    const getReviews = async () => {
      try {
        const foundReviews = await getReviewsByStudySpot(state?.studySpot?.id);
        await setReviews(foundReviews);
        await setReviewsLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }

    getReviews();
  }, [])

  let key = 0; // added to get rid of unqiue key prop warnings in the map function
  return (
    <div className="detailed-spot-box">
      <div style={{ display: showAddReviewCard ? 'block' : 'none' }}>
        <AddReviewCard toggleAddReviewCardVisibility={toggleAddReviewCardVisibility} />
      </div>

      <div className='detailed-spot-box__banner'>
        <Banner showGoBackButton={true} />
      </div>
      {(reviewsLoaded && galleryImages.length !== 0 && summaryCardLoaded) // things that need to load before shown to user
        ? (null)
        : (<div className="detailed-spot-box__white-screen">
          <div className="detailed-spot-box__white-screen-loader">
            <CircularProgress color="blue" />
          </div>
        </div>)}

      <div className="detailed-spot-box__listing-detail">
        {/* Left Container */}
        <div className="detailed-spot-box__study-info-container">

          <section className="detailed-spot-box__gallery">
            <Gallery galleryImages={galleryImages} />
          </section>

          <div className="detailed-spot-box__listing-header-box">
            <h1 className="detailed-spot-box__listing-header"><b>{state?.studySpot?.name}</b></h1>
            <p className="detailed-spot-box__distance-away">{getDistance()} away</p>
          </div>

          <section className="detailed-spot-box__ubc-map">
            <UBCMap />
          </section>

          <section className="detailed-spot-box__amenities">
            <ul>
              {filterOptions.map((filter) => {
                if (state?.studySpot?.features.includes(filter.value)) return (<li key={key++}>{filter.icon} {filter.label}</li>)
              })}
            </ul>
          </section>

        </div>  {/* Replace with loop!
          {/* Right Container */}

        <AllReviewsCard reviews={reviews} setSummaryCardLoaded={setSummaryCardLoaded} toggleAddReviewCardVisibility={toggleAddReviewCardVisibility} />
      </div>
    </div>
  )
}

export default SpotDetailpage;