const timeSlotsContainer = document.getElementById("timeSlots");
const timezoneSelector = document.getElementById("timezone");
const summaryBox = document.getElementById("summary");
const generateBtn = document.getElementById("generateBtn");

// Populate time zones
const timezones = Intl.supportedValuesOf('timeZone');
timezones.forEach(zone => {
  const option = document.createElement("option");
  option.value = zone;
  option.textContent = zone;
  timezoneSelector.appendChild(option);
});

// Set default timezone
timezoneSelector.value = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Create time slots from 9 AM to 5 PM
const selectedSlots = [];
for (let hour = 9; hour <= 17; hour++) {
  const slot = document.createElement("div");
  slot.classList.add("slot");
  slot.dataset.hour = hour;
  slot.textContent = ${hour}:00 - ${hour + 1}:00;
  slot.addEventListener("click", () => {
    slot.classList.toggle("selected");
    const index = selectedSlots.indexOf(hour);
    if (index > -1) {
      selectedSlots.splice(index, 1);
    } else {
      selectedSlots.push(hour);
    }
  });
  timeSlotsContainer.appendChild(slot);
}

// Generate summary
generateBtn.addEventListener("click", () => {
  const tz = timezoneSelector.value;
  if (selectedSlots.length === 0) {
    summaryBox.innerHTML = <strong>No time slots selected.</strong>;
    summaryBox.style.display = "block";
    return;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
    timeZoneName: 'short'
  });

  let result = <strong>Selected Time Slots (${tz}):</strong><ul>;
  selectedSlots.sort((a, b) => a - b).forEach(hour => {
    const date = new Date();
    date.setHours(hour, 0, 0);
    const formatted = formatter.format(date);
    result += <li>${formatted} - ${formatter.format(new Date(date.getTime() + 60 * 60 * 1000))}</li>;
  });
  result += "</ul>";
  summaryBox.innerHTML = result;
  summaryBox.style.display = "block";
});