ymaps.ready(init);




function init() {



  this.clusterer = new ymaps.Clusterer({
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });
  this.clusterer.events.add('click', (event) => {

    openModal(event);

  });

  // Создание карты.
  this.myMap = new ymaps.Map("map", {

    center: [59.933, 30.35],
    zoom: 16,
    controls: ['zoomControl'],
    behaviors: ['drag']
  });


  this.myMap.geoObjects.add(this.clusterer);

  addListeners(myMap);
  buildPlacemark();

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

function onDocumentClick(e) {
  if (e.target.dataset.role === 'review-add') {
    debugger;
    const reviewForm = document.querySelector('[data-role=review-form]');


    if (typeof this.placemarkCoords !== 'undefined') {
      if (coords !== this.placemarkCoords) {
        coords = this.placemarkCoords;
        let coord = coords.toString();
        let data = {
                     name: document.querySelector('[data-role=review-name]').value,
            place: document.querySelector('[data-role=review-place]').value,
            text: document.querySelector('[data-role=review-text]').value,
          };
        

        this.addTodo(coord, data);
      }
    }
    else {
      coords = JSON.parse(reviewForm.dataset.coords);
      let data = {
        coords,
        review: {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value,
        },
      };
      var coord = coords.toString();
      var serialObj = JSON.stringify(data); //сериализуем его
      localStorage.setItem(coord, serialObj); //запишем его в хранилище по ключу "coord"
      var returnObj = JSON.parse(localStorage.getItem(coord));
      console.log(returnObj)

    }



    try {

      createPlacemark(coords);
      closeModal();

    } catch (e) {
      const formError = document.querySelector('.form-error');
      formError.innerText = e.message;
    }

  }
}




function createPlacemark(a) {

  if (typeof this.placemarkCoords !== 'undefined') {
    if (a !== this.placemarkCoords) {
      console.log(this.placemarkCoords)
      a = this.placemarkCoords;
      this.placemark = new ymaps.Placemark(a);
    }
  } else {
    this.placemark = new ymaps.Placemark(a);
    console.log(this.placemarkCoords)
  }


  this.placemark.events.add('click',  function (event) {

    this.placemarkCoords =  placemark.geometry.getCoordinates();
    createInnerHTML(placemarkCoords); 



  });



  this.clusterer.add(this.placemark);



}




function closeModal() {

  $(".modal").css("display", "none");

}




function createInnerHTML(coords) {
  debugger
  document.querySelector('.review-item').innerHTML = '';

  let coord = coords.toString();
  try {

    for (let i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var split = key.split(',');

      var float = split.map(function (item) {
        return parseFloat(item);
      });

      if (JSON.stringify(float) === JSON.stringify(coords)) {
        var returnObj = JSON.parse(localStorage.getItem(coord));
        console.log(returnObj);
        
        for (var item in returnObj.review) {
          const div = document.createElement('div');
          div.classList.add('review-items');
          div.innerHTML = `
          <div>
        <b>${returnObj.review[name]}</b> ${returnObj.review[place]}
            </div>
            <div>${returnObj.review[text]}</div>
    `;
          document.querySelector('.review-item').appendChild(div);
        }
      }
    }

  } catch (event) {
    const formError = document.querySelector('.form-error');
    formError.innerText = event.message;
  }



}

function buildPlacemark() {

  for (let i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var split = key.split(',');

    var float = split.map(function (item) {
      return parseFloat(item);
    });

    createPlacemark(float);

  }
}



document.querySelector('.review-remove').addEventListener("click", (event) => {

  localStorage.clear(event);
})




function addTodo(key, value) {

let list = [];

  try {
    list = JSON.parse(localStorage.getItem(key))
  } catch (e) {
    console.error(e)
  }

  list.push(value);
  localStorage.setItem(key, JSON.stringify(list));

}
