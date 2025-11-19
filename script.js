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
// let map, mapEvent;

class App {
    #map;
    #mapEvent;
    #workout = [];

    constructor() {
        this._getPosition();
        // DESC: event Listeners also comes to constructor to be launched when an instance is created.
        // NOTE: if the callback function of eventListener is a method in the class and uses 'this' keyword specifically related to the class, you should use bind method
        form.addEventListener('submit', this._newWorkout.bind(this)); // the _newWorkout uses 'this' keyword belongs to the class App, so we must bind it with 'this'
        inputType.addEventListener('change', this._toggleElevationField); // the _toggleElevationField did not use the 'this' keyword, then, it doesn't matter
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('could not get your position');
            });
        }
    }

    _loadMap(position) {
        const { latitude } = position.coords; // position.coords.latitude
        const { longitude } = position.coords; // position.coords.longitude

        // console.log(`https://www.google.com/maps/@${latitude},${longitude}`); // DESC: opens your area location in google map

        // DESC loading map and see the current location
        this.#map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        // DESC: mark the clicked location ( map.on is an event listener based on the 'map' object)
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        const { lat, lng } = this.#mapEvent.latlng;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputCadence.parentElement.classList.toggle('form__row--hidden');
        inputElevation.parentElement.classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        e.preventDefault();
        const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);

        // Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;

        //
        let workout;

        //
        const { lat, lng } = this.#mapEvent.latlng;

        // check if data is valid

        // if workout running, create running object
        if (type === 'running') {
            // check if data is valid
            const cadence = +inputCadence.value;
            if (
                !validInput(cadence, distance, duration) ||
                !allPositive(distance, duration, cadence)
            ) {
                return alert('Inputs have to be positive number');
            }
            workout = new Running([lat, lng], distance, duration, cadence);
        }

        // if workout cycling, create cycling object
        if (type === 'cycling') {
            // check if data is valid
            const elevation = +inputElevation.value;
            if (!validInput(elevation, distance, duration) || !allPositive(distance, duration)) {
                return alert('Inputs have to be positive number');
            }
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        // Add new object to workout array
        this.#workout.push(workout);
        console.log(workout);
        console.log(this.#workout);

        // render workout on map as marker
        this.renderWorkoutMarker(workout);

        // render workout on the list

        // hide form + clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        e.preventDefault();
    }

    renderWorkoutMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type.toLowerCase()}-popup`,
                })
            )
            .setPopupContent(
                `${workout.type} on ${
                    months[workout.date.getMonth() - 1]
                } ${workout.date.getDate()}th`
            )
            .openPopup();
    }
}

class Workout {
    date = new Date();
    id = Math.trunc(Math.random() * 10000);
    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance; // in km
        this.duration = duration; // in m
    }
}

class Cycling extends Workout {
    type = 'Cycling';
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

class Running extends Workout {
    type = 'Running';

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

const acc1 = new App();
