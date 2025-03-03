const ForecastCard = ({ data, date }) => {
    return (
      <div className={`p-4 rounded-lg shadow-md ${data.color} text-white`}>
        <h2 className="text-lg font-bold">{date}</h2>
        <p className="text-sm">PM2.5: {data.pm25} µg/m³</p>
        <p className="text-sm">AQI: {data.aqi}</p>
        <p className="text-sm">{data.category}</p>
        <p className="text-xs">{data.warning}</p>
      </div>
    );
  };
  
  export default ForecastCard;
  