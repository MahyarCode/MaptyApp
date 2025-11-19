'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
let map, mapEvent;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            console.log(position);
            const { latitude } = position.coords; // position.coords.latitude
            const { longitude } = position.coords; // position.coords.longitude

            console.log(
                `https://www.google.com/maps/@${latitude},${longitude}`
            ); // DESC: opens your area location in google map

            // DESC loading map and see the current location
            map = L.map('map').setView([latitude, longitude], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // DESC: mark the clicked location ( map.on is an event listener based on the 'map' object)
            map.on('click', function (mapE) {
                mapEvent = mapE;
                // console.log(mapEvent);
                const { lat, lng } = mapEvent.latlng;
                form.classList.remove('hidden');
                inputDistance.focus();
            });
        },
        function () {
            alert('could not get your position');
        }
    );
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Display the marker
    const { lat, lng } = mapEvent.latlng;
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
            L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
            })
        )
        .setPopupContent('Workout Bicycle')
        .openPopup();
});

inputType.addEventListener('change', function () {
    inputCadence.parentElement.classList.toggle('form__row--hidden');
    inputElevation.parentElement.classList.toggle('form__row--hidden');
});
