// Function to update the UI with the response data
function updateUIWithBookRecommendations(data) {
    console.log("Recived Data from API.. Now Loading in HTML")
    console.log(data)
    const recommendationsDiv = document.getElementById('recommendations');
    const clearBtn = document.getElementById('clear-btn');
    recommendationsDiv.innerHTML = '';

    const ids = data.ids[0];               // Array of IDs
    const documents = data.documents[0];   // Array of documents
    const metadatas = data.metadatas[0];   // Array of metadata objects

    let htmlContent = '';
    // Iterate over the data and construct the HTML string for each item
    ids.forEach((id, index) => {
        const documentContent = documents[index];
        const metadata = metadatas[index];

        const coverUrl = metadata.cover_url || 'assests/default_book_cover.jpg';
        // Construct the HTML for each book card using template literals
        htmlContent += `
            <div class="book-card" data-index="${index}">
                <img src="${coverUrl}" alt="${metadata.book_title || 'Book Cover'}">
                <p hidden><strong>ID:</strong> ${id}</p>
                <h3>${metadata.book_title}</h3>
                <p>Genres: ${metadata.genres}</p>
                <p><strong>Author:</strong> ${metadata.author || 'Unknown Author'}</p>
                <p><strong>Publisher:</strong> ${metadata.publisher}</p>
            </div>
        `;
    });
    recommendationsDiv.innerHTML = htmlContent;

    // Add click event listeners to each book card after rendering
    document.querySelectorAll('.book-card').forEach((bookCard) => {
        bookCard.addEventListener('click', () => {
            // Retrieve the index from the data attribute
            const index = bookCard.getAttribute('data-index');
            // Pass the relevant book data to the showBookDetail function
            showBookDetail(
                ids[index],
                documents[index],
                metadatas[index]
            );
        });
    });

  // Show the clear button if there are recommendations
    if (recommendationsDiv.children.length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
}

// Function to call the API and update the UI with the response data
async function fetchBookRecommendations() {
  const promptInput = document.getElementById('prompt').value;
  const endpoint = 'https://f52d-35-221-159-155.ngrok-free.app/recommendation';
  const requestBody = {
    query: promptInput,
  };

  try {
    // Making the API call using fetch
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Checking if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parsing the response to JSON
    const data = await response.json();

    // Handle the response data
    updateUIWithBookRecommendations(data);
  } catch (error) {
    console.error('Error fetching book recommendations:', error);
  }


}


document.getElementById('submit-btn').addEventListener('click', fetchBookRecommendations);

//document.getElementById('submit-btn').addEventListener('click', function() {
//    const promptInput = document.getElementById('prompt').value;
//    const recommendationsDiv = document.getElementById('recommendations');
//    const clearBtn = document.getElementById('clear-btn');
//    recommendationsDiv.innerHTML = '';
//
//    // Dummy data for book recommendations
//    const recommendations = [
//        { id: 1, title: 'The Great Adventure', author: 'John Doe', description: 'An epic journey through uncharted lands.', cover: './assests/default_book_cover.jpg' },
//        { id: 2, title: 'Love in the Time of AI', author: 'Jane Smith', description: 'A romantic tale set in a futuristic world.', cover: 'https://images.isbndb.com/covers/60/34/9781416986034.jpg' },
//        { id: 3, title: 'Science Fiction Extravaganza', author: 'James Brown', description: 'A collection of the best sci-fi stories.', cover: 'https://images.isbndb.com/covers/03/09/9780020420309.jpg' },
//    ];
//
//    // Display the book recommendations
//    recommendations.forEach(book => {
//        const bookCard = document.createElement('div');
//        bookCard.className = 'book-card';
//        bookCard.innerHTML = `
//            <img src="${book.cover}" alt="${book.title} Cover">
//            <h3>${book.title}</h3>
//            <p><strong>Author:</strong> ${book.author}</p>
//            <p>${book.description}</p>
//        `;
//        bookCard.addEventListener('click', () => showBookDetail(book));
//        recommendationsDiv.appendChild(bookCard);
//    });
//
//    // Show the clear button if there are recommendations
//    if (recommendationsDiv.children.length > 0) {
//        clearBtn.style.display = 'block';
//    } else {
//        clearBtn.style.display = 'none';
//    }
//});



function closeBookDetail() {
    document.getElementById('book-detail').style.display = 'none';
}

// Clear recommendations functionality
document.getElementById('clear-btn').addEventListener('click', function() {
    document.getElementById('recommendations').innerHTML = '';
    this.style.display = 'none';
});

// Typing animation for the prompt placeholder
function typingAnimation() {
    const placeholderTexts = [
        'Looking for a thrilling adventure...',
        'Searching for a captivating mystery...',
        'Interested in a heartwarming romance...',
        'Excited about a new sci-fi journey...'
    ];
    let index = 0;
    const promptInput = document.getElementById('prompt');
    
    function animatePlaceholder() {
        promptInput.placeholder = placeholderTexts[index];
        index = (index + 1) % placeholderTexts.length;
        setTimeout(animatePlaceholder, 2000); // Change placeholder every 2 seconds
    }

    animatePlaceholder();
}


// Start typing animation on page load
typingAnimation();


function showBookDetail(id,description,metadata) {
    console.log("Show Particular Book")
    const coverUrl = metadata.cover_url || 'assests/default_book_cover.jpg';
    const bookDetailDiv = document.getElementById('book-detail');
    bookDetailDiv.innerHTML = `
        <span class="close-btn" onclick="closeBookDetail()">×</span>
        <img src="${coverUrl}" alt="${metadata.book_title || 'Book Cover'}">
        <div class="detail-content">
            <h2>${metadata.book_title}</h2>
            <p><strong>Author:</strong> ${metadata.author}</p>
            <p><strong>Publisher:</strong> ${metadata.publisher}</p>
            <p><strong>Genres:</strong> ${metadata.genres}</p>
            <p><strong>ISBN:</strong> ${metadata.isbn}</p>
            <p><strong>Description:</strong> ${description}</p>
            <button class="purchase-btn">Purchase</button>
        </div>
    `;
    bookDetailDiv.style.display = 'block';
}