# pollutionApp

# About the app:
The pollutionApp gets a country* name as input value, renders names of 10 most polluted cities in the given country and shows a short description of the city.

To see a description click '+' button below city names.

*allowed countries: Paland, Germany, Spain, France

# API:
- openaq.org - to render the most polluted cities
- mediawiki.org - to get descriptions

# Code details:
The code consists of the following functions:
- init() - initializes variables
- findMatchingCountry() - compares input value with allowed countries
- addCountryToAutocomplete() - adds matching country to DOM and renders it
- updateInput() - sets input value when clicking on the autocomplete item
- removeAutocomplete() - deletes autocomoplete list
- onSubmitForm() - submit form handler
- addToStorage(), getStorageValue() - storage handlers
- convertCountryToCode - converts country name to its code
- getPollutedCities(), getCitiesDescription() - fetch data from external APIs
- renderCities() - renders cities and descriptions
- onToggle() - accordion handler

# Technology:
vanilla JS


