import React, { useState, useEffect } from 'react';
import './App.css';
import search from '../src/Assets/search.png';
import cloud from '../src/Assets/cloud.png';
import humidity from '../src/Assets/humidity.png';
import wind from '../src/Assets/wind.png';
import drizzle from '../src/Assets/drizzle.png';
import rain from '../src/Assets/rain.png';
import clear from '../src/Assets/clear.png';
import snow from '../src/Assets/snow.png';
import thunderstorm from '../src/Assets/thunderstorm.png';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = '6337f44ec3cb61d01e3e36d241848619';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        if (!response.ok) {
          throw new Error('Weather data not found');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchData();
    }
  }, [city, apiKey]);

  const getCloudImage = () => {
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
      return null;
    }

    const weatherCondition = weatherData.weather[0].id;
    const temperature = weatherData.main.temp;

    let weatherImage = cloud;

    if (weatherCondition >= 200 && weatherCondition < 300) {
      weatherImage = thunderstorm;
    } else if (weatherCondition >= 300 && weatherCondition < 500) {
      weatherImage = drizzle;
    } else if (weatherCondition >= 500 && weatherCondition < 600) {
      weatherImage = rain;
    } else if (weatherCondition >= 600 && weatherCondition < 700) {
      weatherImage = snow;
    } else if (weatherCondition === 800) {
      weatherImage = clear;
    } else if (weatherCondition >= 801 && weatherCondition < 900) {
      weatherImage = cloud;
    }

   
    if (temperature < 0) {
      weatherImage = snow;
    } else if (temperature >= 0 && temperature < 10) {
      weatherImage = drizzle;
    } else if (temperature >= 10 && temperature < 20) {
      weatherImage = rain;
    } else if (temperature >= 20 && temperature < 30) {
      weatherImage = cloud;
    } else if (temperature >= 30) {
      weatherImage = clear;
    }

    return <img src={weatherImage} alt={`Weather: ${weatherData.weather[0].description}`} />;
  };

  return (
    <div className="App">
      <div className='first'>
        <div className='inp'>
          <input
            type='text'
            placeholder='Enter city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className='srch'>
          <img src={search} alt="" />
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {weatherData && (
        <div>
          <div className='s1'>
            {getCloudImage()}
          </div>
          <div className='s2'>
            <h2>{(weatherData.main.temp - 273.15).toFixed(2)}°C</h2>
          </div>
          <div className='s3'>
            <h4>{weatherData.name}</h4>
          </div>
          <div className='last'>
            <div className='d1'>
              <img src={humidity} alt="" />
              <div className='d11'>
                <h3>{weatherData.main.humidity}%</h3><h4>Humidity</h4>
              </div>
            </div>
            <div className='d2'>
              <img src={wind} alt="" />
              <div className='d22'>
                <h3>{weatherData.wind.speed} km/h</h3><h4>Wind speed</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
