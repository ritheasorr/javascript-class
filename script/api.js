searchTitle = (title)=> {
    fetch('https://imdb.iamidiotareyoutoo.com/search?q=' + encodeURIComponent(title))
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}