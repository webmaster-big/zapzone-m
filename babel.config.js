module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // react-native-worklets plugin (Reanimated 4) MUST be listed last.
      'react-native-worklets/plugin',
    ],
  };
};
