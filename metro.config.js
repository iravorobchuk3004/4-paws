const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

// Storybook lives at /storybook inside the app. It's left out of production bundles.
module.exports = withStorybook(config, {
  enabled: process.env.NODE_ENV !== 'production' || process.env.STORYBOOK_ENABLED === 'true',
});
