//получаем данные из локального хранилища с ключом seance-data И сохраняем их в переменной
let seanceData = localStorage.getItem('seance-data');
let selectedSeance = JSON.parse(seanceData);
localStorage.setItem('seance-data', JSON.stringify(selectedSeance));


let confWrapper = document.querySelector('.conf-step__wrapper');
let movieTitle = document.querySelector('.buying__info-title');
//изменяем текст элемента на значение свойства filmName объекта selectedSeance(и всех остальных)
movieTitle.innerText = `${selectedSeance.filmName}`;
let movieSeanceStart = document.querySelector('.buying__info-start');
movieSeanceStart.innerText = `Начало сеанса:  ${selectedSeance.seanceTime}`;
let hallName = document.querySelector('.buying__info-hall');
//регулярное выражение для расклейки слов в hallName
hallName.innerText = `${selectedSeance.hallName.replace(/(\D)(\d)/, '$1 $2')}`;
let acceptinButton = document.querySelector('.acceptin-button');
let priceStandart = document.querySelector('.price-standart');
priceStandart.innerText = `${selectedSeance.hallPriceStandart}`;
let priceVip = document.querySelector('.price-vip');
priceVip.innerText = `${selectedSeance.hallPriceVip}`;

//ajax запрос методом POST на url с параметрами
createRequest('POST', 'https://jscp-diplom.netoserver.ru/', `event=get_hallConfig&timestamp=${selectedSeance.seanceTimeStamp}&hallId=${selectedSeance.hallId}&seanceId=${selectedSeance.seanceId}`, function (response) {
    if (response) {
        selectedSeance.hallConfig = response;
    } else {
        console.log('Нет данных');
    }

    confWrapper.innerHTML = selectedSeance.hallConfig;
    let chairs = document.querySelectorAll('.conf-step__chair');
    let arrSelectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
    //если место свободное, то можно бронировать
    if (arrSelectedChairs.length > 0) {
        acceptinButton.removeAttribute('disabled');
    } else {
        acceptinButton.setAttribute('disabled', 'disabled');
    }
    //добавление обработчика события click
    chairs.forEach((chair) => {
        chair.addEventListener('click', function (event) {
            //если нажатый элемент занят, то функция прекращает свое выполнение
            if (event.target.classList.contains('conf-step__chair_taken')) {
                return;
            }
            event.target.classList.toggle('conf-step__chair_selected');
            arrSelectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
            if (arrSelectedChairs.length > 0) {
                acceptinButton.removeAttribute('disabled');
            } else {
                acceptinButton.setAttribute('disabled', 'disabled');
            }

        });
    })


    acceptinButton.addEventListener('click', function () {
        let selectedChairs = [];
        arrSelectedChairs.forEach((selectedChair) => {
            let rowElement = selectedChair.closest('.conf-step__row');
            let rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement) + 1;
            let placeIndex = Array.from(rowElement.children).indexOf(selectedChair) + 1;
            let typePlace;
            //если выбранное место имеет класс conf-step__chair_standart, то присваивается значение стандартный
            if (selectedChair.classList.contains('conf-step__chair_standart')) {
                typePlace = 'standart';
                //иначе - значение вип
            } else if (selectedChair.classList.contains('conf-step__chair_vip')) {
                typePlace = 'vip';
            }
            selectedChairs.push({ row: rowIndex, place: placeIndex, type: typePlace });
        });

        selectedSeance.hallConfig = confWrapper.innerHTML;
        selectedSeance.selectedPlaces = selectedChairs;
        //перенаправление пользователя на страницу оплаты
        window.location.href = "payment.html";
    });

});