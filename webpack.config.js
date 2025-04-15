const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ignorar react-native-maps en web
  if (env.platform === 'web') {
    config.resolve.alias['react-native-maps'] = false;

    // Ignorar 'Platform' para evitar errores en Web
    config.resolve.alias['react-native'] = 'react-native-web';
  }

  return config;
};