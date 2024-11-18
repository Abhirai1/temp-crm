function initializeRoofTypeSelection() {
  document
    .querySelectorAll('input[name="roof_type"]')
    .forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (this.value === "flat") {
          document
            .getElementById("comp-shingle")
            .closest(".roof-material-option").style.display = "none";
          document
            .getElementById("flat-tile")
            .closest(".roof-material-option").style.display = "none";
          document
            .getElementById("s-tile")
            .closest(".roof-material-option").style.display = "none";
          document
            .getElementById("w-tile")
            .closest(".roof-material-option").style.display = "none";
        } else {
          document
            .getElementById("comp-shingle")
            .closest(".roof-material-option").style.display = "";
          document
            .getElementById("flat-tile")
            .closest(".roof-material-option").style.display = "";
          document
            .getElementById("s-tile")
            .closest(".roof-material-option").style.display = "";
          document
            .getElementById("w-tile")
            .closest(".roof-material-option").style.display = "";
        }
      });
    });
}

function initializeRoofMaterialSelection() {
  const otherMaterialRadio = document.getElementById("other");
  const otherInputContainer = document.querySelector(".other-input-container");
  const otherMaterialInput = document.getElementById("other-material-input");

  // Function to toggle the display and required attribute for the "Specify Material" input
  function toggleOtherMaterialInput() {
    if (otherMaterialRadio.checked) {
      otherInputContainer.style.display = "block";
      otherMaterialInput.required = true; // Make the input required
    } else {
      otherInputContainer.style.display = "none";
      otherMaterialInput.required = false; // Remove the required attribute
    }
  }

  // Event listener for "Other" radio button
  otherMaterialRadio.addEventListener("change", toggleOtherMaterialInput);

  // Hide the input field and remove required attribute when any other material is selected
  const materialRadios = document.querySelectorAll(
    'input[name="roof_material"]'
  );
  materialRadios.forEach((radio) => {
    if (radio.id !== "other") {
      radio.addEventListener("change", toggleOtherMaterialInput);
    }
  });

  // Set initial state
  toggleOtherMaterialInput();
}

// Call this function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeRoofTypeSelection();
  initializeRoofMaterialSelection();
});
