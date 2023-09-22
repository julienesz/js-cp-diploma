function createRequest(method, url, data, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'json';
    //обработчик события onerror при ошибке отправки запроса
    xhr.onerror = function () {
      console.error('Произошла ошибка при отправке запроса');
      callback(null);
    };
    //обработчик события onload при успешном завершении запроса
    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        try {
          let response = xhr.response;
          callback(response);
        } catch (error) {
          console.error('Произошла ошибка: ', error);
          callback(null);
        }
      }
    };
    xhr.send(data);
  }