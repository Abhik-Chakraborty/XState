// src/LocationSelector.js
import React, { useEffect, useState } from 'react';
import './LocationSelector.css';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [finalSelection, setFinalSelection] = useState('');

  // Fetch countries on load
  useEffect(() => {
    fetch('https://crio-location-selector.onrender.com/countries')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then(res => res.json())
        .then(data => setStates(data))
        .catch(err => console.error('Error fetching states:', err));
      setCities([]);
      setSelectedState('');
      setSelectedCity('');
    }
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error('Error fetching cities:', err));
      setSelectedCity('');
    }
  }, [selectedState]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setFinalSelection(`You selected ${city}, ${selectedState}, ${selectedCountry}`);
  };

  return (
    <div className="location-selector">
      <h2>Select Location</h2>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option key="default" value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        disabled={!selectedCountry}
      >
        <option key="default" value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <select
        value={selectedCity}
        onChange={(e) => handleCitySelect(e.target.value)}
        disabled={!selectedState}
      >
        <option key="default" value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {finalSelection && <p className="final-selection">{finalSelection}</p>}
    </div>
  );
};

export default LocationSelector;
