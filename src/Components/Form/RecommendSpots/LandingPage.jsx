import React from 'react';
import "./LandingFinishedPage.scss";
import SubmitButtons from './SubmitButtons';

function LandingPage({ setPrevPage, setCurrPage, setNextPage }) {
  const goNext = () => { return setCurrPage(false), setNextPage(true) };

  return (
    <div className="landing-page-box">
      <div className="landing-page-box__left-container">
        <div className="landing-page-box__description-container">
          <h1 className="landing-page-box__title">
            Tell us about the study spot
          </h1>
          <p className="landing-page-box__description-text">
            In this form, we will guide you by asking a few questions like where the spot is located and its amenities and hours. Then tell us some basic information and finally show us the place.
            <br /><br />
            Don't worry this form will be completely anonymous!
          </p>
        </div>
      </div>
      <div className="landing-page-box__right-container">
        <div className="landing-page-box__image-container">
          <img
            className="landing-page-box__image"
            src={require("../../Assets/isometric-library.png")}
            alt="isometic library vector"
          />
        </div>
      </div>
      <SubmitButtons goNext={goNext} />
    </div>
  )
}

export default LandingPage;