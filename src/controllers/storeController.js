const dotenv = require('dotenv');
dotenv.config();

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const axios = require('axios');

exports.homePage = (req, res) => {
    res.sendFile('./dist/index.html');
};

exports.geoNameLocations = async (req, res) => {
    const response = await axios.get(
        `${req.body.BASE_URL}&username=${GEONAMES_USERNAME}`
    );
    res.send(response.data);
};

exports.weatherBitForecast = async (req, res) => {

    const response = await axios.get(
        `${req.body.BASE_URL}&key=${WEATHERBIT_API_KEY}`
        
    );
    console.log('fsfsdfs',req.body.BASE_URL);
    res.send(response.data);
};

exports.pixabayImages = async (req, res) => {
    const response = await axios.get(
        `${req.body.BASE_URL}&key=${PIXABAY_API_KEY}`
    );
    res.send(response.data);
};
