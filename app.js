document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_STEPS = document.querySelectorAll('.form-step').length;
  let currentStep = 1;

  const stepIndicator = document.getElementById('step-indicator');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const btnSubmit = document.getElementById('btn-submit');

  function showStep(n, skipPush = false) {
    const pushState = !skipPush;

    document.querySelectorAll('.form-step').forEach((el) => {
      el.hidden = true;
    });
    const target = document.querySelector('.form-step[data-step="' + n + '"]');
    if (target) {
      target.hidden = false;
    }
    if (stepIndicator) {
      stepIndicator.textContent = 'Step ' + n + ' of ' + TOTAL_STEPS;
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

    // Keep the URL query parameter in sync with the visible step
    if (pushState) {
      const url = new URL(window.location);
      url.searchParams.set('step', n);
      history.pushState({ step: n }, '', url);
    }
  }

  // Checkbox validation rules: each entry maps a checkbox id to the id of the
  // container that holds the "additional data" alternative.  When the container
  // has no user-added entries the checkbox MUST be explicitly checked.
  const checkboxRules = [
    { checkboxId: 'currently-unemployed', containerId: 'employments-container' },
    { checkboxId: 'no-income', containerId: 'incomes-container' },
    { checkboxId: 'no-ex-occupant', containerId: 'occupants-container' },
    { checkboxId: 'no-pets', containerId: 'pets-container' },
  ];

  function containerHasEntries(containerId) {
    if (!containerId) return false;
    const container = document.getElementById(containerId);
    // Each dynamically-added entry is wrapped in an <article>
    return container && container.querySelectorAll('article').length > 0;
  }

  function validateCheckboxes(stepEl) {
    let firstInvalid = null;
    checkboxRules.forEach((rule) => {
      const cb = stepEl.querySelector('#' + rule.checkboxId);
      if (!cb) return; // checkbox not on this step
      const hasData = containerHasEntries(rule.containerId);
      if (!cb.checked && !hasData) {
        cb.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = cb;
      } else {
        cb.removeAttribute('aria-invalid');
      }
    });
    return firstInvalid;
  }

  // ---------------------------------------------------------------------------
  // Field-level error hints – shown/hidden via a <small> after the field
  // ---------------------------------------------------------------------------
  function setFieldError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    let hint = field.nextElementSibling;
    if (!hint || !hint.classList.contains('field-error')) {
      hint = document.createElement('small');
      hint.classList.add('field-error');
      hint.style.color = 'var(--pico-del-color)';
      field.insertAdjacentElement('afterend', hint);
    }
    hint.textContent = message;
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    const hint = field.nextElementSibling;
    if (hint && hint.classList.contains('field-error')) {
      hint.remove();
    }
  }

  // ---------------------------------------------------------------------------
  // Single-field validation using the browser Constraint Validation API.
  // Returns the browser's localised error message, or null if valid.
  // ---------------------------------------------------------------------------
  function validateField(field) {
    // Skip disabled fields (e.g. toggled off by "currently unemployed")
    if (field.disabled) return null;

    // Let the browser do the heavy lifting — it already knows about required,
    // type="email", pattern, min/max, maxlength, step, etc.
    if (!field.checkValidity()) {
      return field.validationMessage;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // Validate every visible, non-disabled field on a given step section element.
  // Returns the first invalid element (or null if all valid).
  // ---------------------------------------------------------------------------
  function validateStepFields(stepEl) {
    // Validate all input, select, textarea – not just [required] ones – so
    // we also catch pattern / type mismatches on optional fields.
    const fields = stepEl.querySelectorAll('input, select, textarea');
    let firstInvalid = null;

    fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        setFieldError(field, error);
        if (!firstInvalid) firstInvalid = field;
      } else {
        clearFieldError(field);
      }
    });

    return firstInvalid;
  }

  function validateStep(n) {
    const stepEl = document.querySelector('.form-step[data-step="' + n + '"]');
    if (!stepEl) return true;

    const firstInvalidField = validateStepFields(stepEl);

    // Also validate checkboxes on this step
    const firstInvalidCb = validateCheckboxes(stepEl);

    const firstInvalid = firstInvalidField || firstInvalidCb;
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentStep) && currentStep < TOTAL_STEPS) {
        showStep(currentStep + 1);
      }
    });
  }

  // Restore step from URL query parameter (e.g. ?step=3), default to 1
  const urlStep = parseInt(new URLSearchParams(window.location.search).get('step'), 10);
  const initialStep = urlStep >= 1 && urlStep <= TOTAL_STEPS ? urlStep : 1;
  // Use replaceState for the initial load so we don't create an extra
  // history entry, then render without pushing again.
  const initUrl = new URL(window.location);
  initUrl.searchParams.set('step', initialStep);
  history.replaceState({ step: initialStep }, '', initUrl);
  showStep(initialStep, true);

  // Handle browser back / forward buttons
  window.addEventListener('popstate', (event) => {
    const step = event.state && event.state.step;
    if (step >= 1 && step <= TOTAL_STEPS) {
      showStep(step, true);
    }
  });

  const leaseCommencementDate = document.getElementById('lease-commencement-date');
  const dob = document.getElementById('dob');
  const movein = document.getElementById('movein');

  if (leaseCommencementDate && dob && movein) {
    const now = new Date();

    leaseCommencementDate.min = now.toISOString().split('T')[0];
    const eighteenYearsAgo = new Date(now);
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    dob.max = eighteenYearsAgo.toISOString().split('T')[0];
    movein.max = now.toISOString().split('T')[0];
  }

  // Character counter for about-me textarea
  const aboutMe = document.getElementById('about-me');
  const aboutMeCount = document.getElementById('about-me-count');
  if (aboutMe && aboutMeCount) {
    aboutMe.addEventListener('input', () => {
      aboutMeCount.textContent = aboutMe.value.length;
    });
  }

  function setupTemplateList(addBtn, container, template, removeBtnSelector) {
    let counter = 0;
    addBtn.addEventListener('click', () => {
      const idx = counter++;
      const clone = template.content.cloneNode(true);
      clone.querySelectorAll('*').forEach((el) => {
        for (const attr of el.attributes) {
          if (attr.value.includes('__INDEX__')) {
            el.setAttribute(attr.name, attr.value.replace(/__INDEX__/g, idx));
          }
        }
      });
      const entry = clone.querySelector('article');
      const removeBtn = clone.querySelector(removeBtnSelector);
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          entry?.remove();
        });
      }
      container.appendChild(clone);
      // Clear aria-invalid on the associated checkbox now that an entry exists
      checkboxRules.forEach((rule) => {
        if (rule.containerId === container.id) {
          const cb = document.getElementById(rule.checkboxId);
          if (cb) cb.removeAttribute('aria-invalid');
        }
      });
    });
  }

  // Add previous address entries
  const btnAddPrevAddress = document.getElementById('btn-add-prev-address');
  const prevAddressesContainer = document.getElementById('prev-addresses-container');
  const prevAddressTemplate = document.getElementById('prev-address-template');
  if (btnAddPrevAddress && prevAddressesContainer && prevAddressTemplate) {
    setupTemplateList(btnAddPrevAddress, prevAddressesContainer, prevAddressTemplate, '.btn-remove-prev-address');
  }

  // Helper: clear aria-invalid on a checkbox when it is toggled
  function clearCheckboxInvalidOnChange(cb) {
    if (cb) {
      cb.addEventListener('change', () => {
        cb.removeAttribute('aria-invalid');
      });
    }
  }

  // currently-unemployed checkbox: disable employment add button and existing entries
  const currentlyUnemployed = document.getElementById('currently-unemployed');
  const btnAddEmployment = document.getElementById('btn-add-employment');
  const employmentsContainer = document.getElementById('employments-container');
  if (currentlyUnemployed && btnAddEmployment) {
    clearCheckboxInvalidOnChange(currentlyUnemployed);
    currentlyUnemployed.addEventListener('change', () => {
      const disabled = currentlyUnemployed.checked;
      btnAddEmployment.disabled = disabled;
      btnAddEmployment.setAttribute('aria-disabled', String(disabled));
      if (employmentsContainer) {
        employmentsContainer.querySelectorAll('input, select').forEach((el) => {
          el.disabled = disabled;
          el.setAttribute('aria-disabled', String(disabled));
        });
      }
    });
  }

  // Add employment entries
  const employmentTemplate = document.getElementById('employment-template');
  if (btnAddEmployment && employmentsContainer && employmentTemplate) {
    setupTemplateList(btnAddEmployment, employmentsContainer, employmentTemplate, '.btn-remove-employment');
  }

  // no-income checkbox: disable income fields
  const noIncome = document.getElementById('no-income');
  const btnAddIncome = document.getElementById('btn-add-income');
  const incomesContainer = document.getElementById('incomes-container');
  if (noIncome && btnAddIncome) {
    clearCheckboxInvalidOnChange(noIncome);
    noIncome.addEventListener('change', () => {
      const disabled = noIncome.checked;
      btnAddIncome.disabled = disabled;
      btnAddIncome.setAttribute('aria-disabled', String(disabled));
      if (incomesContainer) {
        incomesContainer.querySelectorAll('fieldset select, fieldset input').forEach((el) => {
          el.disabled = disabled;
          el.setAttribute('aria-disabled', String(disabled));
        });
      }
    });
  }

  // Add income entries
  const incomeTemplate = document.getElementById('income-template');
  if (btnAddIncome && incomesContainer && incomeTemplate) {
    setupTemplateList(btnAddIncome, incomesContainer, incomeTemplate, '.btn-remove-income');
  }

  // no-ex-occupant checkbox: disable occupant fields
  const noExOccupant = document.getElementById('no-ex-occupant');
  const btnAddOccupant = document.getElementById('btn-add-occupant');
  const occupantsContainer = document.getElementById('occupants-container');
  if (noExOccupant && btnAddOccupant && occupantsContainer) {
    clearCheckboxInvalidOnChange(noExOccupant);
    noExOccupant.addEventListener('change', () => {
      const disabled = noExOccupant.checked;
      btnAddOccupant.disabled = disabled;
      btnAddOccupant.setAttribute('aria-disabled', String(disabled));
      occupantsContainer.querySelectorAll('fieldset input').forEach((el) => {
        el.disabled = disabled;
        el.setAttribute('aria-disabled', String(disabled));
      });
    });
  }

  // Add additional occupant entries
  const occupantTemplate = document.getElementById('occupant-template');
  if (btnAddOccupant && occupantsContainer && occupantTemplate) {
    setupTemplateList(btnAddOccupant, occupantsContainer, occupantTemplate, '.btn-remove-occupant');
  }

  // no-pets checkbox: disable pet fields
  const noPets = document.getElementById('no-pets');
  const btnAddPet = document.getElementById('btn-add-pet');
  const petsContainer = document.getElementById('pets-container');
  if (noPets && btnAddPet && petsContainer) {
    clearCheckboxInvalidOnChange(noPets);
    noPets.addEventListener('change', () => {
      const disabled = noPets.checked;
      btnAddPet.disabled = disabled;
      btnAddPet.setAttribute('aria-disabled', String(disabled));
      petsContainer.querySelectorAll('fieldset input').forEach((el) => {
        el.disabled = disabled;
        el.setAttribute('aria-disabled', String(disabled));
      });
    });
  }

  // Add additional pet entries
  const petTemplate = document.getElementById('pet-template');
  if (btnAddPet && petsContainer && petTemplate) {
    setupTemplateList(btnAddPet, petsContainer, petTemplate, '.btn-remove-pet');
  }

  // Form submit: validate every step, reusing the per-step logic
  const form = document.getElementById('rent-application');
  if (form) {
    form.addEventListener('submit', (event) => {
      let firstInvalid = null;
      let firstInvalidStep = null;

      document.querySelectorAll('.form-step').forEach((stepEl) => {
        const stepNum = parseInt(stepEl.getAttribute('data-step'), 10);

        const invalidField = validateStepFields(stepEl);
        const invalidCb = validateCheckboxes(stepEl);
        const invalid = invalidField || invalidCb;

        if (invalid && !firstInvalid) {
          firstInvalid = invalid;
          firstInvalidStep = stepNum;
        }
      });

      if (firstInvalid) {
        event.preventDefault();
        if (firstInvalidStep && firstInvalidStep !== currentStep) {
          showStep(firstInvalidStep);
        }
        firstInvalid.focus();
      }
    });

    // Clear field errors as the user corrects values (input = text/range; change = selects/checkboxes)
    function clearOnCorrect(event) {
      if (!validateField(event.target)) {
        clearFieldError(event.target);
      }
    }
    form.addEventListener('input', clearOnCorrect);
    form.addEventListener('change', clearOnCorrect);
  }
});
