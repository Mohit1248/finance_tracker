module.exports = {
  formatDate: (date) => new Date(date).toISOString().split('T')[0],
};