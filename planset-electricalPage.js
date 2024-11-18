function setupRatingSection(sectionId) {
  const section = document.getElementById(sectionId);
  const options = section.querySelectorAll(".rating-option");
  const otherInput = document.getElementById(sectionId + "Other");
  console.log("in setupRatingSection");
  console.log(section, options, otherInput);

  options.forEach((option) => {
    option.addEventListener("click", function () {
      const isOther = this.dataset.value === "other";
      const wasSelected = this.classList.contains("selected");

      // Deselect all options
      options.forEach((opt) => opt.classList.remove("selected"));
      otherInput.style.display = "none";
      otherInput.value = "";

      if (!wasSelected) {
        this.classList.add("selected");
        if (isOther) {
          otherInput.style.display = "block";
        }
      }
    });
  });
}

function setupSubPanelToggle() {

  const toggle = document.querySelector(".sub-panel-toggle");
  const options = toggle.querySelectorAll(".toggle-option");
  const hiddenInput = document.getElementById("sub-panel");
  const subPanelRatings = document.getElementById("sub-panel-ratings");
  const subPanelPhotosSection = document.getElementById(
    "sub-panel-photos-section"
  );


  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((opt) => opt.classList.remove("active"));


      this.classList.add("active");
      toggle.dataset.selected = this.dataset.value;
      hiddenInput.value = this.dataset.value;
     

      if (this.dataset.value === "yes") {
        subPanelRatings.style.display = "block";
        subPanelPhotosSection.style.display = "block";
      } else {
        subPanelRatings.style.display = "none";
        subPanelPhotosSection.style.display = "none";
      }
    });
  });
}


function setupToggle(id) {
  const container = document.querySelector(`.${id}-toggle`);
  console.log("container -> ",container);
  const toggle = container.querySelector(".toggle");
  const options = toggle.querySelectorAll(".toggle-option");
  const hiddenInput = document.getElementById(id);
  const manufacturerModel = document.querySelector(`.${id}-model`);

  // Select all input fields that should be required when 'Yes' is selected
  const modelInputs = manufacturerModel.querySelectorAll("input");

  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
      toggle.dataset.selected = this.dataset.value;
      hiddenInput.value = this.dataset.value;
      if (this.dataset.value === "yes") {
        manufacturerModel.style.display = "block";
        // Make input fields required
        modelInputs.forEach((input) => (input.required = true));
      } else {
        manufacturerModel.style.display = "none";
        // Remove required attribute from input fields
        modelInputs.forEach((input) => (input.required = false));
      }
    });
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  console.log("document from electric page");
  setupRatingSection("mainPanelRating");
  setupRatingSection("mainBreakerRating");
  setupSubPanelToggle();
  setupRatingSection("subPanelRating");
  setupRatingSection("subPanelBreakerRating");
  setupToggle("ac-disconnect");
  setupToggle("combiner-cabinet");
  setupToggle("production-meter");
});
