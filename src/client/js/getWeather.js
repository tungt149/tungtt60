const getWeatherBitData = async (daysToGo, lat, lon) => {
    const weatherPostRequestBody = {
        BASE_URL: `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}`,
    };

    const weatherResponse = await fetch('/weather-bit-forecast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherPostRequestBody),
    });

    const weatherData = await weatherResponse.json();
    return weatherData;
};

export { getWeatherBitData };
