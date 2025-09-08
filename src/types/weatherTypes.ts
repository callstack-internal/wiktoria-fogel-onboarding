export type WeatherType = {
  id: number;
  name: string;
  cod: number;
  timezone: number;
  coord: CoordinatesType;
  base: string;
  weather: WeatherDataType[];
  main: MainDataType;
  visibility: number;
  wind: WindType;
  clouds: CloudType;
};

export type CoordinatesType = {
  lon: number;
  lat: number;
};

export type WeatherDataType = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type MainDataType = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
};

export type WindType = {
  speed: number;
  deg: number;
  gust: number;
};

export type CloudType = {
  all: number;
};
