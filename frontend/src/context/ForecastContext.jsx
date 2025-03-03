import { createContext, useState } from "react";

export const ForecastContext = createContext();

export const ForecastProvider = ({ children }) => {
    const [forecast, setForecast] = useState(null);
    const [city, setCity] = useState("");
    const [oneCityData,setoneCityData] = useState(null)
    const [loader, setLoader] = useState(false);
  return (
    <ForecastContext.Provider value={{ forecast, setForecast, city, setCity, loader, setLoader,oneCityData,setoneCityData }}>
      {children}
    </ForecastContext.Provider>
  );
};
