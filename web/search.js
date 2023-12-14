
//This section of code fetch the whole distinct composer list from the database and store them into a list.
let composerList = [];
fetch('http://localhost:3000/composerdata')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(composers => {
        composers.forEach(item => {
            composerList.push(item.composer); 
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

//This section of code fetch the whole distinct piece list from the database and store them into a list.
let pieceList = [];
fetch('http://localhost:3000/piecedata')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(pieces => {
        pieces.forEach(item => {
            pieceList.push(item.title);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

//This section of code fetch the whole distinct venue list from the database and store them into a list.
let venueList = [];
fetch('http://localhost:3000/venuedata')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(venues => {
        venues.forEach(item => {
            venueList.push(item.name);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

//This section of code fetch the whole distinct org list from the database and store them into a list.
let orgList = [];
fetch('http://localhost:3000/orgdata')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(orgs => {
        orgs.forEach(item => {
            orgList.push(item.org);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

//This function filters the composers depending on user's input and fill the box by clicking
function searchComposer() {
    let input = document.getElementById('composer').value;

    if (input.trim() === '') {
        document.getElementById('composerList').innerHTML = '';
        return; // Clear the output list
    }

    input = input.toLowerCase();
    let filteredComposers = composerList.filter(composer => composer.toLowerCase().includes(input));

    let composerListDiv = document.getElementById('composerList');
    composerListDiv.innerHTML = ''; // Clear previous results

    filteredComposers.forEach(composer => {
        let div = document.createElement('div');
        div.textContent = composer;
        div.addEventListener('click', function() {
            document.getElementById('composer').value = composer; // Set the input value
            document.getElementById('composerList').innerHTML = ''; // Clear the list after selection
        });
        composerListDiv.appendChild(div);
    });
}

function searchPiece() {
    let input = document.getElementById('piece').value;

    if (input.trim() === '') {
        document.getElementById('pieceList').innerHTML = '';
        return; // Clear the output list
    }

    input = input.toLowerCase();
    let filteredPieces = pieceList.filter(piece => piece.toLowerCase().includes(input));

    let pieceListDiv = document.getElementById('pieceList');
    pieceListDiv.innerHTML = ''; // Clear previous results

    filteredPieces.forEach(piece => {
        let div = document.createElement('div');
        div.textContent = piece;
        div.addEventListener('click', function() {
            document.getElementById('piece').value = piece; // Set the input value
            document.getElementById('pieceList').innerHTML = ''; // Clear the list after selection
        });
        pieceListDiv.appendChild(div);
    });
}

function searchVenue() {
    let input = document.getElementById('location').value;

    if (input.trim() === '') {
        document.getElementById('locationList').innerHTML = '';
        return; // Clear the output list
    }

    input = input.toLowerCase();
    let filteredVenues = venueList.filter(venue => venue.toLowerCase().includes(input));

    let venueListDiv = document.getElementById('locationList');
    venueListDiv.innerHTML = ''; // Clear previous results

    filteredVenues.forEach(venue => {
        let div = document.createElement('div');
        div.textContent = venue;
        div.addEventListener('click', function() {
            document.getElementById('location').value = venue; // Set the input value
            document.getElementById('locationList').innerHTML = ''; // Clear the list after selection
        });
        venueListDiv.appendChild(div);
    });
}

function searchPerformer() {
    let input = document.getElementById('performer').value;

    if (input.trim() === '') {
        document.getElementById('performerList').innerHTML = '';
        return; // Clear the output list
    }

    input = input.toLowerCase();
    let filteredOrgs = orgList.filter(org => org.toLowerCase().includes(input));

    let orgListDiv = document.getElementById('performerList');
    orgListDiv.innerHTML = ''; // Clear previous results

    filteredOrgs.forEach(org => {
        let div = document.createElement('div');
        div.textContent = org;
        div.addEventListener('click', function() {
            document.getElementById('performer').value = org; // Set the input value
            document.getElementById('performerList').innerHTML = ''; // Clear the list after selection
        });
        orgListDiv.appendChild(div);
    });
}


let propertylist = [];
let properties = [];
let index = 0;
async function find_post(kpm) {
    const concert_id = propertylist[kpm][0];
    const title = propertylist[kpm][1];
    const organization = propertylist[kpm][2];
    const details = propertylist[kpm][3];
    const params2 = new URLSearchParams({ concert_id, title, organization, details });
    try {
        const response = await fetch(`http://localhost:3000/search_post?${params2.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length > 0) {

            data.forEach(post => {

                for (const key in post) {
                    return post[key];
                }
            });

        }
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
}
async function add_comment(kpm) {
    const emptyrow = "comment" + kpm;
    const comment = document.getElementById(kpm + "comment").value;
    const rate = document.getElementById(kpm + "rate").value;
    const post_id = find_post(kpm);
    const params3 = new URLSearchParams({ post_id });
    let incre_id;
    try {
        const response = await fetch(`http://localhost:3000/find_incre?${params3.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length > 0) {

            data.forEach(post => {

                for (const key in post) {
                    incre_id = post[key];
                }
            });

        }
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
    const params4 = new URLSearchParams({ comment, rate, post_id, incre_id });
    try {
        const response = await fetch(`http://localhost:3000/insert_comment?${params4.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    catch (error) {
        console.error('Fetch error:', error);
    }

    document.getElementById(emptyrow).innerHTML = "";
}
async function show_detail(kpm) {
    const emptyrow = "comment" + kpm;

    const tbody = document.createElement('form');
    const dataRow = document.createElement('tr');
    const com_input = document.createElement('input');
    com_input.id = kpm + "comment";
    com_input.type = "text";
    const rate_input = document.createElement('input');
    rate_input.id = kpm + "rate";
    rate_input.type = "number";

    const testRow = document.createElement('kp');
    testRow.innerHTML = "<button type='button' onclick=add_comment(" + kpm + ')> Submit comment and rate </button>';
    const label_com = document.createElement('label');
    label_com.textContent = "Comment: ";
    label_com.for = kpm + "comment";
    const label_rate = document.createElement('label');
    label_rate.textContent = "Rate: ";
    label_rate.for = kpm + "rate";
    dataRow.appendChild(label_com);
    dataRow.appendChild(com_input);
    dataRow.appendChild(label_rate);
    dataRow.appendChild(rate_input);
    dataRow.appendChild(testRow);
    tbody.appendChild(dataRow);
    document.getElementById(emptyrow).innerHTML = "";
    document.getElementById(emptyrow).appendChild(tbody);
    var win = window.open("");
    for (let i = 0; i < properties.length; i++) {
        win.document.writeln("<p>" + properties[i] + ": " + propertylist[kpm][i] + "</p>");
    }
    win.document.writeln("<p></p>");
    win.document.writeln("<p>" + "pieces:" + "</p>");
    const concert_id = propertylist[kpm][0];
    const title = propertylist[kpm][1];
    const organization = propertylist[kpm][2];
    const details = propertylist[kpm][3];
    const params2 = new URLSearchParams({ concert_id, title, organization, details });
    try {
        const response = await fetch(`http://localhost:3000/search_piece?${params2.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length > 1) {

            data.forEach(piece => {

                for (const key in piece) {
                    win.document.writeln("<p>  " + key + ": " + piece[key] + "</p>");
                }
            });

        }
        else {
            win.document.writeln("<p>  " + "no piece found" + "</p>");
        }
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
    win.document.writeln("<p></p>");
    win.document.writeln("<p>" + "comments:" + "</p>");
    try {
        const response = await fetch(`http://localhost:3000/search_comment?${params2.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length > 1) {

            data.forEach(comment => {

                for (const key in comment) {
                    win.document.writeln("<p>  " + key + ": " + comment[key] + "</p>");
                }
            });

        }
        else {
            win.document.writeln("<p>  " + "no comment found" + "</p>");
        }
    }
    catch (error) {
        console.error('Fetch error:', error);
    }

}

async function search(event) {
    event.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const composer = document.getElementById('composer').value;
    const piece = document.getElementById('piece').value;
    const location = document.getElementById('location').value;
    const performer = document.getElementById('performer').value;
    propertylist = [];
    properties = [];
    index = 0;

    const params = new URLSearchParams({ startDate, endDate, composer, piece, location, performer });

    try {
        const response = await fetch(`http://localhost:3000/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const searchInfoDiv = document.getElementById('searchInfo');
        searchInfoDiv.innerHTML = '';

        if (data.length > 0) {
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            for (const key in data[0]) {

                const th = document.createElement('th');
                th.textContent = key;
                properties.push(key);
                if (key != "title" && key != "organization" && key != "time") continue;
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);

            data.forEach(concert => {
                const dataRow = document.createElement('tr');
                const rowlist = [];
                for (const key in concert) {

                    const td = document.createElement('td');
                    td.textContent = concert[key];
                    rowlist.push(concert[key]);
                    if (key != "title" && key != "organization" && key != "time") continue;
                    dataRow.appendChild(td);

                }
                const testRow = document.createElement('tk');
                testRow.innerHTML = '<button onclick=show_detail(' + index + ')> Details </button>';
                dataRow.appendChild(testRow);
                tbody.appendChild(dataRow);
                const emptyrow = "comment" + index;
                const commentrow = document.createElement('div');
                commentrow.id = emptyrow;
                tbody.appendChild(commentrow);
                propertylist.push(rowlist);
                index += 1;
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            searchInfoDiv.appendChild(table);

        }
        else {
            searchInfoDiv.textContent = 'No performance is found.';
        }
    }
    catch (error) {
        console.error('Fetch error:', error);
        const searchInfoDiv = document.getElementById('searchInfo');
        searchInfoDiv.textContent = 'Failed to load concert info. Please try again later.';
    }
}
