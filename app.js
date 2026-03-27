document.addEventListener('DOMContentLoaded', function () {
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
  var noEmployerTypes = ['unemployed', 'retired', 'student'];
  if (employmentType && companyLabel && roleLabel && startDateLabel) {
    employmentType.addEventListener('change', function () {
      var hideEmployer = noEmployerTypes.indexOf(employmentType.value) !== -1;
      companyLabel.hidden = hideEmployer;
      roleLabel.hidden = hideEmployer;
      startDateLabel.hidden = hideEmployer;
    });
  }

  // Client-side validation + auto-expand details on error
  var form = document.getElementById('rent-application');
  if (form) {
    form.addEventListener('submit', function (event) {
      var requiredFields = form.querySelectorAll('[required]');
      var hasError = false;

      requiredFields.forEach(function (field) {
        if (!field.value || field.value.trim() === '') {
          field.setAttribute('aria-invalid', 'true');
          hasError = true;
        } else {
          field.setAttribute('aria-invalid', 'false');
        }
      });

      if (hasError) {
        event.preventDefault();
        // Open any details section that contains an invalid field
        var invalidFields = form.querySelectorAll('[aria-invalid="true"]');
        invalidFields.forEach(function (field) {
          var details = field.closest('details');
          if (details) {
            details.open = true;
          }
        });
        // Scroll to first error
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
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
