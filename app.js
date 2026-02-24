const baseurl = "https://open.er-api.com/v6/latest/";

const dropdown = document.querySelectorAll(".dropdown-section select");
const btn = document.querySelector("form button");
const fromcurrency = document.querySelector("select[name='from']");
const tocurrency = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg");

for(let select of dropdown){
    for(let currcode in countryList){
       let newoption = document.createElement("option");
       newoption.innerText = currcode;
       newoption.value = currcode;
       if(select.name === "from" && currcode === "INR"){
            newoption.selected = "selected";
       } else if(select.name === "to" && currcode === "USD"){
            newoption.selected = "selected";
       }
       select.append(newoption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currcode = element.value;
    let countrycode = countryList[currcode];
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc; 
};

window.addEventListener("load", () => {
    updateFlag(fromcurrency);
    updateFlag(tocurrency);
});

const swapBtn = document.querySelector(".swap-btn");
swapBtn.addEventListener("click", () => {
    let temp = fromcurrency.value;
    fromcurrency.value = tocurrency.value;
    tocurrency.value = temp;
    
    updateFlag(fromcurrency);
    updateFlag(tocurrency);
});

const form = document.querySelector("form");
form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    
    let amount = document.querySelector(".amount input");
    let amtvalue = amount.value;
    
    if(amtvalue === "" || amtvalue < 1){
        amtvalue = 1;
        amount.value = "1";
    }

    try {
        msg.innerText = "Converting...";
        
        const url = `${baseurl}${fromcurrency.value}`;
        console.log("Fetching from:", url);
        console.log("From:", fromcurrency.value, "To:", tocurrency.value);
        
        let response = await fetch(url);
        
        if(!response.ok){
            throw new Error("Failed to fetch exchange rates");
        }
        
        let data = await response.json();
        console.log("API Response:", data);
        
        let rate = data.rates[tocurrency.value];
        console.log("Exchange rate:", rate);
        
        if(!rate){
            throw new Error("Exchange rate not available");
        }
        
        let finalamount = (amtvalue * rate).toFixed(2);
        msg.innerText = `${amtvalue} ${fromcurrency.value} = ${finalamount} ${tocurrency.value}`;
        
        document.getElementById("timestamp").innerText = new Date().toLocaleTimeString();
        
    } catch(error) {
        msg.innerText = "Error: Unable to fetch exchange rates";
        console.error(error);
    }
});
