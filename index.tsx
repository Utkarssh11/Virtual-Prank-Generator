/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// SVG Icons for Status Bar
const WifiIcon: React.FC<{ strength?: number }> = ({ strength = 3 }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: strength / 3 }}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12l1.89 2.11C4.43 11.93 7.9 10 12 10s7.57 1.93 9.11 4.11L23 12c-1.73-4.39-6-7.5-11-7.5zm0 5C9.5 9.5 7.22 10.89 6 13l1.89 2.11C8.93 13.93 10.36 13.5 12 13.5s3.07.43 4.11 1.61L18 13c-1.22-2.11-3.5-3.5-6-3.5zm0 5c-1.08 0-2.05.43-2.72 1.09L12 19l2.72-2.91c-.67-.66-1.64-1.09-2.72-1.09z"/>
  </svg>
);

const SignalIcon: React.FC<{ strength?: number }> = ({ strength = 4 }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path fillOpacity={strength >= 1 ? 1 : 0.3} d="M2 22h20V2L2 22z"/>
    <path fillOpacity={strength >= 2 ? 1 : 0.3} d="M17 7L2 22h15V7z"/>
    <path fillOpacity={strength >= 3 ? 1 : 0.3} d="M17 7l-8.28 10.35L17 22V7z" style={{transform: 'scaleX(0.8)', transformOrigin: 'right'}}/>
    <path fillOpacity={strength >= 4 ? 1 : 0.3} d="M17 7l-5.5 7.86L17 19V7z" style={{transform: 'scaleX(0.6)', transformOrigin: 'right'}}/>
  </svg>
);


const BatteryIcon: React.FC<{ level: number; charging: boolean }> = ({ level, charging }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
    <line x1="23" y1="13" x2="23" y2="11"></line>
    <rect x="3" y="8" width={(14 * level) / 100} height="8" rx="1" ry="1" fill="currentColor"></rect>
    {charging && (
      <polyline points="8 10 11 13 8 16" stroke="white" strokeWidth="1.5" fill="none" />
    )}
  </svg>
);

interface PhoneMockupProps {
  phoneStyle: 'modern' | 'classic';
  carrierName: string;
  batteryLevel: number;
  isCharging: boolean;
  wifiStrength: number; // 0-3
  signalStrength: number; // 0-4
  currentTime: string;
  children: React.ReactNode; // This will be the notification content
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
  phoneStyle,
  carrierName,
  batteryLevel,
  isCharging,
  wifiStrength,
  signalStrength,
  currentTime,
  children,
}) => {
  return (
    <div className={`phone-mockup ${phoneStyle}`}>
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="status-bar">
            <span className="carrier-name">{carrierName}</span>
            <div className="status-icons">
              <WifiIcon strength={wifiStrength} />
              <SignalIcon strength={signalStrength} />
              <span className="battery-level-text">{batteryLevel}%</span>
              <BatteryIcon level={batteryLevel} charging={isCharging} />
              <span className="time-display">{currentTime.split(' ')[0]}</span> {/* Show only time part for status bar */}
            </div>
          </div>
          <div className="screen-content">
            {children}
          </div>
        </div>
        {phoneStyle === 'modern' && <div className="notch"></div>}
        <div className="volume-buttons">
          <div className="button"></div>
          <div className="button"></div>
        </div>
        <div className="power-button"></div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  // Notification content state
  const [appName, setAppName] = useState<string>('My App');
  const [notificationTitle, setNotificationTitle] = useState<string>('New Message');
  const [notificationMessage, setNotificationMessage] = useState<string>('You have a new notification!');
  const [notificationTime, setNotificationTime] = useState<string>('9:41 AM');
  const [appIcon, setAppIcon] = useState<string | null>(null);

  // Phone mockup specific state
  const [phoneStyle, setPhoneStyle] = useState<'modern' | 'classic'>('modern');
  const [carrierName, setCarrierName] = useState<string>('PrankNet');
  const [batteryLevel, setBatteryLevel] = useState<number>(75);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [wifiStrength, setWifiStrength] = useState<number>(3);
  const [signalStrength, setSignalStrength] = useState<number>(4);

  // Button animation state
  const [buttonText, setButtonText] = useState<string>('Generate & Download Prank');
  const [isButtonAnimating, setIsButtonAnimating] = useState<boolean>(false);

  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="default-icon">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    </svg>
  );

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAppIcon(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSharePrank = () => {
    if (isButtonAnimating) return;

    setIsButtonAnimating(true);
    const playfulTexts = [
        "ZzzAP! Error? 😜",
        "Not Yet, Prankster!",
        "Haha! Almost...",
        "Try Again Later! 😉",
        "Prank Failed... Successfully!"
    ];
    setButtonText(playfulTexts[Math.floor(Math.random() * playfulTexts.length)]);

    setTimeout(() => {
        setButtonText('Generate & Download Prank');
        setIsButtonAnimating(false);
    }, 1500); // Match CSS animation duration + a little buffer
  };


  return (
    <div className="container">
      <header>
        <h1>😜 Virtual Prank Generator</h1>
        <p>Craft hilarious, harmless virtual pranks with ease!</p>
      </header>

      <main>
        <section className="prank-tool" aria-labelledby="notification-prank-title">
          <h2 id="notification-prank-title">📱 Fake Notification Creator</h2>
          <div className="tool-content">
            <div className="controls">
              <h3>Notification Details</h3>
              <div className="form-group">
                <label htmlFor="appName">App Name:</label>
                <input type="text" id="appName" value={appName} onChange={(e) => setAppName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="notificationTitle">Notification Title:</label>
                <input type="text" id="notificationTitle" value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="notificationMessage">Notification Message:</label>
                <textarea id="notificationMessage" value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)} rows={3}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="notificationTime">Notification Time:</label>
                <input type="text" id="notificationTime" value={notificationTime} onChange={(e) => setNotificationTime(e.target.value)} />
              </div>
               <div className="form-group">
                <label htmlFor="appIcon">App Icon (optional):</label>
                <input type="file" id="appIcon" accept="image/*" onChange={handleIconChange} />
                <small className="form-text text-muted">Square icons work best. Max 1MB.</small>
              </div>

              <h3 className="controls-subtitle">Phone Screen Settings</h3>
               <div className="form-group">
                <label htmlFor="phoneStyle">Phone Style:</label>
                <select id="phoneStyle" value={phoneStyle} onChange={(e) => setPhoneStyle(e.target.value as 'modern' | 'classic')}>
                  <option value="modern">Modern Smartphone (with notch)</option>
                  <option value="classic">Classic Smartphone (no notch)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="carrierName">Carrier Name:</label>
                <input type="text" id="carrierName" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="batteryLevel">Battery Level ({batteryLevel}%):</label>
                <div className="slider-group">
                    <input type="range" id="batteryLevel" min="0" max="100" value={batteryLevel} onChange={(e) => setBatteryLevel(parseInt(e.target.value))} />
                    <input type="checkbox" id="isCharging" checked={isCharging} onChange={(e) => setIsCharging(e.target.checked)} style={{marginLeft: '10px'}} />
                    <label htmlFor="isCharging" style={{fontWeight: 'normal', marginLeft: '5px'}}>Charging</label>
                </div>
              </div>
                <div className="form-group">
                    <label htmlFor="wifiStrength">Wi-Fi Strength:</label>
                    <select id="wifiStrength" value={wifiStrength} onChange={(e) => setWifiStrength(parseInt(e.target.value))}>
                        <option value="0">Off</option>
                        <option value="1">Weak</option>
                        <option value="2">Medium</option>
                        <option value="3">Strong</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="signalStrength">Cellular Signal:</label>
                    <select id="signalStrength" value={signalStrength} onChange={(e) => setSignalStrength(parseInt(e.target.value))}>
                        <option value="0">No Service</option>
                        <option value="1">Weak</option>
                        <option value="2">Fair</option>
                        <option value="3">Good</option>
                        <option value="4">Excellent</option>
                    </select>
                </div>

              <button 
                onClick={handleSharePrank} 
                className={`cta-button ${isButtonAnimating ? 'animating-prank-button' : ''}`}
                disabled={isButtonAnimating}
                aria-label="Generate and Download Prank (currently non-functional, for fun!)"
              >
                {buttonText}
              </button>
            </div>

            <div className="preview-area" aria-live="polite" aria-atomic="true">
              <h3>Live Preview</h3>
              <PhoneMockup
                phoneStyle={phoneStyle}
                carrierName={carrierName}
                batteryLevel={batteryLevel}
                isCharging={isCharging}
                wifiStrength={wifiStrength}
                signalStrength={signalStrength}
                currentTime={notificationTime}
              >
                <div className="notification-preview-content">
                  <div className="notification-header">
                    <div className="app-icon-container">
                      {appIcon ? <img src={appIcon} alt="App Icon Preview" className="app-icon-preview" /> : defaultIcon}
                    </div>
                    <span className="app-name-preview">{appName}</span>
                    <span className="time-preview">{notificationTime}</span>
                  </div>
                  <div className="notification-body">
                    <p className="title-preview">{notificationTitle}</p>
                    <p className="message-preview">{notificationMessage}</p>
                  </div>
                </div>
              </PhoneMockup>
              <p className="preview-tip">Your awesome prank is taking shape!</p>
            </div>
          </div>
        </section>
        
        <section className="coming-soon" aria-labelledby="coming-soon-title">
            <h2 id="coming-soon-title">🚀 More Prank Tools Incoming!</h2>
            <ul>
                <li>Fake Social Media Posts (Instagram, TikTok styles!)</li>
                <li>Fake Text & Chat Conversations (WhatsApp, Messenger)</li>
                <li>Realistic System Alerts (Low Battery, Error Messages)</li>
                <li>Prank Challenges & Voting</li>
                <li>Leaderboards & Community Fun</li>
            </ul>
            <p>Stay tuned for more ways to prank and laugh!</p>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Virtual Prank Generator. Prank responsibly and keep it fun!</p>
        <p>Monetization Ideas: 👑 Premium Templates, ✨ Ad-Free Experience, 👕 Official Merch (Coming Soon!)</p>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}