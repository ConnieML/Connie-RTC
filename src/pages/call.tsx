/* eslint-disable @next/next/no-img-element */
import { Call, Device } from '@twilio/voice-sdk';
import { useEffect, useRef, useState } from 'react';

import React from "react";

//using this stuff hopefully
//import MenuAlt1 from "../styles/icons/menu-alt-1.svg";
//import CheveronDown from '../styles/icons/cheveron-down.svg';



export default function CallPage() {
  const device = useRef<any>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [inCall, setInCall] = useState(false);

  const [number, setNumber] = useState('');
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [deviceLoaded, setDeviceLoaded] = useState(false);
  const [identity, setIdentity] = useState('');

  const [incomingCall, setIncomingCall] = useState(false);

  async function initializeDevice() {
    const test = await fetch('http://localhost:3000/api/token');

    const value = await test.json();

    setIdentity(value.identity);

    device.current = new Device(value.token, {
      logLevel: 1,
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
    });

    addDeviceListeners(device.current);
    await device.current.register();

    setDeviceLoaded(true);
  }

  useEffect(() => {
    initializeDevice();
  }, []);

  useEffect(() => {
    const searchNumberInput = document.getElementById('searchNumberInput');
    const searchNumberButton = document.getElementById('searchNumberButton');
  
    searchNumberInput?.addEventListener('keydown', makeCall);
    searchNumberButton?.addEventListener('click', makeCall);
  }, [deviceLoaded]);

  const makeCall = async (event: KeyboardEvent | MouseEvent) => {
    console.log(number);
    if ((event instanceof KeyboardEvent && event.key === 'Enter') || event instanceof MouseEvent) {
      const params = {
      // get the phone number to call from the DOM
          To: numberInputRef.current?.value,
      };
      if (device) {
        const call = await device.current.connect({ params });
        setInCall(true);
        call.on('disconnect', () => {
          console.log('you disconnected');
          setInCall(false)})
      }
    }
  };

  function endCall() {
    if(device){
      device.current.disconnectAll();
      setInCall(false);
      console.log('You hung up!');
    }
  }

  function addDeviceListeners(device:Device) {
    device.on('registered', function () {
      console.log('Twilio.Device Ready to make and receive calls!');
    });

    device.on('error', function (error: { message: string; }) {
      console.log('Twilio.Device Error: ' + error.message);
    });

    device.on('incoming', handleIncomingCall);
  }

  const acceptCall = () => {
    console.log('accepting call');
    setIncomingCall(false);
    setInCall(true);
    call?.accept();

  };

  const handleIncomingCall = (call:Call) => {
    setIncomingCall(true);
    setCall(call);
    console.log('call incoming!!!');
    // call.on('cancel', () => alert('CANCEL'));
    // call.on('disconnect', () => alert('DISCONNECT'));
    // call.on('reject', () => alert('REJECT'));
  };

  if (!deviceLoaded) {
    return <div>Loading</div>;
  }
  return (
    <main className="desktop">
        <div className='rectangle-4'>

        </div>

        <div className='rectangle-16'>
          <div>
            {/* image not getting put in, needs to be online I think */}
            <img src='../styles/icons/asa-logo-trans.png' className='frame-16'/>
          </div>
        </div>

        <div className='tab-instance'>
          Wait call
        </div>

        <div className='agent-box'>
          <div className='agent-avatar'>
          </div>
          <div className='name-box-full'>
            <div className='agent-name'>Agent Name</div>
            <div className='agent-id'>Agent ID</div>
          </div>

          <div className="dropdown">
            <div className="agent-status">Available</div>
            <button className="dropbtn">O</button>
            <div className="dropdown-content">
              <a href="#" className="available">Available</a>
              <a href="#" className="busy">Busy</a>
              <a href="#" className="offline">Offline</a>
            </div>
          </div>
        </div>

        <div className='search-bar-1'>
          <div className="input-container">
            <span className="search-icon"><i className="fa fa-search"></i></span>
            <input type="text" 
              ref={numberInputRef}
              value={number}
              className="input-field" 
              placeholder="Type phone number" 
              id='searchNumberInput'
              onChange={(e)=>{
                setNumber(e.target.value)
              console.log(e.target.value)
              console.log('number: ', number)}}/>
          </div>
          <button className="enter-phone" id="searchNumberButton">

          </button>
        </div>

        <div className='rectangle-12'>
          {incomingCall ? 
            <div>
              <>
              You have a call!
              <button onClick={acceptCall}>Accept</button>
              <button>Decline</button>
              </>
            </div> 
          : <div>No incoming calls</div>}
        </div>

        {!inCall ? 
          <div className="rectangle-5">
            <div className="keypad">
            <div className="keypad-outer-col">
              <button className='keypad-button'>
                <div className='number-key'>1</div>
                <div className='letter-key'></div>
              </button>
              <button className='keypad-button'>
                <div className='number-key'>4</div>
                <div className='letter-key'>GHI</div>
              </button>
              <button className='keypad-button'>
                <div className='number-key'>7</div>
                <div className='letter-key'>PQRS</div>
              </button>
              <button className='keypad-button'>
                <div className='number-key'>*</div>
              </button>
            </div>

            <div className="keypad-inner-col">
              <button className='keypad-button'>
                <div className='number-key'>2</div>
                <div className='letter-key'>ABC</div>
              </button>
              <button className='keypad-button'>
                <div className='number-key'>5</div>
                <div className='letter-key'>JKL</div>
              </button>
              <button className='keypad-button'>
                <div className='number-key'>8</div>
                <div className='letter-key'>TUV</div>
              </button>
              <button className='keypad-button'>
                <div className='number-key'>0</div>
                <div className='letter-key'>+</div>
              </button>
            </div>

            <div className="keypad-outer-col">
              <button className='keypad-button'>
                  <div className='number-key'>3</div>
                  <div className='letter-key'>DEF</div>
              </button>
              <button className='keypad-button'>
                  <div className='number-key'>6</div>
                  <div className='letter-key'>MNO</div>
              </button>
              <button className='keypad-button'>
                  <div className='number-key'>9</div>
                  <div className='letter-key'>WXYZ</div>
              </button>
              <button className='keypad-button'>
                <div className='number-key'>#</div>
              </button>
            </div>

            </div>
            <div className="solar-phone-bold" >          
              <img alt="Solar phone bold" src="solar-phone-bold.svg" />
            </div>
          </div>
        : <div className='call-panel'>
            <div className='call-controls'>
              <div className='call-info'>
                <div className='num-display'>(608)780-3817</div>
                <div className='call-time'>10:16:09</div>
              </div>
              <div className='control-box'>
                <div className='control-row'>
                  <div className='control-icon'></div>
                  <div className='control-icon'></div>
                </div>
                <div className='control-row'>
                  <div className='control-icon'></div>
                  <div className='control-icon'></div>
                </div>
              </div>
              <button className='end-call-button' onClick={endCall}>
                <div className='phone-hangup-icon'></div>
                <div className='end-call-text'>End</div>
              </button>
            </div>
          </div>
        }

    </main>)

}
