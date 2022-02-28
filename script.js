// Add a button when showing lyrics to take you back to the top.
// clear song from input and be able to go back to previous list of songs
// display a loading image during api call

const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')

const apiURL = 'https://api.lyrics.ovh'

async function searchSongs(term) {
  const search = await fetch(`${apiURL}/suggest/${term}`)
  const data = await search.json()

  showData(data)
}

// Show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <ul class='songs'>
        ${data.data
          .map(
            (song) => `<li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class='btn' data-artist='${song.artist.name}' data-songtitle='${song.title}'>Get Lyrics</button>
        </li>`
          )
          .join('')}
    </ul>
    `

  if (data.prev || data.next) {
    more.innerHTML = `
        ${
          data.prev
            ? `<button class='btn' onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ''
        }
        ${
          data.next
            ? `<button class='btn' onclick="getMoreSongs('${data.next}')">Next</button>`
            : ''
        }
        `
  } else {
    more.innerHTML = ''
  }
}

// Get previous and next songs
async function getMoreSongs(url) {
  const search = await fetch('https://cors-anywhere.herokuapp.com/' + url)
  const data = await search.json()
  showData(data)
}

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault()

  const searchTerm = search.value.trim()
  if (!searchTerm) {
    alert('Please type in a search term')
  } else {
    searchSongs(searchTerm)
  }
})

// Get lyrics button click

result.addEventListener('click', (e) => {
  const clickedEl = e.target
  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist')
    const song = clickedEl.getAttribute('data-songtitle')
    getLyrics(artist, song)
  }
})

// Get lyrics for song

async function getLyrics(artist, songTitle) {
  try {
    const search = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    const data = await search.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>`
    more.innerHTML = ''
  } catch (error) {
    result.innerHTML = '<h2 style="text-align: center">Lyrics not found.</h2>'
    more.innerHTML = ''
  }
}
