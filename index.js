'use strict'

let filmArray;

document.body.onload=makeRequest('https://swapi.co/api/films/', fetchFilms);

function makeRequest(url, callbackFunction) {
    let httpRequest = false;
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    if (!httpRequest) {
        alert('You can not create an instance of XMLHTTP ');
        return false;
    }
    httpRequest.onreadystatechange = function() { callbackFunction(httpRequest); };
    httpRequest.open('GET', url, true);
    httpRequest.send(null);
}

function fetchFilms(httpRequest) {
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            let film=JSON.parse(httpRequest.responseText);
            filmArray=film.results;
            showFilms(filmArray);
        } else {
            console.log('С запросом возникла проблема.');
        }
    }
}

function showFilms(films) {
    let parent = document.getElementById('film_info');

    for (let i = 0; i < films.length; i++) {
        let parent1= document.createElement('ul');
        parent1.onclick=clickFilm;

        let heading=document.createElement('p');
        heading.innerHTML='Information about episode';
        parent1.appendChild(heading);

        let episode = document.createElement('li');
        let episode_id=films[i].episode_id;
        episode.innerHTML = episode_id;
        episode.setAttribute('data-index', episode_id);
        parent1.appendChild(episode);

        let name = document.createElement('li');
        name.innerHTML ='Name:'+ films[i].title;
        name.setAttribute('data-index', episode_id);
        parent1.appendChild(name);

        let description = document.createElement('li');
        description.innerHTML = 'Description:'+films[i].opening_crawl;
        description.setAttribute('data-index', episode_id);
        parent1.appendChild(description);

        let director = document.createElement('li');
        director.innerHTML = 'Director:'+films[i].director;
        director.setAttribute('data-index', episode_id);
        parent1.appendChild(director);

        let date = document.createElement('li');
        let originDate=films[i].created.slice(0,10);
        date.innerHTML = 'Created date:'+originDate;
        date.setAttribute('data-index', episode_id);
        parent1.appendChild(date);

        parent.appendChild(parent1);
    }
}

function clickFilm(event) {
    let clickedFilm = event.target;
    let episod_id = parseInt(clickedFilm.getAttribute('data-index'));
    let result = filmArray.filter(function (item) {
        if (item.episode_id === episod_id) {
            return item;
        }
    });
    needCharacter(result);
}

function needCharacter(array) {
    document.getElementById('character_info').innerHTML = '';
    for (let i = 0; i < array[0].characters.length; i++) {
        makeRequest(array[0].characters[i], fetchCharacter);
    }
}

function fetchCharacter(httpRequest) {
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            let character=JSON.parse(httpRequest.responseText);
            showCharacter(character);
        } else {
            console.log('С запросом возникла проблема.');
        }
    }
}

function showCharacter(person) {
    let mainParent = document.getElementById('character_info');
    let parent = document.createElement('div');

    let character = document.createElement('p');
    character.innerHTML = 'The person of this movie:';
    parent.appendChild(character);

    let name = document.createElement('p');
    name.innerHTML = 'Name:'+''+person.name;
    parent.appendChild(name);

    let gender = document.createElement('p');
    gender.innerHTML = 'Gender:'+''+person.gender;
    parent.appendChild(gender);

    mainParent.appendChild(parent);
}