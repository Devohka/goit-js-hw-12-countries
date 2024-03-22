
import { alert, defaultModules, error } from "@pnotify/core";
import * as PNotifyMobile from "@pnotify/mobile";

defaultModules.set(PNotifyMobile, {});

const countryInputRef = document.querySelector(".country__input");
const countryTitleRef = document.querySelector(".country__title");
const countryCapitalRef = document.querySelector(".country-capital");
const countryPopulationRef = document.querySelector(".country-population");
const countryLanguagesList = document.querySelector(".languages__list");
const countryImgRef = document.querySelector(".country__img");
const buttonsListRef = document.querySelector(".buttons__list");

const fetchCountries = _.debounce((searchQuery) => {
  fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
    .then((res) => {
      if (!res.ok) {
        console.log("!res.ok");
      }
      return res.json();
    })
    .then((data) => {
      if (data.length > 10) {
        error({
          text: "Too many matches found. Please enter a more specific query!",
        });
      }
      buttonsListRef.innerHTML = ``;
      if (data.length >= 2 && data.length <= 10) {
        buttonsListRef.style.display = "block";
        data.forEach((country) => {
          buttonsListRef.insertAdjacentHTML(
            "beforeend",
            `<li><button class=country__button>${country.name.common}</button></li>`
          );
        });
        buttonsListRef.addEventListener("click", (e) => {
          if (e.target.nodeName === "LI" || e.target.nodeName === "UL") {
            return;
          }
          buttonsListRef.style.display = "none";
          const findIdx = data.findIndex(
            (country) => country.name.common === e.target.textContent
          );
          countryTitleRef.textContent = data[findIdx].name.common;
          countryCapitalRef.textContent = data[findIdx].capital;
          countryPopulationRef.textContent = data[findIdx].population;
          countryImgRef.innerHTML = `<img src=${data[findIdx].flags.png} alt=${data[findIdx].alt}/>`;

          countryLanguagesList.innerHTML = ``;

          if (Object.keys(data[0].languages).length > 1) {
            let languagesContent = ``;
            Object.values(data[0].languages).forEach((language) => {
              languagesContent += `<li class=languages__item>${language}</li>`;
            });
            countryLanguagesList.innerHTML = ``;
            return (countryLanguagesList.innerHTML = languagesContent);
          }
          countryLanguagesList.insertAdjacentHTML(
            "beforeend",
            `<li class=languages__item>${Object.values(data[0].languages)}</li>`
          );
        });
      }

      if (data.length === 1) {
        countryTitleRef.textContent = data[0].name.common;
        countryCapitalRef.textContent = data[0].capital;
        countryPopulationRef.textContent = data[0].population;
        countryImgRef.innerHTML = `<img src=${data[0].flags.png} alt=${data[0].alt}/>`;

        countryLanguagesList.innerHTML = ``;

        if (Object.keys(data[0].languages).length > 1) {
          let languagesContent = ``;
          Object.values(data[0].languages).forEach((language) => {
            languagesContent += `<li class=languages__item>${language}</li>`;
          });
          countryLanguagesList.innerHTML = ``;
          return (countryLanguagesList.innerHTML = languagesContent);
        }
        countryLanguagesList.insertAdjacentHTML(
          "beforeend",
          `<li class=languages__item>${Object.values(data[0].languages)}</li>`
        );
      }

    })
    .catch((err) => {
      console.log(err);
    });
}, 500);

countryInputRef.addEventListener("input", (evt) => {
  fetchCountries(evt.target.value);
});
