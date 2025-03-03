import React, { useContext, useEffect, useState } from "react";
import {
  FaCloudRain,
  FaExclamationCircle,
  FaTemperatureHigh,
  FaWind,
  FaSearch,
} from "react-icons/fa";
import { WiHumidity, WiBarometer, WiDaySunny } from "react-icons/wi";
import { ForecastContext } from "../context/ForecastContext";
import Footer from "./Footer";
import image from "../assets/air-pollution.png";
import axios from "axios";

const getNextFiveDays = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: days[date.getDay()],
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });
};

const SearchResults = () => {
  const { forecast, city, setoneCityData, setForecast, setCity } =
    useContext(ForecastContext);
  const [local, setLocal] = useState(null);
  const [city2, setCity2] = useState(null);
  const nextFiveDays = getNextFiveDays();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=PS2MXBZDYXP7G6VVKLRRYKCKM&contentType=json`
      );
      const data = await response.json();
      setLocal(data);
      console.log("running", data);

      setoneCityData(data);
    }
    fetchData();
  }, [city]);

  const handleSearch = async (cityName) => {
    if (!cityName) {
      return;
    }
    try {
      setCity2(cityName);
      // const response = await axios.post("http://127.0.0.1:5000/predict", { city: cityName });
      const response = await axios.post("https://aqfmp.onrender.com/predict", {
        city: cityName,
      });
      setForecast(response.data.predictions);
      setCity(cityName);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("something went wrong");
    }
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto mt-6 min-h-screen bg-gray-100 rounded-lg shadow-lg ">
        {/* Heading with Search Bar */}
        <div className="mb-[4%] flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-black mb-2">
              Air Quality in {city}
            </h1>
            <p>Air quality index (AQI⁺) and PM2.5 air pollution in {city}</p>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4 md:mt-0 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search your city..."
              onChange={(e) => setCity2(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none  focus:ring-blue-500"
            />
            <button
              onClick={() => {
                handleSearch(city2);
              }}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* AQI Card */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="flex justify-center">
              <strong>Category :</strong>
              <p
                className={`font-bold text-${
                  forecast[0]?.aqi > 100 ? "red-500" : "green-500"
                }`}
              >
                {forecast[0]?.category}
              </p>
            </div>
            <div>
              <WiBarometer size={80} className="text-black mx-auto" />
              <p className="text-xl text-black font-bold">
                AQI: {forecast[0]?.aqi}
              </p>
            </div>
            <div>
              <img
                className="w-16 h-16 mx-auto mt-4"
                src={image}
                alt="Air Quality"
              />
              <p className="text-lg text-black font-bold">
                PM2.5: {forecast[0]?.pm25.toFixed(2)} µg/m³
              </p>
            </div>
          </div>

          {/* Main Weather Card */}
          <div className="bg2 p-6 rounded-xl shadow-md text-center text-white">
            <h2 className="text-4xl font-bold">{city} Weather</h2>
            <div className="flex items-center justify-center mt-3">
              <WiDaySunny size={70} className="text-yellow-400" />
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex flex-col items-center">
                <FaTemperatureHigh size={50} className="text-red-400" />
                <p className="text-lg font-bold">
                  {(((local?.currentConditions?.temp - 32) * 5) / 9).toFixed(2)}
                  °C
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaWind size={50} className="text-blue-400" />
                <p className="text-lg font-bold">
                  {local?.currentConditions?.windspeed} km/h
                </p>
              </div>
              <div className="flex flex-col items-center">
                <WiHumidity size={50} className="text-white" />
                <p className="text-lg font-bold">
                  {local?.currentConditions?.humidity}%
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaCloudRain size={50} className="text-gray-300" />
                <p className="text-lg font-bold">
                  {local?.currentConditions?.precip || 0}%
                </p>
              </div>
            </div>
          </div>

          {(forecast[0].pm25 / 5).toFixed(2) > 5 ? (
            <div className="bg-red-100 rounded-md py-5 h-20 mt-auto px-3 text-sm flex gap-3 ">
              <span className="flex items-center">
                <FaExclamationCircle className="text-red-500" />
              </span>
              <p>
                PM2.5 concentration is currently{" "}
                <strong className="text-red-600">
                  {(forecast[0].pm25 / 5).toFixed(2)}
                </strong>{" "}
                times the World Health Organization annual PM2.5 guideline
                value.
              </p>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* 5 Days Prediction */}
        <h2 className="text-3xl font-bold text-center text-black mt-8">
          5 Days Air Quality Forecast
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
          {forecast?.slice(0, 5).map((data, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md text-center hover:scale-105 transition-transform flex flex-col items-center"
            >
              <h3 className="text-lg font-bold text-gray-700">
                {nextFiveDays[index].day}
              </h3>
              <p className="text-md text-gray-600">
                {nextFiveDays[index].date}
              </p>
              <p className="text-md font-medium text-gray-700">
                PM2.5: {parseFloat(data.pm25).toFixed(2)} µg/m³
              </p>
              <p className="text-md font-semibold text-gray-800">
                AQI: {data.aqi}
              </p>
              <p
                className={`text-sm font-bold ${
                  data.aqi > 100 ? "text-red-600" : "text-green-600"
                }`}
              >
                Category: {data.category}
              </p>
              <p className="text-xs text-gray-500">{data.warning}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
