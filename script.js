const sortByCap = document.getElementById('cap')
const sortByPercentage = document.getElementById('percentage')
const tableBody = document.getElementsByTagName('tbody')[0]
const table = document.getElementsByTagName('table')[0]  
const input = document.getElementById('search')
const coinData = []

// fetching data
async function fetchData(){
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false")
    .then(response => {
      if (response.ok) return response.json();
      else throw new Error('Request failed');
    })
    .then(data => {
        data.forEach((element)=>{
            coinData.push(element)
        })
        dataExtractor(data)
    })
    .catch(error => {
      console.error('Promise rejected:', error);
    }); 
}
fetchData();

function dataExtractor(arr) {
    document.getElementsByTagName('tbody')[0].innerText = ''
    for (let i = 0; i < arr.length; i++) {
        let tableRow = document.createElement('tr');
        
        let tableHead = document.createElement('td');
        let icon = document.createElement('img');
        icon.setAttribute('src', arr[i].image);
        
        let iconName = document.createElement('span');
        iconName.innerText = arr[i].name;
        
        tableHead.appendChild(icon);
        tableHead.appendChild(iconName);
        
        // Adding table head into table row
        tableRow.appendChild(tableHead);
        
        // Adding table data into table row
        let symbol = document.createElement('td');
        symbol.innerText = arr[i].symbol;
        tableRow.appendChild(symbol);
        
        let currentPrice = document.createElement('td');
        currentPrice.innerText = `$${Number(arr[i].current_price).toLocaleString()}`;
        tableRow.appendChild(currentPrice);
        
        let totalVolume = document.createElement('td');
        totalVolume.innerText = `$${Number(arr[i].fully_diluted_valuation).toLocaleString()}`;
        tableRow.appendChild(totalVolume);
        
        let pricePercent = document.createElement('td');
        let priceChangePercentage24h = arr[i].price_change_percentage_24h;
        pricePercent.innerText = `${priceChangePercentage24h}%`;
        
        if (priceChangePercentage24h < 0) {
          pricePercent.style.color = 'red';
        }
        else{
            pricePercent.style.color = 'green';
        }
        tableRow.appendChild(pricePercent);
        
        let marketCap = document.createElement('td');
        marketCap.innerText = `Mkt Cap: $${Number(arr[i].market_cap).toLocaleString()}`;
        tableRow.appendChild(marketCap);
        
        // Append table row to table body
        tableBody.appendChild(tableRow);
    }
    // Append table body to table
    table.appendChild(tableBody);
}
// filter all data
function filterData(value){
    let fileredData = coinData.filter((element,key)=>{
        if(element.name === value || element.symbol === value.toLowerCase()) return element;
        else if(value === '') return element;
    })
    dataExtractor(fileredData)
    fileredData = [];
}
// searching functionality added
input.addEventListener('input', () => {
    filterData(event.target.value);
})

// sorting functioality
sortByCap.addEventListener('click',()=>{
    coinData.sort((a,b)=> a.market_cap - b.market_cap)
    dataExtractor(coinData)
})
sortByPercentage.addEventListener('click',()=>{
    coinData.sort((a,b)=> a.price_change_percentage_24h - b.price_change_percentage_24h)
    dataExtractor(coinData)
})

dataExtractor(coinData)





