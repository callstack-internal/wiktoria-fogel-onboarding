export const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5';
export const ICON_BASE_URL = 'https://openweathermap.org/img/wn/';

export const getWeatherIconUrl = (
  iconCode: string,
  size: '2x' | '4x' = '2x',
) => {
  return `${ICON_BASE_URL}${iconCode}@${size}.png`;
};
