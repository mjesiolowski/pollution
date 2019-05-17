const countryList = ['Poland', 'Germany', 'Spain', 'France']

const app = {
   init() {
      // State
      this.city = []
      this.matchingCountries = []
      this.isRenderCompleted = 0

      // HTML Elements
      this.container = document.querySelector('.app')
      this.input = document.getElementById('countryName')
      this.form = document.querySelector('.form')
      this.autocompleteList = document.querySelector('.autocompleteList')
      this.cityList = document.querySelector('.cityList')

      // Events
      this.form.addEventListener('submit', (e) => this.onSubmitForm(e, this))

      this.input.value = this.getStorageValue()
      this.findMatchingCountry()
   },

   findMatchingCountry() {
      // Compare input with 'countryList' array
      const inputHandler = (e) => {
         this.removeAutocomplete()

         const inputValue = e.target.value.toLowerCase()
         const inputLength = e.target.value.length


         countryList.forEach(country => {
            const searchedChars = country.substr(0, inputLength).toLowerCase()


            if (searchedChars === inputValue && inputLength) {
               this.matchingCountries.push(country)
            }
         })

         this.addCountryToAutocomplete(this.matchingCountries)

         this.addToStorage(this.input.value)
      }

      this.input.addEventListener('input', (e) => inputHandler(e))
      this.input.addEventListener('click', (e) => inputHandler(e))
   },


   addCountryToAutocomplete(names) {
      // Add matching country to DOM and render it
      names.forEach(name => {
         const li = document.createElement('li')
         this.autocompleteList.appendChild(li)
         li.innerHTML = `<p class="autocompleteItem">${name}</p>`
      })

      this.updateInput()
   },

   updateInput() {
      // Set input value when clicking on the autocomplete item
      document.querySelectorAll('p.autocompleteItem').forEach(item => item.addEventListener('click', (e) => {
         this.input.value = item.textContent
         this.removeAutocomplete()
         this.convertCountryToCode(e.target.textContent)
         this.addToStorage(this.input.value)
      }))
   },

   removeAutocomplete() {
      // Delete autocomoplete list
      this.matchingCountries = []
      this.isRenderCompleted = 0
      document.querySelectorAll('ul.autocompleteList>li').forEach(li => li.remove())
   },


   onSubmitForm(e) {
      // Submit handler
      e.preventDefault()
      app.removeAutocomplete()

      const isCountryValid = countryList.find(country => country.toLowerCase() === this.input.value.toLowerCase())

      isCountryValid ? this.convertCountryToCode(isCountryValid) : alert('Invalid country!')
   },

   addToStorage(value) {
      localStorage.setItem('input', value)
   },

   getStorageValue() {
      const value = localStorage.getItem('input')
      return value
   },


   convertCountryToCode(country) {
      switch (country) {
         case 'Poland':
            return this.getPollutedCities('PL')
         case 'Germany':
            return this.getPollutedCities('DE')
         case 'Spain':
            return this.getPollutedCities('ES')
         case 'France':
            return this.getPollutedCities('FR')
      }

   },

   getPollutedCities(countryCode) {
      app.city = []

      const URL = `https://api.openaq.org/v1/latest?country=${countryCode}&parameter=pm10&order_by=measurements[0].value&sort=desc`

      const getData = async () => {

         this.cityList.textContent = 'Loading...'

         try {
            const resp = await fetch(URL, {
               method: "GET",
            })
            const data = await resp.json()

            let cities = []

            data.results.forEach(result => cities.push(result.city))

            cities = [...new Set(cities)].slice(0, 10)

            cities.forEach(city => this.city.push(city))

            this.cityList.textContent = ''
            return this.city
         } catch (error) {
            throw new Error
         }
      }

      getData()
         .then(cities => {
            this.getCitiesDescription(cities)
         })
         .catch(error => this.cityList.textContent = 'Cannot get data. Try again!')
   },

   getCitiesDescription(cities) {

      cities.forEach(city => {
         const URL = `https://en.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=${city}`

         async function getData() {
            try {
               const resp = await fetch(URL, {
                  method: "GET",
               })
               const data = await resp.json()
               const description = data.query.pages[0].extract
               return [city, description]
            } catch (error) {
               throw new Error
            }
         }

         getData()
            .then(data => this.renderCities(...data))
      })

   },

   renderCities(city, desc) {
      const li = document.createElement('li')
      app.cityList.appendChild(li)

         ++this.isRenderCompleted

      li.innerHTML =
         `<p class="cityName">${city}</p>
         <button class="toggler">+</button>
         <p class="cityDesc">${desc? desc : 'Data unavailable'}</p> `

      if (this.isRenderCompleted === 10) this.onToggle()
   },

   onToggle() {
      // Accordion handler
      this.togglers = [...document.querySelectorAll('.toggler')]
      this.togglers.forEach((toggler) => {

         toggler.addEventListener('click', () => {
            toggler.nextElementSibling.classList.toggle('active')
            if (toggler.textContent === '+') toggler.textContent = '-'
            else toggler.textContent = '+'
         })
      })
   }
}

app.init()