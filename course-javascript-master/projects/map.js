ymaps.ready(init);




function init() {

  // Создание карты.
  this.myMap = new ymaps.Map("map", {

    center: [59.933, 30.35],
    zoom: 16,
    controls: ['zoomControl'],
    behaviors: ['drag']
  });



  this.clusterer = new ymaps.Clusterer({
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });
  this.clusterer.events.add('click', (event) => {
    openModal(event)
  });


  this.myMap.geoObjects.add(this.clusterer);

  addListeners(myMap);

}



function addListeners(myMap) {
  myMap.events.add("click", (event) => openModal(event));
}

function openModal(event) {


  openEmtyModal(event);
}

async function openEmtyModal(event) {
  let posX = event.getSourceEvent().originalEvent.domEvent.originalEvent
    .clientX;

  let posY = event.getSourceEvent().originalEvent.domEvent.originalEvent
    .clientY;

  coords = event.get("coords");
  const objectInfo = await getClickCoords(coords);

  $(".modal").css("display", "block");
  $(".modal").css("left", `${posX}px`);
  $(".modal").css("top", `${posY}px`);


  document.querySelector('.review-list').innerHTML = objectInfo;


  const reviewForm = document.querySelector('[data-role=review-form]');
  reviewForm.dataset.coords = JSON.stringify(coords);


}

function getClickCoords(coords) {
  return new Promise((resolve, reject) => {
    ymaps
      .geocode(coords)
      .then((response) => resolve(response.geoObjects.get(0).getAddressLine()))
      .catch((e) => reject(e));
  });
}



document.body.addEventListener('click', this.onDocumentClick.bind(this));

async function onDocumentClick(e) {
  if (e.target.dataset.role === 'review-add') {
    const reviewForm = document.querySelector('[data-role=review-form]');
    const coords = JSON.parse(reviewForm.dataset.coords);
    const data = {
      coords,
      review: {
        name: document.querySelector('[data-role=review-name]').value,
        place: document.querySelector('[data-role=review-place]').value,
        text: document.querySelector('[data-role=review-text]').value,
      },
    };


    try {
      var serialObj = JSON.stringify(data); //сериализуем его

      localStorage.setItem("coords", serialObj); //запишем его в хранилище по ключу "myKey"

      var returnObj = JSON.parse(localStorage.getItem("coords")) //спарсим его обратно объект

      const reviewItem = document.querySelector('.review-item');


      for (i=0; i<returnObj.length; i++) {
        const div = document.createElement('div');
        div.classList.add('review-items');
        div.innerHTML = `
<div>
  <b>${item.name}</b> [${item.place}]
</div>
<div>${item.text}</div>
`;
        reviewItem.appendChild(div);
      }

      createPlacemark();

    } catch (e) {
      const formError = document.querySelector('.form-error');
      formError.innerText = e.message;
    }
  }
}



function createPlacemark() {


  var placemark = new ymaps.Placemark(coords, {

  }, {
    // Опции.
    // Необходимо указать данный тип макета.
    iconLayout: 'default#imageWithContent',
    // Своё изображение иконки метки.
    iconImageHref: './img/orangemark.png',
    // Размеры метки.
    iconImageSize: [48, 48],
    // Смещение левого верхнего угла иконки относительно
    // её "ножки" (точки привязки).
    iconImageOffset: [-24, -24],
    // Смещение слоя с содержимым относительно слоя с картинкой.
    iconContentOffset: [15, 15],
    // Макет содержимого.

  });

  placemark.events.add('click', (event) => {
    this.openModal(event);
  });

  this.clusterer.add(placemark);

}