document.addEventListener('DOMContentLoaded', function () {
  var TOTAL_STEPS = document.querySelectorAll('.form-step').length;
  var currentStep = 1;

  var stepIndicator = document.getElementById('step-indicator');
  var btnBack = document.getElementById('btn-back');
  var btnNext = document.getElementById('btn-next');
  var btnSubmit = document.getElementById('btn-submit');

  function showStep(n) {
    document.querySelectorAll('.form-step').forEach(function (el) {
      el.hidden = true;
    });
    var target = document.querySelector('.form-step[data-step="' + n + '"]');
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
    var stepEl = document.querySelector('.form-step[data-step="' + n + '"]');
    if (!stepEl) return true;
    var fields = stepEl.querySelectorAll('[required]');
    var firstInvalid = null;
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
  var aboutMe = document.getElementById('about-me');
  var aboutMeCount = document.getElementById('about-me-count');
  if (aboutMe && aboutMeCount) {
    aboutMe.addEventListener('input', function () {
      aboutMeCount.textContent = aboutMe.value.length;
    });
  }

  // no-income checkbox: disable income fields
  var noIncome = document.getElementById('no-income');
  var incomeType = document.getElementById('income-type');
  var incomeAmount = document.getElementById('income-amount');
  if (noIncome && incomeType && incomeAmount) {
    noIncome.addEventListener('change', function () {
      var disabled = noIncome.checked;
      incomeType.disabled = disabled;
      incomeType.setAttribute('aria-disabled', String(disabled));
      incomeAmount.disabled = disabled;
      incomeAmount.setAttribute('aria-disabled', String(disabled));
    });
  }

  // no-ex-occupant checkbox: disable occupant name fields
  var noExOccupant = document.getElementById('no-ex-occupant');
  var occupantFirst = document.getElementById('occupant-first-name');
  var occupantLast = document.getElementById('occupant-last-name');
  if (noExOccupant && occupantFirst && occupantLast) {
    noExOccupant.addEventListener('change', function () {
      var disabled = noExOccupant.checked;
      occupantFirst.disabled = disabled;
      occupantFirst.setAttribute('aria-disabled', String(disabled));
      occupantLast.disabled = disabled;
      occupantLast.setAttribute('aria-disabled', String(disabled));
    });
  }

  // Employment type: hide company/role/start-date labels for non-employed types
  var employmentType = document.getElementById('employment-type');
  var companyLabel = document.querySelector('label[for="company"]');
  var roleLabel = document.querySelector('label[for="role"]');
  var startDateLabel = document.querySelector('label[for="emp-start-date"]');
  var companyInput = document.getElementById('company');
  var roleInput = document.getElementById('role');
  var startDateInput = document.getElementById('emp-start-date');
  var noEmployerTypes = ['unemployed', 'retired', 'student'];
  if (employmentType && companyLabel && roleLabel && startDateLabel) {
    function toggleEmployerFields() {
      var hideEmployer = noEmployerTypes.indexOf(employmentType.value) !== -1;
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

  // Form submit: validate all steps
  var form = document.getElementById('rent-application');
  if (form) {
    form.addEventListener('submit', function (event) {
      var requiredFields = form.querySelectorAll('[required]');
      var hasError = false;
      var firstInvalid = null;
      var firstInvalidStep = null;

      requiredFields.forEach(function (field) {
        if (!field.value || field.value.trim() === '') {
          field.setAttribute('aria-invalid', 'true');
          hasError = true;
          if (!firstInvalid) {
            firstInvalid = field;
            var stepEl = field.closest('.form-step');
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
      var field = event.target;
      if (field.hasAttribute('required') && field.value && field.value.trim() !== '') {
        field.setAttribute('aria-invalid', 'false');
      }
    });
  }
});
