const localApp = require('./app');

const port = 5001;
localApp.listen(port, () => {
  console.log('running on ' + port);
});
