
import { defaultModules, error } from "@pnotify/core";
import * as PNotifyMobile from "@pnotify/mobile";

defaultModules.set(PNotifyMobile, {});

const countryInputEl = document.querySelector(".country__input");
const countryTitleEl = document.querySelector(".country__title");
const countryCapitalEl = document.querySelector(".country-capital");
const countryPopulationEl = document.querySelector(".country-population");
const countryLanguagesListEl = document.querySelector(".languages__list");
const countryImgEl = document.querySelector(".country__img");
const buttonsListEl = document.querySelector(".buttons__list");


const fetchCountries = _.debounce((searchQuery) => {
  fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
    .then((res) => {
      if (res !== true) {
        console.log("res !== true");
      }
      return res.json();
    })
    .then((data) => {
      const dataLang = data[0].languages;
      if (data.length > 10) {
        error({
          text: "Too many matches found. Please enter a more specific query!",
        });
      }
      buttonsListEl.innerHTML = ``;
      if (data.length >= 2 && data.length <= 10) {
        buttonsListEl.style.display = "block";
        data.forEach((country) => {
          buttonsListEl.insertAdjacentHTML(
            "beforeend",
            `<li><button class=country__button>${country.name.common}</button></li>`
          );
        });
        buttonsListEl.addEventListener("click", (e) => {
          if (e.target.nodeName === "LI" || e.target.nodeName === "UL") {
            return;
          }
          buttonsListEl.style.display = "none";
          const index = data.findIndex(
            (country) => country.name.common === e.target.textContent
          );
          countryTitleEl.textContent = data[index].name.common;
          countryCapitalEl.textContent = data[index].capital;
          countryPopulationEl.textContent = data[index].population;
          countryImgEl.innerHTML = `<img src=${data[index].flags.png} alt=${data[index].alt}/>`;

          countryLanguagesListEl.innerHTML = ``;

          if (Object.keys(dataLang).length > 1) {
            let languagesContent = ``;
            Object.values(dataLang).forEach((language) => {
              languagesContent += `<li class=languages__item>${language}</li>`;
            });
            countryLanguagesListEl.innerHTML = ``;
            return (countryLanguagesListEl.innerHTML = languagesContent);
          }
          countryLanguagesListEl.insertAdjacentHTML(
            "beforeend",
            `<li class=languages__item>${Object.values(dataLang)}</li>`
          );
        });
      }

      if (data.length === 1) {
        countryTitleEl.textContent = data[0].name.common;
        countryCapitalEl.textContent = data[0].capital;
        countryPopulationEl.textContent = data[0].population;
        countryImgEl.innerHTML = `<img src=${data[0].flags.png} alt=${data[0].alt}/>`;

        countryLanguagesListEl.innerHTML = ``;

        if (Object.keys(data[0].languages).length > 1) {
          let languagesContent = ``;
          Object.values(data[0].languages).forEach((language) => {
            languagesContent += `<li class=languages__item>${language}</li>`;
          });
          countryLanguagesListEl.innerHTML = ``;
          return (countryLanguagesListEl.innerHTML = languagesContent);
        }
        countryLanguagesListEl.insertAdjacentHTML(
          "beforeend",
          `<li class=languages__item>${Object.values(data[0].languages)}</li>`
        );
      }

    })
    .catch((err) => {
      console.log(err);
    });
}, 1000);



countryInputEl.addEventListener("input", (element) => {
  fetchCountries(element.target.value);
});
