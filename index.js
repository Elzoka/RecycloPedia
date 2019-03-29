const app = require('./app');
const config = require('./config');

app.listen(config.PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `The server is up on port ${config.PORT}`);
});