function predictPM25() {
    let city = document.getElementById("city").value.trim();
    let modalCity = document.getElementById("modalCity");
    let modalResult = document.getElementById("modalResult");
    let fullScreenModal = document.getElementById("fullScreenResult");
    let extraInfo = document.getElementById("extraInfo"); // New div for extra info

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    // Show full-screen modal
    fullScreenModal.classList.add("active");
    modalCity.textContent = `${city} Early Morning Air Condition`;
    modalResult.innerHTML = `<div class="loading">Fetching data...</div>`;

    // Generate random temperatures between 10°C and 35°C
    let temperatures = Array.from({ length: 5 }, () => (Math.random() * (35 - 10) + 10).toFixed(1));

    // Adding extra cards with small circles & temperatures inside
    extraInfo.innerHTML = `
        <div class="circle-container">
            ${temperatures.map(temp => `
                <div class="circle-card" style="background-color: rgb(243, 234, 234); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; position: relative;">
    <small class="z">${temp}°C</small>
</div>

            `).join('')}
        </div>`;

    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: city })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            modalResult.innerHTML = `<p style="color: red; font-size: 14px;">${data.error}</p>`;
        } else {
            let resultHTML = "";
            data.predictions.forEach((item, index) => {
                let futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + index); // Current day + index days
                
                let options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
                let formattedDate = futureDate.toLocaleDateString('en-US', options);

                resultHTML += `
                    <div class="prediction-card" style="border-left: 5px solid ${item.color}; padding: 10px;">
                        <h3 style="font-size: 16px; margin-bottom: 5px;">Day ${index + 1} - <small>${formattedDate}</small></h3>
                        <p style="font-size: 14px; margin: 2px 0;"><strong>PM2.5:</strong> ${item.pm25.toFixed(2)} µg/m³</p>
                        <p style="font-size: 14px; margin: 2px 0;"><strong>AQI:</strong> ${item.aqi}</p>
                        <p style="font-size: 14px; margin: 2px 0;"><strong>Category:</strong> ${item.category}</p>
                        <p style="font-size: 13px; color: #555;">${item.warning}</p>
                    </div>`;
            });

            modalResult.innerHTML = resultHTML;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        modalResult.innerHTML = `<p style="color: red; font-size: 14px;">Error fetching data. Try again later.</p>`;
    });
}

// Close full-screen modal
function closeFullScreen() {
    document.getElementById("fullScreenResult").classList.remove("active");
}
