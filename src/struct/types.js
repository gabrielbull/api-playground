export default {
  String: 'string',
  Base64Image: 'base64image',
  Enum: (...options) => () => options,
  Number: 'number'
};
