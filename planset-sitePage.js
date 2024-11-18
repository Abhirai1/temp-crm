function handleJobTypeSelection() {
  console.log("");
  const jobTypeSelect = document.getElementById("jobTypeSelect");
  const batterySection = document.getElementById("batterySection");
  const batterySection1 = document.getElementById("batteryBackupBox");
  const batteryBackupField = document.querySelector(
    'select[name="batteryBackup"]'
  ); // Make sure this matches your HTML

  function updateFields() {
    console.log("Updating handle job type", jobTypeSelect.value);
    if (jobTypeSelect.value === "PV") {
      batterySection.style.display = "none";
      batterySection1.style.display = "none";
      if (batteryBackupField) {
        console.log("PV selected");
        batteryBackupField.closest(".col-lg-3").style.display = "none";
      }
    } else {
      batterySection.style.display = "block";
      batterySection1.style.display = "block";
      if (batteryBackupField) {
        batteryBackupField.closest(".col-lg-3").style.display = "block";
      }
    }
  }

  jobTypeSelect.addEventListener("change", updateFields);

  // Initial check
  updateFields();
}

function handleModuleManufacturerVisibility() {
  const jobTypeSelect = document.getElementById("jobTypeSelect");
  const moduleManufacturerRow = document.getElementById(
    "moduleManufacturerRow"
  );

  function updateModuleManufacturerVisibility() {
    if (jobTypeSelect.value === "Battery") {
      moduleManufacturerRow.style.display = "none";
    } else {
      moduleManufacturerRow.style.display = "flex"; // or 'block', depending on your layout
    }
  }

  jobTypeSelect.addEventListener("change", updateModuleManufacturerVisibility);

  // Initial check
  updateModuleManufacturerVisibility();
}

// addInverter
function addInverter() {
  console.log("add inverter");
  const inverterSection = document.getElementById("inverterSection");
  const newRow = inverterSection.querySelector(".inverter-row").cloneNode(true);

  newRow.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  const lastCol = newRow.querySelector(".col-lg-2");
  lastCol.innerHTML = `
        <div class="mb-3">
            <label class="text-label form-label">Remove Inverter</label>
            <button type="button" class="btn btn-danger form-control" onclick="removeInverter(this)">- Remove</button>
        </div>
    `;

  inverterSection.appendChild(newRow);
}

function removeInverter(button) {
  const row = button.closest(".inverter-row");
  row.remove();
}

function addModule() {
  console.log("add a module called");
  const moduleSection = document.getElementById("moduleSection");
  const newRow = moduleSection.querySelector(".module-row").cloneNode(true);

  newRow.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  const lastCol = newRow.querySelector(".col-lg-2");
  lastCol.innerHTML = `
        <div class="mb-3">
            <label class="text-label form-label">Remove Module</label>
            <button type="button" class="btn btn-danger form-control" onclick="removeModule(this)">- Remove</button>
        </div>
    `;

  moduleSection.appendChild(newRow);
}

function removeModule(button) {
  const row = button.closest(".module-row");
  row.remove();
}

function addExistingInverter() {
  const existingInverterSection = document.getElementById(
    "existingInverterSection"
  );
  const newRow = existingInverterSection
    .querySelector(".inverter-row")
    .cloneNode(true);

  newRow.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  const lastCol = newRow.querySelector(".col-lg-2");
  lastCol.innerHTML = `
        <div class="mb-3">
            <label class="text-label form-label">Remove Existing Inverter</label>
            <button type="button" class="btn btn-danger form-control" onclick="removeExistingInverter(this)">- Remove</button>
        </div>
    `;

  existingInverterSection.appendChild(newRow);
}

// add battery functionality

function addBattery() {
  const batterySection = document.getElementById("batterySection");
  const newRow = batterySection.querySelector(".battery-row").cloneNode(true);

  newRow.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  const lastCol = newRow.querySelector(".col-lg-2");
  lastCol.innerHTML = `
        <div class="mb-3">
            <label class="text-label form-label">Remove Battery</label>
            <button type="button" class="btn btn-danger form-control" onclick="removeBattery(this)">- Remove</button>
        </div>
    `;

  batterySection.appendChild(newRow);
}

function removeBattery(button) {
  const row = button.closest(".battery-row");
  row.remove();
}

function removeExistingInverter(button) {
  const row = button.closest(".inverter-row");
  row.remove();
}

function initializeExistingSolarSystem() {
  console.log("initializeExistingSolarSystem");

  const yesButton = document.getElementById("existing-solar-yes");
  const noButton = document.getElementById("existing-solar-no");
  const moduleSection = document.getElementById("moduleSection");
  const existingInverterSection = document.getElementById(
    "existingInverterSection"
  );

  console.log("yesButton -> ", yesButton, " noButton -> ", noButton);

  // Get all input fields within the module and inverter sections
  const moduleFields = moduleSection.querySelectorAll("input");
  const inverterFields = existingInverterSection.querySelectorAll("input");

  function toggleExistingSolarFields(activeValue) {
    const isYesSelected = activeValue === "yes";

    // Show or hide sections based on active toggle
    moduleSection.style.display = isYesSelected ? "block" : "none";
    existingInverterSection.style.display = isYesSelected ? "block" : "none";

    // Toggle required attribute based on the selection
    moduleFields.forEach((field) => {
      field.required = isYesSelected;
    });
    inverterFields.forEach((field) => {
      field.required = isYesSelected;
    });

    // Update hidden input value
    document.getElementById("existing-solar-fields").value = activeValue;

    // Update toggle button states
    yesButton.classList.toggle("active", isYesSelected);
    noButton.classList.toggle("active", !isYesSelected);
  }

  // Event listeners for toggle buttons
  yesButton.addEventListener("click", () => toggleExistingSolarFields("yes"));
  noButton.addEventListener("click", () => toggleExistingSolarFields("no"));

  // Set initial state based on the current active button
  const initialActive = yesButton.classList.contains("active") ? "yes" : "no";
  toggleExistingSolarFields(initialActive);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("from planset site page js");
  handleJobTypeSelection();
  handleModuleManufacturerVisibility();
  initializeExistingSolarSystem();
});
