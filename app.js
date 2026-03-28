document.addEventListener('DOMContentLoaded', function () {
  const TOTAL_STEPS = document.querySelectorAll('.form-step').length;
  let currentStep = 1;

  const stepIndicator = document.getElementById('step-indicator');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const btnSubmit = document.getElementById('btn-submit');

  function showStep(n) {
    document.querySelectorAll('.form-step').forEach(function (el) {
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
    fields.forEach(function (field) {
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
    btnBack.addEventListener('click', function () {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
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
    aboutMe.addEventListener('input', function () {
      aboutMeCount.textContent = aboutMe.value.length;
    });
  }

  // no-income checkbox: disable income fields
  const noIncome = document.getElementById('no-income');
  const incomeType = document.getElementById('income-type');
  const incomeAmount = document.getElementById('income-amount');
  const incomesContainer = document.getElementById('incomes-container');
  if (noIncome && incomeType && incomeAmount) {
    noIncome.addEventListener('change', function () {
      const disabled = noIncome.checked;
      incomeType.disabled = disabled;
      incomeType.setAttribute('aria-disabled', String(disabled));
      incomeAmount.disabled = disabled;
      incomeAmount.setAttribute('aria-disabled', String(disabled));
      if (incomesContainer) {
        incomesContainer.querySelectorAll('fieldset select, fieldset input').forEach(function (el) {
          el.disabled = disabled;
          el.setAttribute('aria-disabled', String(disabled));
        });
      }
    });
  }

  // no-ex-occupant checkbox: disable occupant name fields
  const noExOccupant = document.getElementById('no-ex-occupant');
  const occupantsContainer = document.getElementById('occupants-container');
  if (noExOccupant && occupantsContainer) {
    noExOccupant.addEventListener('change', function () {
      const disabled = noExOccupant.checked;
      occupantsContainer.querySelectorAll('fieldset input').forEach(function (el) {
        el.disabled = disabled;
        el.setAttribute('aria-disabled', String(disabled));
      });
    });
  }

  // Add additional occupant entries
  let additionalOccupantCounter = 0;
  const btnAddOccupant = document.getElementById('btn-add-occupant');
  const additionalOccupantTemplate = document.getElementById('additional-occupant-template');
  if (btnAddOccupant && occupantsContainer && additionalOccupantTemplate) {
    btnAddOccupant.addEventListener('click', function () {
      const idx = additionalOccupantCounter++;
      const clone = additionalOccupantTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(function (el) {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(function (el) {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(function (el) {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-occupant');
      if (removeBtn) {
        removeBtn.addEventListener('click', function () {
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
    btnAddPrevAddress.addEventListener('click', function () {
      const idx = prevAddressCounter++;
      const clone = prevAddressTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(function (el) {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(function (el) {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(function (el) {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-prev-address');
      if (removeBtn) {
        removeBtn.addEventListener('click', function () {
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
    btnAddPrevEmployment.addEventListener('click', function () {
      const idx = prevEmploymentCounter++;
      const clone = prevEmploymentTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(function (el) {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(function (el) {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(function (el) {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-prev-employment');
      if (removeBtn) {
        removeBtn.addEventListener('click', function () {
          entry.remove();
        });
      }
      prevEmploymentsContainer.appendChild(clone);
    });
  }

  // Add additional income entries
  let additionalIncomeCounter = 0;
  const btnAddIncome = document.getElementById('btn-add-income');
  const additionalIncomeTemplate = document.getElementById('additional-income-template');
  if (btnAddIncome && incomesContainer && additionalIncomeTemplate) {
    btnAddIncome.addEventListener('click', function () {
      const idx = additionalIncomeCounter++;
      const clone = additionalIncomeTemplate.content.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(function (el) {
        el.id = el.id.replace(/__INDEX__/g, idx);
      });
      clone.querySelectorAll('[for]').forEach(function (el) {
        el.setAttribute('for', el.getAttribute('for').replace(/__INDEX__/g, idx));
      });
      clone.querySelectorAll('[name]').forEach(function (el) {
        el.name = el.name.replace(/__INDEX__/g, idx);
      });
      const entry = clone.querySelector('fieldset');
      const removeBtn = clone.querySelector('.btn-remove-income');
      if (removeBtn) {
        removeBtn.addEventListener('click', function () {
          entry.remove();
        });
      }
      incomesContainer.appendChild(clone);
    });
  }

  // Form submit: validate all steps
  const form = document.getElementById('rent-application');
  if (form) {
    form.addEventListener('submit', function (event) {
      const requiredFields = form.querySelectorAll('[required]');
      let hasError = false;
      let firstInvalid = null;
      let firstInvalidStep = null;

      requiredFields.forEach(function (field) {
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
    form.addEventListener('input', function (event) {
      const field = event.target;
      if (field.hasAttribute('required') && field.value && field.value.trim() !== '') {
        field.setAttribute('aria-invalid', 'false');
      }
    });
  }
});
