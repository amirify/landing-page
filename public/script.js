document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-app-btn");
  const closeBtn = document.getElementById("close-app-btn");

  // This element wraps the weather-app to control
  // the visibility of weather-app styles when
  // it is unmounted
  const weatherAppContainer = document.getElementById("weather-app-container");

  // Remove old weather data after 24 Hour
  removeOldWeatherSummary();

  openBtn.addEventListener("click", () => {
    // Hide the Open Button when weather-app is already open
    openBtn.classList.add("app-hidden");

    // Make the weather-app container visible
    weatherAppContainer.classList.remove("app-hidden");

    // Fetch the manifest file to get the latest
    // module and styles file names on weather-app host
    // and then load them dynamically inside the landing page
    fetch("https://weather-app-d2a9a.web.app/.vite/manifest.json")
      .then((response) => response.json())
      .then((manifest) => {
        const moduleFile = manifest["index.html"].file;
        const cssFile = manifest["index.html"].css?.[0];

        // Dynamically load the weather app styles
        if (!document.getElementById("weather-app-styles")) {
          const styleLink = document.createElement("link");
          styleLink.id = "weather-app-styles";
          styleLink.rel = "stylesheet";
          styleLink.href = `https://weather-app-d2a9a.web.app/${cssFile}`;
          document.head.appendChild(styleLink);
        }

        // Dynamically load the weather app script if it's not already loaded
        // mountWeatherApp and unmountWeatherApp methods are exposed by weather app
        // so we can unmount it upon app close and remount it
        // with fresh data when we open the app again
        if (window.mountWeatherApp) {
          window.mountWeatherApp();
        } else {
          const script = document.createElement("script");
          script.src = `https://weather-app-d2a9a.web.app/${moduleFile}`;
          script.type = "module";
          document.body.appendChild(script);
        }
      })
      .catch((err) => console.error("Failed to load manifest:", err));
  });

  closeBtn.addEventListener("click", () => {
    // unmount the weather-app
    if (window.unmountWeatherApp) {
      // Show the Open Button when weather-app is closed
      openBtn.classList.remove("app-hidden");

      // hide weather-app container when it's closed
      weatherAppContainer.classList.add("app-hidden");
      window.unmountWeatherApp();

      // display weather summary info stored by 
      // weather-app in localStorage
      displayWeatherSummary();
    }
  });

  // Remove old weather data after 24 Hour
  function removeOldWeatherSummary() {
    const storedData = JSON.parse(localStorage.getItem("weatherSummary"));
    if (
      storedData &&
      new Date() - new Date(storedData.lastUpdated) > 86400000
    ) {
      localStorage.removeItem("weatherSummary");
    }
  }

  // Read weather summary from localStorage
  // and display it inside landing page
  // we call this function when weather app is closed
  function displayWeatherSummary() {
    const weatherSummary = localStorage.getItem("weatherSummary");
    if (weatherSummary) {
      const { name, date, main, description } = JSON.parse(weatherSummary);
      document.getElementById("weather-summary").innerHTML = `
        <h2>Weather in ${name}</h2>
        <p>${description} | Temperature: ${main.temp}°C</p>
        <small>Last Updated: ${date}</small>
      `;
    }
  }
});
