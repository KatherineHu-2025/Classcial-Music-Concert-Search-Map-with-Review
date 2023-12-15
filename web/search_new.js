/*******************************************************  
Section: Load distinct composers, pieces, venues, performers
*********************************************************/

const PERFORM_ID = 0;
const CONCERT_ID = 1;
const TITLE = 2;
const ORGANIZATION = 3;
const DETAILS = 4;
const URL = 5;
const TIME = 6;
const VENUE_NAME = 7;
const ADDRESS = 8;

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

/*******************************************************  
Section: Filter list depending on user input and allow
user to select based on filtered option
*********************************************************/

/** This function filters the composers depending on user's input and fill the box by clicking. */
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

/** This function filters the pieces depending on user's input and fill the box by clicking. */
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

/** This function filters the venues depending on user's input and fill the box by clicking. */
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

/** This function filters the performers depending on user's input and fill the box by clicking. */
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

/** This function inserts rate and comment to the database and links them with performance*/
async function add_comment(index, propertylist) {
    const commentInputId = index + "comment";
    const rateInputId = index + "rate";
    let comment = document.getElementById(commentInputId).value;
    let rate = parseInt(document.getElementById(rateInputId).value);

    // Validate the input
    if (!comment || rate < 0 || rate > 5) {
        alert('Invalid input. Please enter a valid comment and integer rate between 0 and 5.');
        return;
    }

    try {
        const perform_id = propertylist[index][PERFORM_ID]
        console.log("Property List at Index:", propertylist);
        console.log("Perform ID:", propertylist[index][PERFORM_ID]);
        // Construct the data to be sent
        const postData = {
            content: comment,
            rate: rate,
            perform_id: perform_id
        };
        console.log(postData);
        // Sending the POST request to insert the comment
        const insertResponse = await fetch('http://localhost:3000/insert_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (!insertResponse.ok) {
            throw new Error('Failed to insert comment');
        }

        // Clear the form inputs
        document.getElementById(commentInputId).value = '';
        document.getElementById(rateInputId).value = '';

        alert('Comment added successfully');
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to add comment');
    }
}

/**This function displays the form for inserting comments */
async function show_con(index, properties, propertylist) {
    const emptyRowId = "comment" + index;
    const commentForm = document.getElementById(emptyRowId);
    commentForm.classList.add('commentForm');

    if (commentForm.children.length > 0 && commentForm.style.display !== 'none') {
        // Form is visible, hide it
        commentForm.style.display = 'none';
    } 
    else {
        const form = document.createElement('form');
        const dataRow = document.createElement('div'); // Using div for layout purposes

        // Rate Input
        const rate_input = document.createElement('input');
        rate_input.id = index + "rate";
        rate_input.type = "number";
        rate_input.min = "0";  // Minimum value
        rate_input.max = "5";  // Maximum value
        rate_input.step = 1;
        const label_rate = document.createElement('label');
        label_rate.textContent = "Rate: ";
        label_rate.htmlFor = rate_input.id;

        // Comment Input
        const com_input = document.createElement('input');
        com_input.id = index + "comment";
        com_input.type = "text";
        const label_com = document.createElement('label');
        label_com.textContent = "Comment: ";
        label_com.htmlFor = com_input.id;

        // Submit Button
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', function() {
            add_comment(index, propertylist);
        });

    // Appending elements
        dataRow.appendChild(label_rate);
        dataRow.appendChild(rate_input);
        dataRow.appendChild(label_com);
        dataRow.appendChild(com_input);
        dataRow.appendChild(submitButton);
        form.appendChild(dataRow);

    // Clear existing content and append the form
        commentForm.innerHTML = "";
        commentForm.style.display = 'block';
        commentForm.appendChild(form);
    }
}

/** This function shows the detail of the performance */
async function show_detail(index, propertylist) {
    
    var win = window.open();
    var doc = win.document;

    //Title of the concert
    win.document.writeln("<h1>" + propertylist[index][TITLE] + "</h1>");
    //Organization of the concert
    win.document.writeln("<p>"+propertylist[index][ORGANIZATION] + "</p>");
    win.document.writeln("<p>"+propertylist[index][TIME] + "</p>");
    win.document.writeln("<p>"+propertylist[index][VENUE_NAME] + "</p>");
    win.document.writeln("<p>"+propertylist[index][ADDRESS] + "</p>");
    win.document.writeln("<a href=>"+propertylist[index][URL] + "</a>");

    win.document.writeln("<hr />");

    //Program of the concert
    win.document.writeln("<h2>" + "Program:" + "</h2>");
    let concert_id = propertylist[index][CONCERT_ID];
    console.log(concert_id);

    try {
        const response = await fetch(`http://localhost:3000/search_piece/${concert_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (data.length > 0) {
            data.forEach(piece => {
                for (const key in piece) {
                    //Ignore concert_id
                    if(key=="concert_id")continue;
                    //Write in Composer info
                    if(key=="composer"){
                        let composer="<p class = composer><b> " + piece[key] + "</b></p>";
                        win.document.writeln(composer);
                    }
                    //Write in Title info
                    if(key=="title"){
                        let ptitle="<p class = ptitle><i> " + piece[key] + "</i></p>";
                        win.document.writeln(ptitle);
                    }
                }              
            });
        }
        else {
            win.document.writeln("<p>" + "No piece found." + "</p>");
        }
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
    win.document.writeln("<hr />");

    //Detail Section
    win.document.writeln("<h2> Details </h2>");

    let detail = propertylist[index][DETAILS];
    win.document.writeln("<p class = detail>" + detail + "</p>");

    win.document.writeln("<hr />");

    //Comment Section
    let performance_id = propertylist[index][PERFORM_ID];
    win.document.writeln("<h2> Comments Section </h2>");
    try {
        const response = await fetch(`http://localhost:3000/search_comment/${performance_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (data.length > 0) {
            data.forEach(comment => {
                for (const key in comment) {
                    if(key == "rate"){
                        win.document.writeln("<p class = rate><small> Rate given:" + comment[key] + "</small></p>")
                    }
                    else{
                        win.document.writeln("<p class = comment>  " + comment[key] + "</p>");

                    }
                    
                }
            });
        }
        else {
            win.document.writeln("<p>  " + "No Comment Found. You should send one!" + "</p>");
        }
        win.document.writeln("<hr />");
    }
    catch (error) {
        console.error('Fetch error:', error);
    }

}

/**Search with constraints given by the user. */
async function search(event) {
    event.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const composer = document.getElementById('composer').value;
    const piece = document.getElementById('piece').value;
    const location = document.getElementById('location').value;
    const performer = document.getElementById('performer').value;
    let propertylist = [];
    let properties = [];

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

            data.forEach((concert,index) => {
                const dataRow = document.createElement('tr');
                const rowlist = [];
                for (const key in concert) {

                    const td = document.createElement('td');
                    td.textContent = concert[key];
                    rowlist.push(concert[key]);
                    if (key != "title" && key != "organization" && key != "time") continue;
                    dataRow.appendChild(td);

                }
                propertylist.push(rowlist);

                // Create a 'Details' button
                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Details';
                detailsButton.classList.add('details-button');
                detailsButton.addEventListener('click', function() {
                    show_detail(index, propertylist);
                });

                // Create a 'Comment' button
                const commentButton = document.createElement('button');
                commentButton.textContent = 'Comment';
                commentButton.classList.add('comment-button');
                commentButton.addEventListener('click', function() {
                    show_con(index, properties, propertylist);
                });

                // Create a cell in the row for the buttons
                const actionCell = document.createElement('td');
                actionCell.appendChild(detailsButton);
                actionCell.appendChild(commentButton);
                dataRow.appendChild(actionCell);

                // Append the row to the table body (tbody)
                tbody.appendChild(dataRow);

                // Create and append a div for comments
                const commentRow = document.createElement('div');
                commentRow.id = 'comment' + index;
                tbody.appendChild(commentRow);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            searchInfoDiv.appendChild(table);

            console.log(properties);
            console.log(propertylist);

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
