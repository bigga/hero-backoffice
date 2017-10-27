export default {
  capitalize(text) {
    if (!text) {
      return text;
    }
    return text.substring(0, 1).toUpperCase() + text.substring(1);
  }
};
