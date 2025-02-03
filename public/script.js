document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-app-btn");
  const closeBtn = document.getElementById("close-app-btn");
  const weatherAppContainer = document.getElementById("weather-app-container");

  openBtn.addEventListener("click", () => {
    openBtn.classList.add("app-hidden");
    weatherAppContainer.classList.remove("app-hidden");

    // Fetch the manifest file
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
    if (window.unmountWeatherApp) {
      openBtn.classList.remove("app-hidden");
      weatherAppContainer.classList.add("app-hidden");
      window.unmountWeatherApp();
    }
  });
});
