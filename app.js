const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("./routes/index"))

app.listen(process.env.APP_PORT, () => {
    console.log(`app listening on ${process.env.APP_PORT}`);
})