document.addEventListener("DOMContentLoaded", () => {
    let dayWeek = document.querySelectorAll('.page-nav__day-week');
    let dayNumberElements = document.querySelectorAll('.page-nav__day-number');
    let pageNavDays = document.querySelectorAll('.page-nav__day');
    //возвращаем день недели на основе переданной даты
    function weekDays(date) {
        let weekDaysArr = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return weekDaysArr[date.getDay()];
    }
    //присваиваем число и день недели каждому перебираемому элементу
    dayNumberElements.forEach(function (dayNumberElement, i) {
        let day = new Date();
        day.setDate(day.getDate() + i);
        dayNumberElement.textContent = day.getDate();
        dayWeek[i].textContent = weekDays(day);
        let navDay = dayNumberElement.parentNode;
        //если день недели является выходным, то добавляем класс page-nav__day_weekend к navDay
        if (dayWeek[i].textContent === 'Сб' || dayWeek[i].textContent === 'Вс') {
            navDay.classList.add('page-nav__day_weekend');
        } else {
            navDay.classList.remove('page-nav__day_weekend');
        }
    });
  
    
  
    createRequest('POST', 'https://jscp-diplom.netoserver.ru/', 'event=update', function (response) {
        let films = response.films.result;
        let halls = response.halls.result.filter((openhalls) => openhalls.hall_open !== '0');
        let arrSeances = response.seances.result;

        let main = document.querySelector('main');
        main.innerHTML = '';
        //находим для каждого фильма зал и оставляем только свободные залы(не равные 0)
        for (let film of films) {
            let hallSeances = '';
            halls.forEach(function (hall) {
                let seances = arrSeances.filter((seance) => (seance.seance_filmid == film.film_id) && (seance.seance_hallid == hall.hall_id));
                //отображаем информацию о зале и сеансах
                if (seances.length > 0) {
                    hallSeances += `
                    <div class="movie-seances__hall">
                    <h3 class="movie-seances__hall-title">${hall.hall_name.replace(/(\D)(\d)/, '$1 $2')}</h3>
                    <ul class="movie-seances__list">
                    ${seances.map(seance => `
                    <li class="movie-seances__time-block">
                    <a class="movie-seances__time" href="hall.html" data-film-name ="${film.film_name}" 
                    data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}" 
                    data-hall-name="${hall.hall_name}" data-hall-id="${hall.hall_id}" data-seance-id="${seance.seance_id}" 
                    data-hall-price-standart="${hall.hall_price_standart}"
                    data-hall-price-vip="${hall.hall_price_vip}">${seance.seance_time}</a>
                    </li>
                    `)}
                    </ul>
                    </div>`
                }
            });
            //добавляем HTML код в main
            if (hallSeances) {
                main.innerHTML += `<section class="movie">
                <div class="movie__info">
                <div class="movie__poster">
                <img class="movie__poster-image" alt='${film.film_name}' src="${film.film_poster}">
                </div>
                <div class="movie__description">
                <h2 class="movie__title">${film.film_name}</h2>
                <p class="movie__synopsis">${film.film_description}</p>
                <p class="movie__data">
                <span class="movie__data-duration">${film.film_duration}</span>
                <span class="movie__data-origin">${film.film_origin}</span>
                </p>
                </div>
                </div>  
                ${hallSeances}
                </section>`
            }
        } 
        
    
        let seancesTime = document.querySelectorAll('.movie-seances__time');
        function updateSeances() {
            seancesTime.forEach((time) => {
                let seanceStart = +time.dataset.seanceStart;
                let selectedDay = document.querySelector('.page-nav__day_chosen');
                let selectedDayIndex = Array.from(pageNavDays).iOf(selectedDay);
                let selectedDate = new Date();
                selectedDate.setDate(selectedDate.getDate() + selectedDayIndex);
                //устанавливаем полночь во времени для выбранной даты
                selectedDate.setHours(0, 0, 0);
                //вычисляем время сеанса
                let seanceTime = Math.floor(selectedDate.getTime() / 1000) + seanceStart * 60;
                time.dataset.seanceTimeStamp = seanceTime;
                //вычисляем текущую дату и время и если они больше seanceTime, то происходит переход к выбору мест
                let todayTime = new Date();
                let currentTime = Math.round(todayTime.getTime() / 1000);
                if (currentTime > seanceTime) {
                    time.classList.add("acceptin-button-disabled");
                } else {
                    time.classList.remove("acceptin-button-disabled");
                }
            });
        }
  
        for (let pageNavDay of pageNavDays) {
            pageNavDay.addEventListener('click', function (e) {
                e.preventDefault();
                let selectedDay = document.querySelector('.page-nav__day_chosen');
                if (selectedDay) {
                    selectedDay.classList.remove('page-nav__day_chosen');
                }
                pageNavDay.classList.add('page-nav__day_chosen');
                updateSeances();
            })
        }
  
        updateSeances();
  
        seancesTime.forEach((time) => {
            time.addEventListener('click', function (event) {
                let hallId = event.target.dataset.hallId;
                let selectedHall = halls.find((hall) => hall.hall_id == hallId);
                let selectedSeance = {
                    ...event.target.dataset,
                    hallConfig: selectedHall.hall_config
                };
                let jsonSeance = JSON.stringify(selectedSeance);
                localStorage.setItem('seance-data', jsonSeance);
            });
        });
    });
});