// SAMPLE size charts for tops. These are placeholder numbers.
// Replace each with the brand's official chart (chest range in cm).
const BRANDS = {
  "Zara": [
    { size: "S", maxChest: 92 },
    { size: "M", maxChest: 98 },
    { size: "L", maxChest: 104 },
    { size: "XL", maxChest: 112 }
  ],
  "H&M": [
    { size: "S", maxChest: 90 },
    { size: "M", maxChest: 96 },
    { size: "L", maxChest: 102 },
    { size: "XL", maxChest: 110 }
  ],
  "Uniqlo": [
    { size: "S", maxChest: 94 },
    { size: "M", maxChest: 100 },
    { size: "L", maxChest: 106 },
    { size: "XL", maxChest: 114 }
  ],
  "Nike": [
    { size: "S", maxChest: 93 },
    { size: "M", maxChest: 99 },
    { size: "L", maxChest: 105 },
    { size: "XL", maxChest: 113 }
  ]
};

const STORAGE_KEY = "sizeMatchMeasurements";

const stepMeasure = document.getElementById("step-measure");
const stepShop = document.getElementById("step-shop");
const form = document.getElementById("measure-form");
const summary = document.getElementById("saved-summary");
const brandSelect = document.getElementById("brand");
const typeSelect = document.getElementById("type");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("result-text");
const resultNote = document.getElementById("result-note");

// Fill the brand dropdown
Object.keys(BRANDS).forEach(function (name) {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  brandSelect.appendChild(option);
});

function getSaved() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function showShopStep(data) {
  summary.textContent =
    "Saved: " + data.height + " cm, " + data.weight + " kg, chest " +
    data.chest + " cm, " + data.fit + " fit";
  stepMeasure.classList.add("hidden");
  stepShop.classList.remove("hidden");
}

function showMeasureStep(data) {
  if (data) {
    Object.keys(data).forEach(function (key) {
      const field = document.getElementById(key);
      if (field) field.value = data[key];
    });
  }
  stepShop.classList.add("hidden");
  stepMeasure.classList.remove("hidden");
}

// Save measurements
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const data = {
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    chest: document.getElementById("chest").value,
    shoulders: document.getElementById("shoulders").value,
    waist: document.getElementById("waist").value,
    hips: document.getElementById("hips").value,
    fit: document.getElementById("fit").value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  showShopStep(data);
});

// Edit measurements
document.getElementById("edit-btn").addEventListener("click", function () {
  showMeasureStep(getSaved());
});

// Photo preview (stays on the device)
photoInput.addEventListener("change", function () {
  const file = photoInput.files[0];
  if (!file) return;
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
});

// Recommend a size
document.getElementById("check-btn").addEventListener("click", function () {
  const data = getSaved();
  if (!data) return;

  const brand = brandSelect.value;
  const chart = BRANDS[brand];

  // Add ease based on fit preference
  let chest = Number(data.chest);
  if (data.fit === "loose") chest -= 4;
  if (data.fit === "fitted") chest += 3;

  let match = chart.find(function (row) {
    return chest <= row.maxChest;
  });
  let note = "Based on your chest measurement and fit preference.";
  if (!match) {
    match = chart[chart.length - 1];
    note = "You may be outside this brand's standard range. Check their size chart.";
  }

  resultText.textContent = "Your size at " + brand + ": " + match.size;
  resultNote.textContent = note;

  const query = encodeURIComponent(brand + " " + typeSelect.options[typeSelect.selectedIndex].text);
  document.getElementById("shop-amazon").href = "https://www.amazon.in/s?k=" + query;
  document.getElementById("shop-flipkart").href = "https://www.flipkart.com/search?q=" + query;
  document.getElementById("shop-myntra").href = "https://www.myntra.com/" + encodeURIComponent(brand + " tshirt");

  resultBox.classList.remove("hidden");
});

// On page load: skip the form if measurements are already saved
const saved = getSaved();
if (saved) {
  showShopStep(saved);
}
