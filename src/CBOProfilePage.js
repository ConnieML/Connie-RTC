import React from 'react';
import "./CBOProfilePage.css";
import logoImage from './logo.png';

const CBOProfilePage = () => {
    return (
      <div className="container">
      <div className="top">
        <div class="bar-container">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
        <div className="bar-container">
          <img src={logoImage} alt='Logo' width='120'></img>
        </div>
        <div className='bar-container'>
        <form class="nosubmit">
          <input class="nosubmit" type="search" placeholder="Search"></input>
        </form>
        </div>
        <div className="profile-icon-container">
          <div className="profile-icon">
            <div className="status-indicator"></div>
            <span className="initials">MW</span>
          </div>
        </div>
      </div>
      <div className="bottom">
      <div className="profile-container">
          <h1 className="title">CBO Profile Setting</h1>
          <h2 className="subtitle">Manage your profile here</h2>
          <form className="profile-form">
            <div>
              <label htmlFor="name">Name*</label>
              <div><input type="text" id="name" /></div>
            </div>
            <div>
              <label htmlFor="address">Address 1</label>
              <div><input type="text" id="address" /></div>
            </div>
            <div>
              <label htmlFor="apartment">Apartment, suite, etc.</label>
              <div><input type="text" id="apartment" /></div>
            </div>
            <div>
              <label htmlFor="city">City</label>
              <div><input type="text" id="city" /></div>
              <label htmlFor="stateProvince">State/Province</label>
              <div><select name="stateProvince" id="stateProvince">
                <option value="">State/Province</option>
              </select></div>
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <div><select name="country" id="country">
                <option value="">Country</option>
              </select></div>
            </div>
            <div>
              <label htmlFor="zipCode">ZIP/Postal Code</label>
              <div><input type="text" id="zipCode" /></div>
            </div>
            <div>
              <label htmlFor="email">Email Address</label>
              <div><input type="email" id="email" /></div>
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number*</label>
              <div><input type="tel" id="phoneNumber" /></div>
            </div>
          </form>
        <div className="button-container">
          <button className="done-button">Done</button>
          <button className="cancel-button">Cancel</button>
        </div>
      </div>
      </div>
    </div>
    );
  };
  
  
  
  export default CBOProfilePage;
  
  
