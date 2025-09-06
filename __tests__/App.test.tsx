/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/hook/useUserLocation', () => ({
  useLocationQuery: () => ({
    location: { lat: 52.2297, lon: 21.0122 },
    isLoading: false,
    error: null,
  }),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
