 function generateQR() {
    let ticketInfo = localStorage.getItem('seance-data');
    let selectedTickets = JSON.parse(ticketInfo);
    
    //обновляем текстовое содержимое элементов HTML на странице
    let ticketTitle = document.querySelector('.ticket__title');
    ticketTitle.innerText = selectedTickets.filmName;
    let ticketChairs = document.querySelector('.ticket__chairs');
    ticketChairs.innerText = selectedTickets.takenChairs;
    let ticketHall = document.querySelector('.ticket__hall');
    ticketHall.innerText = selectedTickets.hallName.replace(/(\D)(\d)/, '$1 $2');
    let ticketStart = document.querySelector('.ticket__start');
    ticketStart.innerText = selectedTickets.seanceTime;
  
  
    let seanceDate = new Date(+`${selectedTickets.seanceTimeStamp * 1000}`);
  
    let ticketDate = seanceDate.toLocaleString("ru-RU",
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    
    //форматируем строку seanceInfo с информацией о фильме, зале, месте и времени
    let seanceInfo = `Фильм: ${selectedTickets.filmName},Зал: ${selectedTickets.hallName},Ряд/Место: ${selectedTickets.takenChairs},Время: ${ticketDate}`
    const qrcode = QRCreator(seanceInfo, { image: "SVG" });
    //создаем QR код
    document.querySelector('.ticket__info-qr').append(qrcode.result);
}

document.addEventListener("DOMContentLoaded", generateQR);
