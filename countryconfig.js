// countryConfig.js

export const countryConfig = {
  NL: {
    genderField: 'gender',
    firstnameField: 'firstname',
    lastnameField: 'lastname',
    emailField: 'email',
    dobDayField: 'dob-day',
    dobMonthField: 'dob-month',
    dobYearField: 'dob-year',
    streetField: 'straat',
    postcodeField: 'postcode',
    houseNumberField: 'huisnummer',
    cityField: 'woonplaats',
    phoneField: 'telefoon'
  },
  UK: {
    genderField: 'gender',
    firstnameField: 'first-name',
    lastnameField: 'last-name',
    emailField: 'email-address',
    dobDayField: 'dob-day',
    dobMonthField: 'dob-month',
    dobYearField: 'dob-year',
    streetField: 'address',
    postcodeField: 'postcode',
    houseNumberField: '', // UK formulier heeft geen apart huisnummer veld
    cityField: 'towncity',
    phoneField: 'phone'
  }
};
