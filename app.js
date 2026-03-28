document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_STEPS = document.querySelectorAll('.form-step').length;
  let currentStep = 1;

  const stepIndicator = document.getElementById('step-indicator');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const btnSubmit = document.getElementById('btn-submit');

  function showStep(n) {
    document.querySelectorAll('.form-step').forEach(el => {
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
  }

  function validateStep(n) {
    const stepEl = document.querySelector('.form-step[data-step="' + n + '"]');
    if (!stepEl) return true;
    const fields = stepEl.querySelectorAll('[required]');
    let firstInvalid = null;
    fields.forEach(field => {
      if (!field.value || field.value.trim() === '') {
        field.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.setAttribute('aria-invalid', 'false');
      }
    });
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

  // Initialise wizard
  showStep(1);

  // Character counter for about-me textarea
  const aboutMe = document.getElementById('about-me');
  const aboutMeCount = document.getElementById('about-me-count');
  if (aboutMe && aboutMeCount) {
    aboutMe.addEventListener('input', () => {
      aboutMeCount.textContent = aboutMe.value.length;
    });
  }

  // no-income checkbox: disable income fields
  const noIncome = document.getElementById('no-income');
  const btnAddIncome = document.getElementById('btn-add-income');
  const incomesContainer = document.getElementById('incomes-container');
  if (noIncome && btnAddIncome) {
    noIncome.addEventListener('change', () => {
      const disabled = noIncome.checked;
      btnAddIncome.disabled = disabled;
      btnAddIncome.setAttribute('aria-disabled', String(disabled));
      if (incomesContainer) {
        incomesContainer.querySelectorAll('fieldset select, fieldset input').forEach(el => {
          el.disabled = disabled;
          el.setAttribute('aria-disabled', String(disabled));
        });
      }
    });
  }

  // no-ex-occupant checkbox: disable occupant name fields
  const noExOccupant = document.getElementById('no-ex-occupant');
  const btnAddOccupant = document.getElementById('btn-add-occupant');
  const occupantsContainer = document.getElementById('occupants-container');
  if (noExOccupant && occupantsContainer) {
    noExOccupant.addEventListener('change', () => {
      const disabled = noExOccupant.checked;
      btnAddOccupant.disabled = disabled;
      btnAddOccupant.setAttribute('aria-disabled', String(disabled));
      occupantsContainer.querySelectorAll('fieldset input').forEach(el => {
        el.disabled = disabled;
        el.setAttribute('aria-disabled', String(disabled));
      });
    });
  }

  // Add additional occupant entries
  let occupantCounter = 0;
  const occupantTemplate = document.getElementById('occupant-template');
  if (btnAddOccupant && occupantsContainer && occupantTemplate) {
    btnAddOccupant.addEventListener('click', () => {
      const idx = occupantCounter++;
      const clone = occupantTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(el => {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(el => {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(el => {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-occupant');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          entry.remove();
        });
      }
      occupantsContainer.appendChild(clone);
    });
  }

  // Employment type: hide company/role/start-date labels for non-employed types
  const employmentType = document.getElementById('employment-type');
  const companyLabel = document.querySelector('label[for="company"]');
  const roleLabel = document.querySelector('label[for="role"]');
  const startDateLabel = document.querySelector('label[for="emp-start-date"]');
  const companyInput = document.getElementById('company');
  const roleInput = document.getElementById('role');
  const startDateInput = document.getElementById('emp-start-date');
  const noEmployerTypes = ['unemployed', 'retired', 'student'];
  if (employmentType && companyLabel && roleLabel && startDateLabel) {
    function toggleEmployerFields() {
      const hideEmployer = noEmployerTypes.indexOf(employmentType.value) !== -1;
      companyLabel.hidden = hideEmployer;
      roleLabel.hidden = hideEmployer;
      startDateLabel.hidden = hideEmployer;
      if (companyInput) companyInput.disabled = hideEmployer;
      if (roleInput) roleInput.disabled = hideEmployer;
      if (startDateInput) startDateInput.disabled = hideEmployer;
    }
    employmentType.addEventListener('change', toggleEmployerFields);
    toggleEmployerFields();
  }

  // Add previous address entries
  let prevAddressCounter = 0;
  const btnAddPrevAddress = document.getElementById('btn-add-prev-address');
  const prevAddressesContainer = document.getElementById('prev-addresses-container');
  const prevAddressTemplate = document.getElementById('prev-address-template');
  if (btnAddPrevAddress && prevAddressesContainer && prevAddressTemplate) {
    btnAddPrevAddress.addEventListener('click', () => {
      const idx = prevAddressCounter++;
      const clone = prevAddressTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(el => {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(el => {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(el => {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-prev-address');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          entry.remove();
        });
      }
      prevAddressesContainer.appendChild(clone);
    });
  }

  // Add previous employment entries
  let prevEmploymentCounter = 0;
  const btnAddPrevEmployment = document.getElementById('btn-add-prev-employment');
  const prevEmploymentsContainer = document.getElementById('prev-employments-container');
  const prevEmploymentTemplate = document.getElementById('prev-employment-template');
  if (btnAddPrevEmployment && prevEmploymentsContainer && prevEmploymentTemplate) {
    btnAddPrevEmployment.addEventListener('click', () => {
      const idx = prevEmploymentCounter++;
      const clone = prevEmploymentTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(el => {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(el => {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(el => {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-prev-employment');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          entry.remove();
        });
      }
      prevEmploymentsContainer.appendChild(clone);
    });
  }

  // Add income entries
  let incomeCounter = 0;
  const incomeTemplate = document.getElementById('income-template');
  if (btnAddIncome && incomesContainer && incomeTemplate) {
    btnAddIncome.addEventListener('click', () => {
      const idx = incomeCounter++;
      const clone = incomeTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(el => {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(el => {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(el => {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-income');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          entry.remove();
        });
      }
      incomesContainer.appendChild(clone);
    });
  }

  // Form submit: validate all steps
  const form = document.getElementById('rent-application');
  if (form) {
    form.addEventListener('submit', event => {
      const requiredFields = form.querySelectorAll('[required]');
      let hasError = false;
      let firstInvalid = null;
      let firstInvalidStep = null;

      requiredFields.forEach(field => {
        if (!field.value || field.value.trim() === '') {
          field.setAttribute('aria-invalid', 'true');
          hasError = true;
          if (!firstInvalid) {
            firstInvalid = field;
            const stepEl = field.closest('.form-step');
            if (stepEl) {
              firstInvalidStep = parseInt(stepEl.getAttribute('data-step'), 10);
            }
          }
        } else {
          field.setAttribute('aria-invalid', 'false');
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
    form.addEventListener('input', event => {
      const field = event.target;
      if (field.hasAttribute('required') && field.value && field.value.trim() !== '') {
        field.setAttribute('aria-invalid', 'false');
      }
    });
  }
});
