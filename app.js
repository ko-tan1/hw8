const url = 'https://rickandmortyapi.com/api/character';
let allCharacters = [];
let visibleCharacters = 10;


fetch(url)
    .then((res) => res.json())
    .then(data => {
        allCharacters = data.results;
        draw()
    })
    .catch((error) => {
        console.log(JSON.stringify(error));
    });


function draw() {
    const container = document.querySelector("#characters");

    container.innerHTML = `
            ${allCharacters.slice(0, visibleCharacters).map(character => `
                <div class="character">
                    <p>${character.name}</p>
                    <img src=${character.image} />
                    <p>${character.species}</p>
                    <p>${character.location.name}</p>
                    ${character.episode.map(episode => `<a href=${episode}>${episode}</a>`).join("<br/>")}
                    <button onclick="deleteCharacter(${character.id})">Delete</button>
                </div>
            `).join("")}
        `
}


let sortDateOrder = 'asc';
function sortByDate() {
    sortDateOrder = sortDateOrder === 'asc' ? 'desc' : 'asc'
    allCharacters = allCharacters.sort((a, b) => {
        const aCreated = new Date(a.created).getTime();
        const bCreated = new Date(b.created).getTime();
        return sortDateOrder === 'asc' ? aCreated - bCreated : bCreated - aCreated
    })
    draw()
}

let sortEpisodesOrder = 'asc';
function sortByEpisodes() {
    sortEpisodesOrder = sortEpisodesOrder === 'asc' ? 'desc' : 'asc'
    allCharacters = allCharacters.sort((a, b) => {
        const aCreated = new Date(a.created).getTime();
        const bCreated = new Date(b.created).getTime();

        const aEpisodes = a.episode.length;
        const bEpisodes = b.episode.length;


        const epCmp = sortEpisodesOrder === 'asc' ? aEpisodes - bEpisodes : bEpisodes - aEpisodes;
        if (epCmp === 0) {
            return sortEpisodesOrder === 'asc' ? aCreated - bCreated : bCreated - aCreated
        }

        return epCmp
    })
    draw()
}

function deleteCharacter(charId) {
    allCharacters = allCharacters.filter(({ id }) => id !== Number(charId))
    draw()
}


function showMoreCharactersOnScroll() {
    if (!allCharacters.length) {
        return;
    }

    const container = document.querySelector('.character:last-child');
    const position = container.getBoundingClientRect();

    if (position.bottom <= window.innerHeight) {
        visibleCharacters = 20;
        draw()
        window.removeEventListener('scroll', showMoreCharactersOnScroll)
    }
};

window.addEventListener('scroll', showMoreCharactersOnScroll)