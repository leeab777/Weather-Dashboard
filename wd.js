document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('searchBtn');
    console.log("Button found:", searchBtn);    //log the search button to make sure it found
    searchBtn.addEventListener('click', handleGetWeather);
});

// Function to handle the 'Get Weather' button click
async function handleGetWeather() {
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim(); // Get city name from input

    console.log('City Input:', city);

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    console.log("City entered:", city);

    resetUI();   //reset ui before fetching data

    const weatherDetailsDiv = document.getElementById('weatherDetails'); // First check if this is a new search
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const weatherInfoDiv = document.getElementById('weatherInfo');

// Log each element to ensure they're found
   console.log("weatherDetailsDiv found:", weatherDetailsDiv);
   console.log("loadingElement found:", loadingElement);
   console.log("errorMessage found:", errorMessage);
   console.log("weatherInfoDiv found:", weatherInfoDiv);

    if (!loadingElement || !weatherInfoDiv || !errorMessage) {             //ensure elements exist before manipulating them
        console.error("One or more required DOM elements are missing.");
        return;           //exit if elements are not found
    }

    loadingElement.style.display = 'block';     //show loading spinner
    weatherInfoDiv.innerHTML = '';       //clear previous weather
   
    try {
        // Fetch weather data
        const weatherData = await getWeather(city);

        if (weatherData && !weatherData.error) {
            displayWeather(weatherData);
        } else {
            displayError('Weather data could not be retrieved. Please check the city name.');
        }
    } catch (error) {
        displayError('An error occurred: ' + error.message);
    } finally {
        loadingElement.style.display = 'none';   //hide loading element when done
    }
}

// Function to fetch weather data from OpenWeatherMap API
async function getWeather(city) {
    const apiKey = 'aaac5bef2ed6593c05033775e5624814'; // API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(response.status === 404 ? 'City not found' : 'Error fetching weather data');
    }
    const data = await response.json();
    console.log(data); //log the entire api response to inspect its structure
    return data;
}

// Function to display weather details
function displayWeather(data) {
    const weatherDetailsDiv = document.getElementById('weatherInfo');
    
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const weatherCondition = data.weather[0]?.description; // Optional chaining to prevent errors if `data.weather` is empty
    const windSpeed = data.wind.speed;
    const city = data.name;
    const icon = data.weather[0]?.icon;  // Icon for the weather condition (if available)
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
            <h2>Weather in ${city}</h2>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            <p><strong>Condition:</strong> ${weatherCondition}</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${windSpeed}m/s</p>
            <img src="${iconUrl}" alt="${weatherCondition}" title="${weatherCondition}" />
        `;

    weatherDetailsDiv.innerHTML = weatherHTML; // Show weather data
    changeBackgroundImage(weatherCondition); // Change background image depending on weather condition
}

// Function to change the background image based on weather condition
function changeBackgroundImage(condition) {
    const body = document.body;

    const weatherImages = {
        "clear sky": "sunny.jpg",
        "few clouds": "sunandpartlycloudy.jpg",
        "scattered clouds": "sunnyncloud.jpg",
        "broken clouds": "sunnyncloud.jpg",
        "rain": "rain-1550535.jpg",
        "thunderstorm": "storm.jpg",
        "snow": "snow.jpg",
        "mist": "fog.jpg",
        "heavy intensity rain": "rain-1550535.jpg",
        "overcast clouds": "cloud.jpg",
    };

    const normalizedCondition = condition ? condition.toLowerCase() : "default";  //fallback to "default" if condition is null or undefined
    console.log('Normalized Weather Condition:', normalizedCondition);

    const backgroundImage = weatherImages[normalizedCondition] || "default.jpg";
    console.log('Background Image', backgroundImage);

    body.style.backgroundImage = `url('${backgroundImage}')`;
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center center";
    body.style.backgroundAttachment = "fixed";
}

// Function to display error message
function displayError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = `<p style="color: red;">${message}</p>`;
}

//function to reset the UI before new search
function resetUI() {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const errorMessage = document.getElementById('errorMessage');
    const loadingElement = document.getElementById('loading');
    
    console.log("Resetting UI...");

    // Log each element to ensure they're found
    console.log("weatherInfoDiv found:", weatherInfoDiv);
    console.log("errorMessage found:", errorMessage);
    console.log("loadingElement found:", loadingElement);

    if (!weatherInfoDiv || !errorMessage || !loadingElement) {
        console.error("one or more required DOM elements are missing.");
    }

    weatherInfoDiv.innerHTML = '';   //clear previous weather data
    errorMessage.style.display = 'none';

    loadingElement.style.display = 'none';     //hide initial message

    document.body.style.backgroundImage = "url('default.jpg')";   // reset background to default

}