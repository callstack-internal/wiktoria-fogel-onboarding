import { http, HttpResponse } from 'msw';
import { mockWeatherData } from './mockData';
import { OPEN_WEATHER_URL } from '../constants/api';

export const handlers = [
  http.get(`${OPEN_WEATHER_URL}/weather`, () => {
    return HttpResponse.json(mockWeatherData);
  }),
];
