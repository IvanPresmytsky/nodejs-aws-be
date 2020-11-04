import axios from 'axios';

export const getWeather = (location: string) => axios({
  method: "GET",
  url: "https://community-open-weather-map.p.rapidapi.com/weather",
  headers: {
    "content-type": "application/octet-stream",
    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
    "x-rapidapi-key": "e650859590mshadd88d5f67a701ap1c4e96jsn8abb4b9be93b",
    "useQueryString": true
  },
  params:{
    lang: "English",
    units: "metric",
    q: location
  }
});
