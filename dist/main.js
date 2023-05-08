var Client;(()=>{"use strict";var e={d:(t,a)=>{for(var n in a)e.o(a,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:a[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{calculateDaysToGo:()=>n,getGeonameData:()=>u,getPixabayImages:()=>v,getWeatherBitData:()=>g,handleSubmit:()=>s,removeTrip:()=>c,renderHTMLTemplate:()=>r,renderSavedTrips:()=>i,saveTrip:()=>d,validateUserInput:()=>a});const a=e=>{for(let t of e)return t.value?(t.classList.remove("error"),!0):(t.classList.add("error"),!1)},n=e=>{const t=new Date(e)-new Date;let a=new Date(t)/864e5;return a=Number(Math.round(a)),a},r=(e,t,a,n,r,i=!0)=>`\n        <div class="card__image">\n            <img src="${e}">\n        </div>\n        <div class="card__body">\n            <div class="card__text">\n                ${i?"<h2>"+t+"</h2>":"<h4>"+t+"</h4>"}\n                <p>Your trip is in ${a} days time</p>\n            </div>\n            <div class="card__weather">\n                <div class="card__weather--icon">\n                    <img src="icons/${n[0].weather.icon}.png" alt="">\n                </div>\n                <div class="card__weather--info">\n                    <p class="temp">\n                        ${n[0].temp}<sup>&#8451;</sup>\n                    </p>\n                    <p>${n[0].weather.description}</p>\n                </div>\n            </div>\n        </div>\n        <div class="card__footer">\n            <button \n                class="btn btn__save" \n                type="button" \n                data-trip-id="${r}" \n                onclick="return ${i?"Client.saveTrip()":"Client.removeTrip()"}">\n                    ${i?'<i class="far fa-heart"></i>':'<i class="far fa-trash-alt"></i>'}\n                    ${i?"Save":"Remove"} Trip\n            </button>\n        </div>\n    `,i=()=>{const e=JSON.parse(localStorage.getItem("savedTrips"));if(null!=e){let t=new DocumentFragment;for(let a of e){const e=document.createElement("div");e.classList.add("card","card--column");const n=Client.calculateDaysToGo(a.departureDate);e.innerHTML=Client.renderHTMLTemplate(a.pixabayData.webformatURL,a.destination,n,a.weatherData,a.id,!1),t.appendChild(e)}savedTripsSection.appendChild(t)}},o=document.getElementById("savedTripsSection");document.addEventListener("DOMContentLoaded",(()=>{Client.renderSavedTrips()}));const s=async e=>{e.preventDefault();const t=document.getElementById("destination"),a=document.getElementById("departureDate"),n=[t,a];if(!Client.validateUserInput(n))return;const r=document.getElementById("tripInfo");let i,o,s;try{if(i=await Client.getGeonameData(t.value),0===i.geonames.length)return;const e=i.geonames[0].lat,n=i.geonames[0].lng,d=Client.calculateDaysToGo(a.value);o=await Client.getWeatherBitData(d,e,n),s=await Client.getPixabayImages("photo","travel",!0,"popular","horizontal",t.value);const c={id:i.geonames[0].geonameId,departureDate:a.value,destination:t.value,leavingDate:a.value,geonameData:{...i.geonames[0]},weatherData:[...o.data],pixabayData:{...s.hits[0]}};m("/save-search-result",c).then((async e=>{let t="images/placeholder.jpg";e.pixabayData.webformatURL&&e.pixabayData.webformatURL;const a=Client.renderHTMLTemplate(e.pixabayData.webformatURL,e.destination,d,e.weatherData,e.id);r.innerHTML=`\n                    <div class="card">\n                        ${a}\n                    </div>\n                `}))}catch(e){console.error(e)}},d=async()=>{let e=await p();const t=await l();y(t.id,e)||m("/save-trip",t).then((async t=>{e=await p(),localStorage.setItem("savedTrips",JSON.stringify(e));const a=Client.calculateDaysToGo(t.departureDate);let n=t.pixabayData.webformatURL;n||(n="images/placeholder.jpg");const r=document.createElement("div");r.classList.add("card","card--column"),r.innerHTML=Client.renderHTMLTemplate(n,t.destination,a,t.weatherData,t.id,!1),o.prepend(r)}))},c=async(e="/remove-saved-trip",t={})=>{const a=event.target.closest(".card");t={id:event.target.dataset.tripId};const n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),r=await n.json();localStorage.setItem("savedTrips",JSON.stringify(r)),a.remove()},l=async()=>{const e=await fetch("/get-search-result");return await e.json()},p=async()=>{const e=await fetch("/get-saved-trips");return await e.json()},m=async(e="",t={})=>(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json(),y=(e,t)=>{if(0!==t.length){for(let a of t)if(a.geonameData.geonameId===e)return!0;return!1}},u=async e=>{const t={BASE_URL:`http://api.geonames.org/searchJSON?formatted=true&q=${e}`},a=await fetch("/geo-name-locations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});return await a.json()},g=async(e,t,a)=>{const n={BASE_URL:`https://api.weatherbit.io/v2.0/forecast/daily?lat=${t}&lon=${a}`},r=await fetch("/weather-bit-forecast",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});return await r.json()},v=async(e,t,a,n,r,i)=>{const o={BASE_URL:`https://pixabay.com/api/?q=${i.split(" ").join("+")}&image_type=${e}&category=${t}&safesearch=${a}&order=${n}&orientation=${r}`},s=await fetch("/pixabay-images",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});return await s.json()};Client=t})();