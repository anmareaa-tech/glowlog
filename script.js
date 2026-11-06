
const START_DATE = new Date(2026, 10, 7); // November 7, 2026

const morning = [
  "Drink water and get ready",
  "Gentle face cleanse or rinse",
  "Moisturizer + sunscreen",
  "Balanced breakfast with protein",
  "Gently brush and style hair"
];

const evening = [
  "Walk or do enjoyable physical activity",
  "Eat a balanced dinner",
  "Avoid tight hairstyles and pulling",
  "Detangle gently if needed"
];

const night = [
  "Cleanse face gently",
  "Apply moisturizer",
  "Lip balm if desired",
  "Prepare for tomorrow",
  "Aim for 7–9 hours of sleep"
];

const hairCare = {
  0: ["Rest day: clean pillowcase and hairbrush."], // Sunday
  1: ["Wash if needed; condition lengths and ends."],
  2: ["Gentle detangling; avoid tight hairstyles."],
  3: ["Wash if needed; keep scalp comfortable and clean."],
  4: ["Avoid pulling; check for scalp irritation."],
  5: ["Wash if needed; use gentle handling."],
  6: ["Optional light pre-wash oil only if it suits your scalp."]
};

const weeks = [
  {
    title: "Week 1 · Reset",
    description: "November 7–13",
    tasks: [
      "Take baseline photos in similar lighting",
      "Start morning and night routines",
      "Book a dermatologist appointment for hair fall",
      "Clean hairbrush and change pillowcase"
    ]
  },
  {
    title: "Week 2 · Consistency",
    description: "November 14–20",
    tasks: [
      "Follow gentle hair-care habits",
      "Avoid unnecessary heat styling",
      "Eat balanced meals with protein",
      "Keep skincare simple and gentle"
    ]
  },
  {
    title: "Week 3 · Find your framing",
    description: "November 21–27",
    tasks: [
      "Experiment with middle and side parting",
      "Try face-framing hairstyles",
      "Practice relaxed neck and head posture"
    ]
  },
  {
    title: "Week 4 · Progress check",
    description: "November 28–December 4",
    tasks: [
      "Compare photos in similar lighting",
      "Note shedding and scalp changes",
      "Check skin hydration and comfort",
      "Avoid changing everything at once"
    ]
  },
  {
    title: "Week 5 · Hair styling",
    description: "December 5–11",
    tasks: [
      "Try soft face-framing styles",
      "Practice one easy everyday hairstyle",
      "Continue your routine"
    ]
  },
  {
    title: "Week 6 · Polishing",
    description: "December 12–18",
    tasks: [
      "Gently groom brows if desired",
      "Try styles with soft side volume",
      "Continue sun protection and hydration"
    ]
  },
  {
    title: "Week 7 · Maintain",
    description: "December 19–25",
    tasks: [
      "Keep sleep and meals consistent",
      "Avoid harsh new treatments or DIY remedies",
      "Focus on styling and comfort"
    ]
  },
  {
    title: "Week 8 · Review",
    description: "December 26–January 5",
    tasks: [
      "Take comparison photos in similar lighting",
      "Review shedding, skin hydration, and styling",
      "Keep helpful habits going into 2027"
    ]
  }
];

const dailySections = {
  morning,
  evening,
  night
};

const daySelect = document.getElementById("daySelect");

let selectedDay = 1;

function getDate(day) {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + day - 1);
  return date;
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getWeek(day) {
  if (day <= 49) {
    return Math.ceil(day / 7) - 1;
  }
  return 7;
}

function getStorageKey(day) {
  return `glowlog-day-${day}`;
}

function getDayData(day) {
  return JSON.parse(localStorage.getItem(getStorageKey(day))) || {
    morning: [],
    evening: [],
    night: [],
    hair: [],
    weekly: [],
    mood: "",
    notes: ""
  };
}

function saveDayData(day, data) {
  localStorage.setItem(getStorageKey(day), JSON.stringify(data));
}

function renderTasks(containerId, tasks, section, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const checked = data[section].includes(index);

    const label = document.createElement("label");
    label.className = `task ${checked ? "done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;

    const text = document.createElement("span");
    text.textContent = task;

    checkbox.addEventListener("change", () => {
      const updated = getDayData(selectedDay);

      if (checkbox.checked) {
        if (!updated[section].includes(index)) {
          updated[section].push(index);
        }
      } else {
        updated[section] = updated[section].filter(i => i !== index);
      }

      saveDayData(selectedDay, updated);
      renderDay();
    });

    label.append(checkbox, text);
    container.appendChild(label);
  });
}

function renderDay() {
  const data = getDayData(selectedDay);
  const date = getDate(selectedDay);
  const weekIndex = getWeek(selectedDay);
  const week = weeks[weekIndex];

  document.getElementById("dayNumber").textContent = `Day ${selectedDay}`;
  document.getElementById("todayTitle").textContent =
    selectedDay === 60 ? "You made it to Day 60! ♡" : "Your glow-up journey ♡";

  document.getElementById("todayDate").textContent = formatDate(date);

  renderTasks("morningTasks", morning, "morning", data);
  renderTasks("eveningTasks", evening, "evening", data);
  renderTasks("nightTasks", night, "night", data);

  const weekday = date.getDay();
  const hairTasks = hairCare[weekday];

  document.getElementById("hairFocus").textContent =
    "Gentle care only — this is not a hair-loss treatment.";

  renderTasks("hairTasks", hairTasks, "hair", data);

  document.getElementById("weeklyTitle").textContent = week.title;
  document.getElementById("weeklyDescription").textContent = week.description;

  renderTasks("weeklyTasks", week.tasks, "weekly", data);

  document.getElementById("mood").value = data.mood;
  document.getElementById("notes").value = data.notes;

  updateProgress();
}

function updateProgress() {
  let total = 0;
  let completed = 0;

  for (let day = 1; day <= 60; day++) {
    const data = getDayData(day);
    const date = getDate(day);
    const week = weeks[getWeek(day)];

    total += morning.length + evening.length + night.length;
    total += hairCare[date.getDay()].length;
    total += week.tasks.length;

    completed += data.morning.length;
    completed += data.evening.length;
    completed += data.night.length;
    completed += data.hair.length;
    completed += data.weekly.length;
  }

  const percent = Math.round((completed / total) * 100);

  document.getElementById("progressText").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;

  let message = "Start with one small habit today.";

  if (percent >= 25) message = "You're building lovely habits 🌷";
  if (percent >= 50) message = "Halfway there — keep going! ✨";
  if (percent >= 75) message = "Look at you staying consistent ♡";
  if (percent === 100) message = "You completed your 60-day journey!";

  document.getElementById("progressMessage").textContent = message;
}

function createDayOptions() {
  for (let day = 1; day <= 60; day++) {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = `Day ${day} — ${formatDate(getDate(day))}`;
    daySelect.appendChild(option);
  }
}

daySelect.addEventListener("change", () => {
  selectedDay = Number(daySelect.value);
  renderDay();
});

document.getElementById("mood").addEventListener("change", event => {
  const data = getDayData(selectedDay);
  data.mood = event.target.value;
  saveDayData(selectedDay, data);
});

document.getElementById("notes").addEventListener("input", event => {
  const data = getDayData(selectedDay);
  data.notes = event.target.value;
  saveDayData(selectedDay, data);
  document.getElementById("saveMessage").textContent =
    "Saved automatically ♡";
});

createDayOptions();
renderDay();
