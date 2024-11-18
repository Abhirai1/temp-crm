document.addEventListener("DOMContentLoaded", function () {
    // Function to initialize each toggle button
    function initToggle(toggleContainer) {
      const buttons = toggleContainer.querySelectorAll(".toggle-option");
      const toggleId = toggleContainer.getAttribute("data-toggle");
      const hiddenInput = document.querySelector(`input#${toggleId}`);
      const toggle = toggleContainer.querySelector(".toggle");
  
      // Add click event to each button
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          // Remove active class from all buttons
          buttons.forEach((btn) => btn.classList.remove("active"));
  
          // Add active class to clicked button
          button.classList.add("active");
  
          // Update hidden input value based on selected option
          if (hiddenInput) hiddenInput.value = button.dataset.value;
  
          // Update the data-selected attribute to control the slider position
          toggle.setAttribute("data-selected", button.dataset.value);
        });
      });
    }
  
    // Select all toggle containers with the data-toggle attribute and initialize each
    const toggleContainers = document.querySelectorAll(
      ".toggle-container[data-toggle]"
    );
    toggleContainers.forEach(initToggle);
  });
