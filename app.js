document.addEventListener("DOMContentLoaded", () => {
  const TOTAL_STEPS = document.querySelectorAll(".form-step").length;
  let currentStep = 1;

  const stepIndicator = document.getElementById("step-indicator");
  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");
  const btnSubmit = document.getElementById("btn-submit");

  function showStep(n) {
    document.querySelectorAll(".form-step").forEach((el) => {
      el.hidden = true;
    });
    const target = document.querySelector('.form-step[data-step="' + n + '"]');
    if (target) {
      target.hidden = false;
    }
    if (stepIndicator) {
      stepIndicator.textContent = "Step " + n + " of " + TOTAL_STEPS;
    }
    if (btnBack) {
      btnBack.hidden = n === 1;
    }
    if (btnNext) {
      btnNext.hidden = n === TOTAL_STEPS;
    }
    if (btnSubmit) {
      btnSubmit.hidden = n !== TOTAL_STEPS;
    }
    currentStep = n;
    window.scrollTo(0, 0);
  }

  // Checkbox validation rules: each entry maps a checkbox id to the id of the
  // container that holds the "additional data" alternative.  When the container
  // has no user-added entries the checkbox MUST be explicitly checked.
  // Checkboxes that have no related container (like "smoking") are always
  // required to be explicitly checked — represented by a null container.
  const checkboxRules = [
    { checkboxId: "currently-unemployed", containerId: "employments-container" },
    { checkboxId: "no-income", containerId: "incomes-container" },
    { checkboxId: "no-ex-occupant", containerId: "occupants-container" },
    { checkboxId: "no-pets", containerId: "pets-container" },
  ];

  function containerHasEntries(containerId) {
    if (!containerId) return false;
    const container = document.getElementById(containerId);
    // Each dynamically-added entry is wrapped in an <article>
    return container && container.querySelectorAll("article").length > 0;
  }

  function validateCheckboxes(stepEl) {
    let firstInvalid = null;
    checkboxRules.forEach((rule) => {
      const cb = stepEl.querySelector("#" + rule.checkboxId);
      if (!cb) return; // checkbox not on this step
      const hasData = containerHasEntries(rule.containerId);
      if (!cb.checked && !hasData) {
        cb.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = cb;
      } else {
        cb.removeAttribute("aria-invalid");
      }
    });
    return firstInvalid;
  }

  function validateStep(n) {
    const stepEl = document.querySelector('.form-step[data-step="' + n + '"]');
    if (!stepEl) return true;
    const fields = stepEl.querySelectorAll("[required]");
    let firstInvalid = null;
    fields.forEach((field) => {
      if (!field.value || field.value.trim() === "") {
        field.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.setAttribute("aria-invalid", "false");
      }
    });

    // Also validate checkboxes on this step
    const firstInvalidCb = validateCheckboxes(stepEl);
    if (!firstInvalid) firstInvalid = firstInvalidCb;

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (validateStep(currentStep) && currentStep < TOTAL_STEPS) {
        showStep(currentStep + 1);
      }
    });
  }

  // Initialise wizard
  showStep(1);

  // Character counter for about-me textarea
  const aboutMe = document.getElementById("about-me");
  const aboutMeCount = document.getElementById("about-me-count");
  if (aboutMe && aboutMeCount) {
    aboutMe.addEventListener("input", () => {
      aboutMeCount.textContent = aboutMe.value.length;
    });
  }

  function setupTemplateList(addBtn, container, template, removeBtnSelector) {
    let counter = 0;
    addBtn.addEventListener("click", () => {
      const idx = counter++;
      const clone = template.content.cloneNode(true);
      clone.querySelectorAll("[id]").forEach((el) => {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll("[for]").forEach((el) => {
        el.setAttribute("for", el.getAttribute("for").replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll("[name]").forEach((el) => {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector("article");
      const removeBtn = clone.querySelector(removeBtnSelector);
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          entry?.remove();
        });
      }
      container.appendChild(clone);
    });
  }

  // Add previous address entries
  const btnAddPrevAddress = document.getElementById("btn-add-prev-address");
  const prevAddressesContainer = document.getElementById("prev-addresses-container");
  const prevAddressTemplate = document.getElementById("prev-address-template");
  if (btnAddPrevAddress && prevAddressesContainer && prevAddressTemplate) {
    setupTemplateList(btnAddPrevAddress, prevAddressesContainer, prevAddressTemplate, ".btn-remove-prev-address");
  }

  // Helper: clear aria-invalid on a checkbox when it is toggled
  function clearCheckboxInvalidOnChange(cb) {
    if (cb) {
      cb.addEventListener("change", () => {
        cb.removeAttribute("aria-invalid");
      });
    }
  }

  // currently-unemployed checkbox: disable employment add button and existing entries
  const currentlyUnemployed = document.getElementById("currently-unemployed");
  const btnAddEmployment = document.getElementById("btn-add-employment");
  const employmentsContainer = document.getElementById("employments-container");
  if (currentlyUnemployed && btnAddEmployment) {
    clearCheckboxInvalidOnChange(currentlyUnemployed);
    currentlyUnemployed.addEventListener("change", () => {
      const disabled = currentlyUnemployed.checked;
      btnAddEmployment.disabled = disabled;
      btnAddEmployment.setAttribute("aria-disabled", String(disabled));
      if (employmentsContainer) {
        employmentsContainer.querySelectorAll("fieldset select, fieldset input").forEach((el) => {
          el.disabled = disabled;
          el.setAttribute("aria-disabled", String(disabled));
        });
      }
    });
  }

  // Add employment entries
  const employmentTemplate = document.getElementById("employment-template");
  if (btnAddEmployment && employmentsContainer && employmentTemplate) {
    setupTemplateList(btnAddEmployment, employmentsContainer, employmentTemplate, ".btn-remove-employment");
  }

  // no-income checkbox: disable income fields
  const noIncome = document.getElementById("no-income");
  const btnAddIncome = document.getElementById("btn-add-income");
  const incomesContainer = document.getElementById("incomes-container");
  if (noIncome && btnAddIncome) {
    clearCheckboxInvalidOnChange(noIncome);
    noIncome.addEventListener("change", () => {
      const disabled = noIncome.checked;
      btnAddIncome.disabled = disabled;
      btnAddIncome.setAttribute("aria-disabled", String(disabled));
      if (incomesContainer) {
        incomesContainer.querySelectorAll("fieldset select, fieldset input").forEach((el) => {
          el.disabled = disabled;
          el.setAttribute("aria-disabled", String(disabled));
        });
      }
    });
  }

  // Add income entries
  const incomeTemplate = document.getElementById("income-template");
  if (btnAddIncome && incomesContainer && incomeTemplate) {
    setupTemplateList(btnAddIncome, incomesContainer, incomeTemplate, ".btn-remove-income");
  }

  // no-ex-occupant checkbox: disable occupant fields
  const noExOccupant = document.getElementById("no-ex-occupant");
  const btnAddOccupant = document.getElementById("btn-add-occupant");
  const occupantsContainer = document.getElementById("occupants-container");
  if (noExOccupant && btnAddOccupant && occupantsContainer) {
    clearCheckboxInvalidOnChange(noExOccupant);
    noExOccupant.addEventListener("change", () => {
      const disabled = noExOccupant.checked;
      btnAddOccupant.disabled = disabled;
      btnAddOccupant.setAttribute("aria-disabled", String(disabled));
      occupantsContainer.querySelectorAll("fieldset input").forEach((el) => {
        el.disabled = disabled;
        el.setAttribute("aria-disabled", String(disabled));
      });
    });
  }

  // Add additional occupant entries
  const occupantTemplate = document.getElementById("occupant-template");
  if (btnAddOccupant && occupantsContainer && occupantTemplate) {
    setupTemplateList(btnAddOccupant, occupantsContainer, occupantTemplate, ".btn-remove-occupant");
  }

  // no-pets checkbox: disable pet fields
  const noPets = document.getElementById("no-pets");
  const btnAddPet = document.getElementById("btn-add-pet");
  const petsContainer = document.getElementById("pets-container");
  if (noPets && btnAddPet && petsContainer) {
    clearCheckboxInvalidOnChange(noPets);
    noPets.addEventListener("change", () => {
      const disabled = noPets.checked;
      btnAddPet.disabled = disabled;
      btnAddPet.setAttribute("aria-disabled", String(disabled));
      petsContainer.querySelectorAll("fieldset input").forEach((el) => {
        el.disabled = disabled;
        el.setAttribute("aria-disabled", String(disabled));
      });
    });
  }

  // Add additional pet entries
  const petTemplate = document.getElementById("pet-template");
  if (btnAddPet && petsContainer && petTemplate) {
    setupTemplateList(btnAddPet, petsContainer, petTemplate, ".btn-remove-pet");
  }

  // Form submit: validate all steps
  const form = document.getElementById("rent-application");
  if (form) {
    form.addEventListener("submit", (event) => {
      const requiredFields = form.querySelectorAll("[required]");
      let hasError = false;
      let firstInvalid = null;
      let firstInvalidStep = null;

      requiredFields.forEach((field) => {
        if (!field.value || field.value.trim() === "") {
          field.setAttribute("aria-invalid", "true");
          hasError = true;
          if (!firstInvalid) {
            firstInvalid = field;
            const stepEl = field.closest(".form-step");
            if (stepEl) {
              firstInvalidStep = parseInt(stepEl.getAttribute("data-step"), 10);
            }
          }
        } else {
          field.setAttribute("aria-invalid", "false");
        }
      });

      // Validate all checkboxes across every step
      document.querySelectorAll(".form-step").forEach((stepEl) => {
        const invalidCb = validateCheckboxes(stepEl);
        if (invalidCb) {
          hasError = true;
          if (!firstInvalid) {
            firstInvalid = invalidCb;
            firstInvalidStep = parseInt(stepEl.getAttribute("data-step"), 10);
          }
        }
      });

      if (hasError) {
        event.preventDefault();
        if (firstInvalidStep && firstInvalidStep !== currentStep) {
          showStep(firstInvalidStep);
        }
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });

    // Clear aria-invalid as user corrects fields
    form.addEventListener("input", (event) => {
      const field = event.target;
      if (field.hasAttribute("required") && field.value && field.value.trim() !== "") {
        field.setAttribute("aria-invalid", "false");
      }
    });
  }
});
