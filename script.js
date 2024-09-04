document.getElementById('submit-btn').addEventListener('click', function() {
    const promptInput = document.getElementById('prompt').value;
    const recommendationsDiv = document.getElementById('recommendations');
    const clearBtn = document.getElementById('clear-btn');
    recommendationsDiv.innerHTML = '';

    // Dummy data for book recommendations
    const recommendations = [
        { id: 1, title: 'The Great Adventure', author: 'John Doe', description: 'An epic journey through uncharted lands.', cover: './assests/default_book_cover.jpg' },
        { id: 2, title: 'Love in the Time of AI', author: 'Jane Smith', description: 'A romantic tale set in a futuristic world.', cover: 'https://images.isbndb.com/covers/60/34/9781416986034.jpg' },
        { id: 3, title: 'Science Fiction Extravaganza', author: 'James Brown', description: 'A collection of the best sci-fi stories.', cover: 'https://images.isbndb.com/covers/03/09/9780020420309.jpg' },
    ];

    // Display the book recommendations
    recommendations.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <img src="${book.cover}" alt="${book.title} Cover">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p>${book.description}</p>
        `;
        bookCard.addEventListener('click', () => showBookDetail(book));
        recommendationsDiv.appendChild(bookCard);
    });

    // Show the clear button if there are recommendations
    if (recommendationsDiv.children.length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
});

function showBookDetail(book) {
    const bookDetailDiv = document.getElementById('book-detail');
    bookDetailDiv.innerHTML = `
        <span class="close-btn" onclick="closeBookDetail()">×</span>
        <img src="${book.cover}" alt="${book.title} Cover">
        <div class="detail-content">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Publisher:</strong> Example Publisher</p>
            <p><strong>ISBN:</strong> 123-456-789</p>
            <button class="purchase-btn">Purchase</button>
        </div>
    `;
    bookDetailDiv.style.display = 'block';
}

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
