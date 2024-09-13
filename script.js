// Sleep function using Promise and setTimeout
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to display and update the error message
const errorMessage = document.getElementById('error-message');
function showError(message) {
    errorMessage.textContent = message; // Update the message
    errorMessage.style.display = 'block'; // Show the error message
}

// Function to hide the error message
function hideError() {
    errorMessage.style.display = 'none'; // Hide the error message
}

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
                <p><strong>Genres:</strong> ${metadata.genres || ' - '}</p>
                <p><strong>Author:</strong> ${metadata.author || 'Unknown Author'}</p>
                <p><strong>Publisher:</strong> ${metadata.publisher || ' - '}</p>
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

  console.log("Submit request..")
  const promptInput = document.getElementById('prompt').value.trim();
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementById('error-message');

  if (promptInput === '') {
      showError('Please enter a prompt.'); // Display error message
  }else if (promptInput.length < 15) {
      showError('The prompt must be at least 5 characters long.'); // Update error message with different condition
  }
  else {
      hideError(); // Hide the error message if input is valid
      loader.style.display = 'block';

      const endpoint = 'https://9a24-34-73-121-45.ngrok-free.app/recommendation';
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
        showError("Unable to connect to the server. Please check your network connection or try again later."); // Display error message
        console.error('Error fetching book recommendations:', error);
      }finally {
           loader.style.display = 'none';
      }
  }

}

document.getElementById('submit-btn').addEventListener('click', fetchBookRecommendations);

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
        <div class="display-card">
        <img src="${coverUrl}" alt="${metadata.book_title || 'Book Cover'}">
        <div class="detail-content">
            <h2>${metadata.book_title}</h2>
            <p><strong>Author:</strong> ${metadata.author || ' Unknown Author '}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Genres:</strong> ${metadata.genres || ' - '}</p>
            <p><strong>Publisher:</strong> ${metadata.publisher || ' - '}</p>
            <p><strong>ISBN:</strong> ${metadata.isbn || ' - '}</p>
            <button class="purchase-btn">Purchase</button>
        </div>
        </div>
    `;
    bookDetailDiv.style.display = 'block';
}
