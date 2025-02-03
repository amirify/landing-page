document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-app-btn");
  const closeBtn = document.getElementById("close-app-btn");
  const weatherAppContainer = document.getElementById("weather-app-container");
  const stylesFileName = "index-C_pK16rU.css";
  const moduleFileName = "index-Df8klYYZ.js";

  openBtn.addEventListener("click", () => {
    openBtn.classList.add("app-hidden");
    weatherAppContainer.classList.remove("app-hidden");

    // Dynamically load the weather app styles
    if (!document.getElementById("weather-app-styles")) {
      const styleLink = document.createElement("link");
      styleLink.id = "weather-app-styles";
      styleLink.rel = "stylesheet";
      styleLink.href = `https://weather-app-d2a9a.web.app/assets/${stylesFileName}`;
      document.head.appendChild(styleLink);
    }

    // Dynamically load the weather app script if it's not already loaded
    if (window.mountWeatherApp) {
      window.mountWeatherApp();
    } else {
      const script = document.createElement("script");
      script.src = `https://weather-app-d2a9a.web.app/assets/${moduleFileName}`;
      script.type = "module";
      document.body.appendChild(script);
    }
  });

  closeBtn.addEventListener("click", () => {
    if (window.unmountWeatherApp) {
      openBtn.classList.remove("app-hidden");
      weatherAppContainer.classList.add("app-hidden");
      window.unmountWeatherApp();
    }
  });
});
