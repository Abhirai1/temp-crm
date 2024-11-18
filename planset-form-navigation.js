class MultiPageForm {
  constructor() {
    console.log("Initializing MultiPageForm...");
    this.currentPage = parseInt(sessionStorage.getItem("currentPage")) || 0;
    this.formData = JSON.parse(sessionStorage.getItem("formData")) || {};

    // Get DOM elements
    this.formPages = document.querySelectorAll(".form-page");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.nextButtons = document.querySelectorAll(".next-btn");
    this.prevButtons = document.querySelectorAll(".prev-btn");
    this.form = document.querySelector("#multi-page-form");

    // Create save button
    this.saveButton = document.createElement("button");
    this.saveButton.className = "btn btn-success mx-1";
    this.saveButton.type = "button";
    this.saveButton.textContent = "Save";

    console.log("Initial state:", {
      currentPage: this.currentPage,
      totalPages: this.formPages.length,
      navLinks: this.navLinks.length,
      nextButtons: this.nextButtons.length,
      prevButtons: this.prevButtons.length,
      formFound: !!this.form,
    });

    this.initializeForm();
    this.loadSavedFormData();
    this.updateNavigationButtons();
    this.preventDefaultTabBehavior();
  }

  initializeForm() {
    console.log("Initializing form layout...");

    // Initialize pages visibility
    this.formPages.forEach((page, index) => {
      console.log(`Setting up page ${index + 1}`);
      page.classList.remove("show", "active");

      if (index === this.currentPage) {
        console.log(`Activating initial page ${index + 1}`);
        page.classList.add("show", "active");
        this.updateNavLinkStyle(index);
      }
    });

    // Setup navigation event listeners
    this.navLinks.forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const pageIndex = parseInt(link.getAttribute("data-page"));
        console.log(`Nav link clicked for page ${pageIndex + 1}`);
        this.handleNavClick(pageIndex);
      });
    });

    // Setup button listeners
    this.nextButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Next button clicked");
        if (this.validateCurrentPage()) {
          this.handleNext();
        } else {
          alert("Please fill in all required fields before proceeding.");
        }
      });
    });

    this.prevButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Previous button clicked");
        this.handlePrev();
      });
    });

    // Save button listener
    this.saveButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.validateCurrentPage()) {
        this.handleSave();
      } else {
        alert("Please fill in all required fields before saving.");
      }
    });

    // Form change listener for auto-save
    this.form.addEventListener("change", () => {
      console.log("Form changed - saving to session storage");
      this.saveToSessionStorage();
    });

    this.updateNavigationState();
  }

  updateNavLinkStyle(pageIndex) {
    this.navLinks.forEach((link, index) => {
      link.classList.remove("active", "text-success", "bg-success-subtle");
      if (index === pageIndex) {
        link.classList.add("active", "text-success", "bg-success-subtle");
      }
    });
  }
  changePage(newPage) {
    console.log(`Attempting to change to page ${newPage + 1}`);

    if (newPage >= 0 && newPage < this.formPages.length) {
      console.log("Page change is valid");

      // Remove active classes from all pages
      this.formPages.forEach((page) => {
        page.classList.remove("show", "active");
      });

      // Show new page
      this.formPages[newPage].classList.add("show", "active");

      // Update current page
      this.currentPage = newPage;
      sessionStorage.setItem("currentPage", newPage.toString());
      console.log(`Updated current page to ${newPage + 1}`);

      // Update navigation state including nav links
      this.updateNavigationState();
    } else {
      console.warn(`Invalid page number requested: ${newPage + 1}`);
    }
  }

  handleNext() {
    console.log(`Current page: ${this.currentPage + 1}`);
    if (this.currentPage < this.formPages.length - 1) {
      console.log("Moving to next page");
      this.changePage(this.currentPage + 1);
    } else {
      console.log("Already on last page");
    }
  }

  handlePrev() {
    console.log(`Current page: ${this.currentPage + 1}`);
    if (this.currentPage > 0) {
      console.log("Moving to previous page");
      this.changePage(this.currentPage - 1);
    } else {
      console.log("Already on first page");
    }
  }

  handleNavClick(pageIndex) {
    console.log(`Nav click requested for page ${pageIndex + 1}`);

    // Store current page before validation
    const originalPage = this.currentPage;

    if (pageIndex > this.currentPage) {
      // Moving forward - validate all pages up to the requested page
      for (let i = this.currentPage; i < pageIndex; i++) {
        if (!this.validateCurrentPage()) {
          alert("Please fill in all required fields before proceeding.");
          return false;
        }
        this.currentPage = i + 1;
      }
    }

    // If validation passes or moving backward, proceed with page change
    this.currentPage = originalPage; // Reset to original page
    this.changePage(pageIndex);
    return true;
  }

  preventDefaultTabBehavior() {
    // Remove Bootstrap's data-bs-toggle attribute
    this.navLinks.forEach((link) => {
      link.removeAttribute("data-bs-toggle");

      // Add click event listener with preventDefault
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const pageIndex = parseInt(link.getAttribute("data-page"));
        this.handleNavClick(pageIndex);
      });
    });
  }

  changePage(newPage) {
    if (newPage >= 0 && newPage < this.formPages.length) {
      // Remove active classes from all pages and nav links
      this.formPages.forEach((page) => {
        page.classList.remove("show", "active");
      });

      this.navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      // Show new page
      this.formPages[newPage].classList.add("show", "active");

      // Update nav link
      const newNavLink = this.navLinks[newPage];
      if (newNavLink) {
        newNavLink.classList.add("active");
      }

      // Update current page
      this.currentPage = newPage;
      sessionStorage.setItem("currentPage", newPage.toString());

      this.updateNavigationButtons();
    }
  }

  updateNavigationState() {
    console.log("Updating navigation state...");

    // Update nav links state and style
    this.navLinks.forEach((link, index) => {
      // Remove all active classes first
      link.classList.remove("active", "text-success", "bg-success-subtle");

      if (index === this.currentPage) {
        link.classList.add("active", "text-success", "bg-success-subtle");
        console.log(`Nav link ${index + 1} activated`);
      } else {
        console.log(`Nav link ${index + 1} deactivated`);
      }
    });

    this.updateNavigationButtons();
  }

  updateNavigationButtons() {
    const isFirstPage = this.currentPage === 0;
    const isLastPage = this.currentPage === this.formPages.length - 1;

    // Update Previous button
    this.prevButtons.forEach((button) => {
      button.disabled = isFirstPage;
      console.log(`Previous button ${isFirstPage ? "disabled" : "enabled"}`);
    });

    // Handle Next/Save button
    this.nextButtons.forEach((button) => {
      if (isLastPage) {
        // Replace next button with save button if not already replaced
        if (!button.parentNode.contains(this.saveButton)) {
          button.parentNode.replaceChild(this.saveButton, button);
        }
      } else if (button.parentNode.contains(this.saveButton)) {
        // Replace save button with next button
        button.parentNode.replaceChild(button, this.saveButton);
      }
      button.disabled = isLastPage;
      console.log(
        `Next button ${isLastPage ? "replaced with Save" : "enabled"}`
      );
    });
  }

  validateCurrentPage() {
    try {
      console.log("Starting validation...");
      const currentPageElement = this.formPages[this.currentPage];

      // Check if page element exists
      if (!currentPageElement) {
        console.error("Current page element not found");
        return false;
      }

      const requiredFields = currentPageElement.querySelectorAll("[required]");
      let isValid = true;

      // Clear any previous errors first
      this.clearErrors();

      requiredFields.forEach((field) => {
        // Safety check for field existence
        if (!field) {
          console.error("Field is undefined");
          isValid = false;
          return;
        }

        try {
          // Handle different field types
          switch (field.tagName.toLowerCase()) {
            case "select":
              // For dropdown
              if (
                !field.value ||
                field.value === "" ||
                field.value === "choosing"
              ) {
                isValid = false;
                this.handleInvalidField(field, "Please select an option");
              } else {
                this.handleValidField(field);
              }
              break;

            case "input":
              // For text, email, number etc.
              if (!field.value || !field.value.trim()) {
                isValid = false;
                this.handleInvalidField(field, "This field is required");
              } else {
                // Additional validation based on input type
                switch (field.type) {
                  case "email":
                    if (!this.isValidEmail(field.value)) {
                      isValid = false;
                      this.handleInvalidField(
                        field,
                        "Please enter a valid email"
                      );
                    } else {
                      this.handleValidField(field);
                    }
                    break;

                  case "number":
                    if (isNaN(field.value)) {
                      isValid = false;
                      this.handleInvalidField(
                        field,
                        "Please enter a valid number"
                      );
                    } else {
                      this.handleValidField(field);
                    }
                    break;

                  default:
                    this.handleValidField(field);
                }
              }
              break;

            case "textarea":
              if (!field.value || !field.value.trim()) {
                isValid = false;
                this.handleInvalidField(field, "This field is required");
              } else {
                this.handleValidField(field);
              }
              break;

            default:
              console.warn(`Unhandled field type: ${field.tagName}`);
          }
        } catch (fieldError) {
          console.error("Error validating field:", fieldError);
          isValid = false;
        }
      });

      console.log(
        `Validation complete. Form is ${isValid ? "valid" : "invalid"}`
      );
      return isValid;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  }

  // Helper methods
  handleInvalidField(field, message) {
    field.setAttribute("aria-invalid", "true");
    field.style.borderColor = "red";
    this.showError(field, message);
  }

  handleValidField(field) {
    field.setAttribute("aria-invalid", "false");
    field.style.borderColor = "";
    // Remove any error messages if they exist
    this.clearFieldError(field);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(field, message) {
    // Create error message element if it doesn't exist
    let errorDiv = field.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains("error-message")) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    errorDiv.textContent = message;
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "12px";
    errorDiv.style.marginTop = "4px";
  }

  clearFieldError(field) {
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("error-message")) {
      errorDiv.remove();
    }
  }

  clearErrors() {
    // Remove all error messages and styling
    const currentPageElement = this.formPages[this.currentPage];
    if (currentPageElement) {
      const errorMessages =
        currentPageElement.querySelectorAll(".error-message");
      errorMessages.forEach((msg) => msg.remove());

      const fields = currentPageElement.querySelectorAll("[required]");
      fields.forEach((field) => {
        field.style.borderColor = "";
        field.setAttribute("aria-invalid", "false");
      });
    }
  }

  showError(field) {
    console.log(`Showing error for field ${field.name}`);
    const errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    errorDiv.textContent = `${field.name} is required`;
    field.parentElement.appendChild(errorDiv);
  }

  clearErrors() {
    console.log("Clearing all error messages");
    const errorMessages = this.form.querySelectorAll(".invalid-feedback");
    errorMessages.forEach((error) => error.remove());

    const invalidFields = this.form.querySelectorAll(".is-invalid");
    invalidFields.forEach((field) => field.classList.remove("is-invalid"));
  }

  loadSavedFormData() {
    console.log("Loading saved form data...");
    const savedData = JSON.parse(sessionStorage.getItem("formData")) || {};

    Object.entries(savedData).forEach(([name, value]) => {
      const input = this.form.querySelector(`[name="${name}"]`);
      if (input) {
        input.value = value;
        console.log(`Restored value for ${name}:`, value);
      }
    });
  }

  saveToSessionStorage() {
    console.log("Saving form data...");
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    sessionStorage.setItem("formData", JSON.stringify(data));
    console.log("Saved form data:", data);
  }

  handleSave() {
    console.log("Handling form save...");
    // Validate all pages before saving
    let isValid = true;
    const currentPageBackup = this.currentPage;

    for (let i = 0; i < this.formPages.length; i++) {
      this.currentPage = i;
      if (!this.validateCurrentPage()) {
        alert(
          `Please complete all required fields on page ${i + 1} before saving.`
        );
        isValid = false;
        break;
      }
    }

    this.currentPage = currentPageBackup;
    this.updateNavigationState();

    if (isValid) {
      this.saveToSessionStorage();
      // Add your save to server logic here
      alert("Form saved successfully!");
      console.log("Form validated and saved successfully");
    } else {
      console.log("Form validation failed during save");
    }
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded - initializing form");
  new MultiPageForm();
});
