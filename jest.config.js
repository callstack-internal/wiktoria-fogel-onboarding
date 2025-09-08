module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/setupTests.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|react-native-vector-icons|@react-navigation|@expo|expo(?:-.*)?|expo|@tanstack|@react-native-async-storage)/)',
  ],
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
};
