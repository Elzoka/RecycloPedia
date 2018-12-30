const express = require('express');
const app = express();

app.get('test', (req, res) => {
    res.send({msg: "Got here"});
});

app.listen(3000, () => {
    console.log('\x1b[36m%s\x1b[0m', "The server is up on port 3000");
});