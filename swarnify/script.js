console.log('App Initiated ...');
let Songs;
let Albums;
let currentSong = new Audio();
let currentFolder = 'default';
let folder = `songs/${currentFolder}`

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let element = document.createElement('div');
    element.innerHTML = response;
    let albums = element.getElementsByTagName('a');

    let AlbumUl = document.querySelector('.playlist_cards');
    for (let index = 0; index < albums.length; index++) {
        const album = albums[index];

        const albumPath = album.href.split('/songs/')[1];

        if (albumPath) {

            AlbumUl.innerHTML = AlbumUl.innerHTML + `<div data-folder="${albumPath.split('/')[0]}" class="card">
                        <div class="thumbnail">
                            <img src="public/cover.jpg"
                                alt="">
                            <div class="play">
                                <div class="tri"></div>
                            </div>

                        </div>

                        <div class="details">
                            <div class="song" id="song_name">
                                <h3>${albumPath.split('/')[0]}</h3>
                            </div>
                            <div class="artist" id="artist_name">
                                <h4>Songs for you</h4>
                            </div>
                        </div>
                    </div>`
        }
    }

}

async function get_songs(folder) {
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let element = document.createElement('div');
    element.innerHTML = response;
    let links = element.getElementsByTagName('a');
    Songs = [];

    for (let index = 0; index < links.length; index++) {
        const link = links[index];
        if (link.href.endsWith('.mp3')) {
            Songs.push(link.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0]
    songUL.innerHTML = "";
    for (const song of Songs) {
        let song_name = song.split('-')[0];
        let song_artist = (song.split('-')[1]).split('.')[0];
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="music-icon" src="public/music-note-svgrepo-com.svg" alt="music-icon.png">
                            <div class="info">
                                <div>${song_name.replaceAll('%20', ' ')}</div>
                                <div class="artist">${song_artist.replaceAll('%20', ' ')}</div>
                            </div>    
                         </li>`;
    }

    // adding song playing function
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            let song_name = e.querySelector('.info').firstElementChild.innerHTML
            song_name.replaceAll(' ', '%20')
            console.log(song_name)
            let song_artist = e.querySelector('.info').querySelector('.artist').innerHTML
            song_artist.replaceAll(' ', '%20')
            console.log(song_artist)

            // modify this later
            //
            //
            const link = `http://127.0.0.1:3000/${folder}/` + song_name + '-' + song_artist + '.mp3'
            // const link_obj = new Audio(link)
            // const song_duration = link_obj.duration;
            // console.log(song_duration)
            playMusic(link)


        })
    })

}

function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
}



const playMusic = (track) => {
    currentSong.src = track;
    currentSong.play()
    document.querySelector('.song_info').innerHTML = (track.split(`/${folder}/`)[1]).replaceAll('%20', ' ');
    document.querySelector('.song_duration').innerHTML = '00:00 / 00:00';
    let play = document.getElementById('play')
    play.src = 'public/pause-svgrepo-com.svg'

    document.querySelector('.playbar').style.display = 'block';
}




async function main() {
    await get_songs(folder);
    console.log(Songs);
    await displayAlbums();

    let play = document.getElementById('play')
    // Attaching event listeners to previous , play and next
    play.addEventListener('click', togglePlayPause);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevents page scrolling
            togglePlayPause();
        }
    });

    function togglePlayPause() {
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'public/pause-svgrepo-com.svg';
        } else {
            currentSong.pause();
            play.src = 'public/play-svgrepo-com.svg';
        }
    }

    // Making the left appear
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0%';
    })

    document.addEventListener('click', function (event) {
        const sidebar = document.querySelector('.left');
        const hamburger = document.querySelector('.hamburger');

        // This checks if the element that was clicked is inside the sidebar or is the hamburger itself
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        // If the click was NOT inside the sidebar and NOT on the hamburger, hide the sidebar
        if (!isClickInsideSidebar && !isClickOnHamburger) {
            sidebar.style.left = '-100%';
        }
    });


    // for timeupdate
    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.song_duration').innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector('.circle').style.left = `${Math.floor((currentSong.currentTime / currentSong.duration) * 100)}%`
    })

    // Adding seek functionality now 
    document.querySelector('.seekBar').addEventListener('click', (e) => {
        let percent = Math.floor((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        document.querySelector('.circle').style.left = `${percent}%`
        currentSong.currentTime = (percent * currentSong.duration) / 100;
    })


    // Adding previous functionality ...
    document.querySelector('#previous').addEventListener('click', () => {
        console.log('previous clicked !!!');
        let index = Songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {

            playMusic(`http://127.0.0.1:3000/${folder}/` + Songs[index - 1]);
        }
    });

    // Adding next functionality ...
    document.querySelector('#next').addEventListener('click', () => {
        console.log('next clicked !!!');
        let index = Songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        // Fixed: Corrected the condition to check against the array's length
        if ((index + 1) < Songs.length) {
            playMusic(`http://127.0.0.1:3000/${folder}/` + Songs[index + 1]);
        }
    });

    // Volume 
    document.querySelector('.volume_bar').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume < 0.4) {
            document.querySelector('.volume-icon').src = 'public/volume-low.svg';
        }
        else {
            document.querySelector('.volume-icon').src = 'public/volume-high.svg';
        }
    })

    let last_vol = 1
    document.querySelector('.volume-icon').addEventListener('click', () => {
        if (currentSong.volume > 0) {
            document.querySelector('.volume-icon').src = 'public/mute.svg';
            last_vol = currentSong.volume
            currentSong.volume = 0
        }

        else {
            currentSong.volume = last_vol;
            if (currentSong.volume < 0.4) {
                document.querySelector('.volume-icon').src = 'public/volume-low.svg';
            }
            else {
                document.querySelector('.volume-icon').src = 'public/volume-high.svg';
            }
        }

    })

    // Adding the playlist


    // Loading new Playlist when the card is clicked ..
    Array.from(document.getElementsByClassName('card')).forEach(e => {

        e.addEventListener('click', async (item) => {

            currentFolder = item.currentTarget.dataset.folder
            await get_songs(`songs/${currentFolder}`);
            folder = `songs/${currentFolder}`
            console.log(Songs);
        })
    })
}

main();
