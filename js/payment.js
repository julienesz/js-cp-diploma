let paymentInfo = localStorage.getItem('seance-data');
let selectedPlacesSeance = JSON.parse(paymentInfo);

let ticketTitle = document.querySelector('.ticket__title');
ticketTitle.innerText = `${selectedPlacesSeance.filmName}`;
let ticketChairs = document.querySelector('.ticket__chairs');
let ticketHall = document.querySelector('.ticket__hall');
ticketHall.innerText = `${selectedPlacesSeance.hallName.replace(/(\D)(\d)/, '$1 $2')}`;
let seanceDate = new Date(+`${selectedPlacesSeance.seanceTimeStamp * 1000}`);
//форматируем дату и время в объекте seanceDate  в формате год, месяц, день
let fulldate = seanceDate.toLocaleString("ru-RU",
    {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
let ticketStart = document.querySelector('.ticket__start');
ticketStart.innerText = `${selectedPlacesSeance.seanceTime}, ${fulldate}`;

let places = selectedPlacesSeance.selectedPlaces;
//преобразуем каждый элемент массива places в строку, состоящую из значения свойства row и значения свойства place, разделенных символом '/', а затем объединяем все строки в одну, разделяя их запятой и пробелом
let takenChairs = places.map(place => `${place.row}/${place.place}`).join(', ');
ticketChairs.innerText = takenChairs;

let price = 0;
//добавляем значение стоимости к типу места
for (let place of places) {
    if (place.type === 'standart') {
        price += +selectedPlacesSeance.hallPriceStandart;
    } else if (place.type === 'vip') {
        price += +selectedPlacesSeance.hallPriceVip;
    }
}

let ticketCost = document.querySelector('.ticket__cost');
ticketCost.innerText = `${price}`;

//заменяем все вхождения 'selected' на 'taken' в строке selectedPlacesSeance.hallConfig
let newHallConfig = selectedPlacesSeance.hallConfig.replace(/selected/g, "taken");
selectedPlacesSeance.hallConfig = newHallConfig;
selectedPlacesSeance.takenChairs = takenChairs;
localStorage.setItem('seance-data', JSON.stringify(selectedPlacesSeance));
document.querySelector(".acceptin-button").addEventListener("click", (event) => {
    event.preventDefault();
    fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body: `event=sale_add&timestamp=${selectedPlacesSeance.seanceTimeStamp}&hallId=${selectedPlacesSeance.hallId}&seanceId=${selectedPlacesSeance.seanceId}&hallConfiguration=${newHallConfig}`,
    });
});