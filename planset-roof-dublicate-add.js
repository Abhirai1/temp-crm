// Global variables
let roofCount = 1;
let initialRoofTemplate = "";

// Function to store initial template
function storeInitialTemplate() {
  const firstRoof = document.querySelector("#roof1");
  if (firstRoof) {
    initialRoofTemplate = firstRoof.innerHTML;
    console.log("Initial roof template stored:", initialRoofTemplate);
  } else {
    console.error("Initial roof template not found");
  }
}

// Function to create new roof tab
function createRoofTab(roofNumber) {
  console.log("Creating new roof tab:", roofNumber);
  const li = document.createElement("li");
  li.className = "nav-item";
  li.innerHTML = `
        <a class="nav-link ${roofNumber === 1 ? "active" : ""}" 
           data-bs-toggle="tab" 
           href="#roof${roofNumber}">
           Roof ${roofNumber}
           <span class="close-tab" data-roof="${roofNumber}">&times;</span>
        </a>`;
  return li;
}

// Function to create new roof content
function createRoofContent(roofNumber, isDuplicate = false) {
  console.log(
    `Creating new roof content for Roof ${roofNumber}, isDuplicate:`,
    isDuplicate
  );
  const div = document.createElement("div");
  div.className = `tab-pane fade ${roofNumber === 1 ? "show active" : ""}`;
  div.id = `roof${roofNumber}`;
  div.setAttribute("role", "tabpanel");

  if (isDuplicate) {
    const currentRoof = document.querySelector(".tab-pane.active");
    if (currentRoof) {
      // Clone the current roof's template
      div.innerHTML = initialRoofTemplate;
      console.log(`Applying initial template to duplicated Roof ${roofNumber}`);

      // Copy values from the current active roof
      const currentInputs = currentRoof.querySelectorAll("input, select");
      const newInputs = div.querySelectorAll("input, select");

      currentInputs.forEach((currentInput, index) => {
        const newInput = newInputs[index];

        // Handle different input types
        if (currentInput.type === "radio") {
          if (currentInput.checked) {
            newInput.checked = true;
          }
        } else if (currentInput.type === "checkbox") {
          newInput.checked = currentInput.checked;
        } else {
          newInput.value = currentInput.value;
        }

        // Update IDs and names to be unique
        const newId = `${newInput.id}_roof${roofNumber}`;
        const newName = `${newInput.name}_roof${roofNumber}`;

        // Update corresponding label
        const label = div.querySelector(`label[for="${newInput.id}"]`);
        if (label) {
          label.setAttribute("for", newId);
        }

        newInput.id = newId;
        newInput.name = newName;
      });

      // Handle special cases like "other" input visibility
      const otherContainer = div.querySelector(".other-input-container");
      const currentOtherContainer = currentRoof.querySelector(
        ".other-input-container"
      );
      if (otherContainer && currentOtherContainer) {
        otherContainer.style.display = currentOtherContainer.style.display;
      }
    }
  } else {
    // Original behavior for adding a new roof
    if (initialRoofTemplate) {
      div.innerHTML = initialRoofTemplate;
      console.log(
        `Applying initial template to Roof ${roofNumber}`,
        div.innerHTML
      );

      const inputs = div.querySelectorAll("input");
      inputs.forEach((input) => {
        if (input.type === "radio") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });

      const selects = div.querySelectorAll("select");
      selects.forEach((select) => {
        select.selectedIndex = 0;
      });
    }
  }

  return div;
}

// Function to handle tab switching
function switchToTab(roofNumber) {
  console.log("Switching to Roof:", roofNumber);
  const tabLink = document.querySelector(`a[href="#roof${roofNumber}"]`);
  if (tabLink) {
    const tab = new bootstrap.Tab(tabLink);
    tab.show();
  } else {
    console.warn(`Tab for Roof ${roofNumber} not found`);
  }
}

// Function to remove roof
function removeRoof(roofNumber) {
  console.log("Removing Roof:", roofNumber);
  const tab = document.querySelector(
    `a[href="#roof${roofNumber}"]`
  )?.parentElement;
  const content = document.querySelector(`#roof${roofNumber}`);

  if (tab && content) {
    tab.remove();
    content.remove();
    console.log(`Roof ${roofNumber} removed successfully`);

    if (content.classList.contains("active")) {
      const previousTab = document.querySelector(".nav-link");
      if (previousTab) {
        const tab = new bootstrap.Tab(previousTab);
        tab.show();
      }
    }
  } else {
    console.error(`Failed to remove Roof ${roofNumber}`);
  }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  storeInitialTemplate();

  const tabList = document.getElementById("#roofNavLinks");
  const tabContent = document.getElementById("#roofParent");

  if (!tabList || !tabContent) {
    console.error("Required elements not found");
    return;
  }

  const duplicateBtn = document.getElementById("#dublicateRoofButton")
  if (duplicateBtn) {
    duplicateBtn.addEventListener("click", () => {
      console.log("Duplicate button clicked");
      roofCount++;
      tabList.appendChild(createRoofTab(roofCount));
      tabContent.appendChild(createRoofContent(roofCount, true));
      switchToTab(roofCount);
    });
  }

  const addBtn = document.getElementById("#addRoofButton");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      console.log("Add button clicked");
      roofCount++;
      tabList.appendChild(createRoofTab(roofCount));
      tabContent.appendChild(createRoofContent(roofCount, false));
      switchToTab(roofCount);
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-tab")) {
      const roofNumber = e.target.dataset.roof;
      if (roofCount > 1) {
        console.log(`Close tab clicked for Roof ${roofNumber}`);
        removeRoof(roofNumber);
        roofCount--;
      } else {
        console.warn("Cannot remove the last roof");
      }
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.name.includes("roof_material")) {
      console.log(`Roof material changed:`, e.target.value);
      const roofContent = e.target.closest(".tab-pane");
      const otherInput = roofContent.querySelector(".other-input-container");
      if (otherInput) {
        otherInput.style.display =
          e.target.value === "other" ? "block" : "none";
      }
    }
  });
});
