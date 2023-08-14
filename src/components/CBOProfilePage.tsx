import React, { useState } from 'react';

import Image from 'next/image';
import logoImage from '@public/logo.png';

const CBOProfilePage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isFormChanged, setIsFormChanged] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFormChanged(true);
    switch (e.target.id) {
      case 'name':
        setName(e.target.value);
        break;
      case 'address':
        setAddress(e.target.value);
        break;
      case 'apartment':
        setApartment(e.target.value);
        break;
      case 'city':
        setCity(e.target.value);
        break;
      case 'zipCode':
        setZip(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'phoneNumber':
        setPhone(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormChanged) {
      alert('Form changes saved!');
      setIsFormChanged(false);
    } else {
      alert('No changes made.');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="table-row h-1/5;">
        <div className="inline-block cursor-pointer ml-[35px] mt-[25px] pr-[30px]">
          <div className="w-[25px] h-1 bg-[#333] transition-[0.4s] mx-0 my-[5px] rounded-xl"></div>
          <div className="w-[12.5px] h-1 bg-[#333] transition-[0.4s] mx-0 my-[5px] rounded-xl"></div>
          <div className="w-[25px] h-1 bg-[#333] transition-[0.4s] mx-0 my-[5px] rounded-xl"></div>
        </div>
        <div className="inline-block cursor-pointer ml-[35px] mt-[25px] pr-[30px]">
          <Image src={logoImage} alt="Logo" width="120" />
        </div>
        <div className="inline-block cursor-pointer ml-[35px] mt-[25px] pr-[30px]">
          <form className="p-0 border-[none]">
            <input
              className="border-2 border-gray-500 rounded-lg w-[150%] pl-10 bg-transparent bg-center bg-no-repeat"
              type="search"
              placeholder="Search"
            ></input>
          </form>
        </div>
        <div className="absolute w-[100px] h-[100px] mr-[-90%] right-[90%] top-2.5">
          <div className="relative w-[55px] h-[55px] bg-indigo-50 flex justify-center items-center text-xl text-indigo-500 rounded-[50%]">
            <div className="absolute w-[15px] h-[15px] bg-[rgb(74,220,74)] rounded-[50%] right-[5px] bottom-px"></div>
            <span className="initials">MW</span>
          </div>
        </div>
      </div>
      <div className="table-row h-4/5">
        <div className="flex-grow p-20 flex flex-col justify-center mt-20 items-firstBaseline ml-[-91%]">
          <h1 className="text-4xl mb-[15px]">CBO Profile Setting</h1>
          <h2 className="text-[15px] font-[normal] mb-[25px]">
            Manage your profile here
          </h2>
          <form
            className="flex-col gap-[15px] w-full max-w-[300px]"
            onSubmit={handleFormSubmit}
          >
            <div>
              <label htmlFor="name">Name*</label>
              <div>
                <input
                  value={name}
                  onChange={handleInputChange}
                  type="text"
                  id="name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="address">Address 1</label>
              <div>
                <input
                  value={address}
                  onChange={handleInputChange}
                  type="text"
                  id="address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="apartment">Apartment, suite, etc.</label>
              <div>
                <input
                  value={apartment}
                  onChange={handleInputChange}
                  type="text"
                  id="apartment"
                />
              </div>
            </div>
            <div>
              <label htmlFor="city">City</label>
              <div>
                <input
                  value={city}
                  onChange={handleInputChange}
                  type="text"
                  id="city"
                />
              </div>
              <label htmlFor="stateProvince">State/Province</label>
              <div>
                <select name="stateProvince" id="stateProvince">
                  <option value="">State/Province</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <div>
                <select name="country" id="country">
                  <option value="">Country</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="zipCode">ZIP/Postal Code</label>
              <div>
                <input
                  value={zip}
                  onChange={handleInputChange}
                  type="text"
                  id="zipCode"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email">Email Address</label>
              <div>
                <input
                  value={email}
                  onChange={handleInputChange}
                  type="email"
                  id="email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number*</label>
              <div>
                <input
                  value={phone}
                  onChange={handleInputChange}
                  type="tel"
                  id="phoneNumber"
                />
              </div>
              <div className="flex justify-end mt-5">
                <button
                  className="bg-[#705dea] text-white w-[300px] px-5 py-2.5 border-[#e7e7e7]"
                  type="submit"
                >
                  Done
                </button>
                <button className="bg-white text-[#d31313] ml-2.5 px-5 py-2.5 border-[#d3d1d1]">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CBOProfilePage;
