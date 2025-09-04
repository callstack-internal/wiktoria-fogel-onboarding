export const mockWeatherData = {
  coord: { lon: -0.13, lat: 51.51 },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  base: 'stations',
  main: {
    temp: 289.92,
    feels_like: 287.15,
    temp_min: 288.71,
    temp_max: 290.93,
    pressure: 1012,
    humidity: 56,
  },
  visibility: 10000,
  wind: {
    speed: 4.1,
    deg: 80,
  },
  clouds: {
    all: 0,
  },
  dt: 1605182400,
  sys: {
    type: 1,
    id: 1414,
    country: 'GB',
    sunrise: 1605166507,
    sunset: 1605200403,
  },
  timezone: 0,
  id: 2643743,
  name: 'London',
  cod: 200,
};
