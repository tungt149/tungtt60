const savedTripsSection = document.getElementById('savedTripsSection');

document.addEventListener('DOMContentLoaded', () => {
    Client.renderSavedTrips();
});

const handleSubmit = async (event) => {
    event.preventDefault();

    const destination = document.getElementById('destination');
    const departureDate = document.getElementById('departureDate');

    const formElements = [destination, departureDate];
    const isFormValid = Client.validateUserInput(formElements);
    if (!isFormValid) return;

    const tripInfo = document.getElementById('tripInfo');

    let geonameData;
    let weatherData;
    let pixabayData;

    try {
        geonameData = await Client.getGeonameData(destination.value);
        // If there are no results from the getGeonameData, do not continue as the other API calls rely on the results from getGeonameData
        // This could be improved in the future by giving some feedback to the user in the UI
        if (geonameData.geonames.length === 0) return;


        const lat = geonameData.geonames[0].lat;
        const lon = geonameData.geonames[0].lng;

        const daysToGo = Client.calculateDaysToGo(departureDate.value);


        weatherData = await Client.getWeatherBitData(daysToGo, lat, lon);

        pixabayData = await Client.getPixabayImages(
            'photo',
            'travel',
            true,
            'popular',
            'horizontal',
            destination.value
        );

        const projectData = {
            id: geonameData.geonames[0].geonameId,
            departureDate: departureDate.value,
            destination: destination.value,
            leavingDate: departureDate.value,
            geonameData: { ...geonameData.geonames[0] },
            weatherData: [...weatherData.data],
            pixabayData: { ...pixabayData.hits[0] },
        };

        postProjectdata('/save-search-result', projectData).then(
            async (searchResult) => {
                let destinationImage = 'images/placeholder.jpg';

                if (searchResult.pixabayData.webformatURL) {
                    destinationImage = searchResult.pixabayData.webformatURL;
                }

                const innerCard = Client.renderHTMLTemplate(
                    searchResult.pixabayData.webformatURL,
                    searchResult.destination,
                    daysToGo,
                    searchResult.weatherData,
                    searchResult.id
                );

                // Update the UI
                tripInfo.innerHTML = `
                    <div class="card">
                        ${innerCard}
                    </div>
                `;
            }
        );
    } catch (error) {
        console.error(error);
    }
};

const saveTrip = async () => {
    let savedTrips = await getSavedTrips();
    const searchResult = await getSearchResult();

    if (isTripSaved(searchResult.id, savedTrips)) {
        return;
    }

    postProjectdata('/save-trip', searchResult).then(async (savedTrip) => {
        // Put the object into storage
        savedTrips = await getSavedTrips();
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
        const daysToGo = Client.calculateDaysToGo(savedTrip.departureDate);
        let destinationImage = savedTrip.pixabayData.webformatURL;
        if (!destinationImage) destinationImage = 'images/placeholder.jpg';

        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'card--column');

        cardElement.innerHTML = Client.renderHTMLTemplate(
            destinationImage,
            savedTrip.destination,
            daysToGo,
            savedTrip.weatherData,
            savedTrip.id,
            false
        );

        savedTripsSection.prepend(cardElement);
    });
};

const removeTrip = async (url = '/remove-saved-trip', data = {}) => {
    const parentCardElelement = event.target.closest('.card');
    const tripId = event.target.dataset.tripId;
    data = { id: tripId };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const savedTrips = await response.json();

    // Update local storage
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));

    parentCardElelement.remove();
};

const getSearchResult = async () => {
    const response = await fetch('/get-search-result');
    const searchResult = await response.json();
    return searchResult;
};

const getSavedTrips = async () => {
    const response = await fetch('/get-saved-trips');
    const savedTrips = await response.json();
    return savedTrips;
};

const postProjectdata = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

const isTripSaved = (tripToSaveID, savedTrips) => {
    if (savedTrips.length !== 0) {
        for (let trip of savedTrips) {
            if (trip.geonameData.geonameId === tripToSaveID) {
                return true;
            }
        }
        return false;
    }
};

export { handleSubmit, saveTrip, removeTrip };
