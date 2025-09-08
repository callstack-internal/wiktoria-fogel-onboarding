import axios from 'axios';
import { OPEN_WEATHER_API_KEY } from '@env';
import { CITY_IDS } from '../constants/cities';
import { OPEN_WEATHER_URL } from '../constants/api';
import type { WeatherType } from '../types/weatherTypes';
import { STRINGS } from '../constants/strings';

const axiosInstance = axios.create({
  baseURL: OPEN_WEATHER_URL,
  timeout: 10000,
  params: {
    units: 'metric',
    appid: OPEN_WEATHER_API_KEY,
  },
});

export const getCitiesWeatherById = async (): Promise<WeatherType[]> => {
  try {
    const requests = CITY_IDS.map(id =>
      axiosInstance.get<WeatherType>('/weather', { params: { id } }),
    );
    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        STRINGS.ERROR.downloadWeatherData,
        error.response?.data || error.message,
      );
    } else {
      console.error(STRINGS.ERROR.downloadWeatherData, error);
    }
    throw new Error(STRINGS.ERROR.dataDownloadError);
  }
};

export const getWeatherByCoords = async (
  lat: number,
  lon: number,
): Promise<WeatherType> => {
  try {
    const response = await axiosInstance.get<WeatherType>('/weather', {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        STRINGS.ERROR.downloadWeatherDataCoords,
        error.response?.data || error.message,
      );
    } else {
      console.error(STRINGS.ERROR.downloadWeatherDataCoords, error);
    }
    throw new Error(STRINGS.ERROR.dataDownloadErrorWithLocation);
  }
};
