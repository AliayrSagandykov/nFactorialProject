$(document).ready(function() {
    // Load books from localStorage or default JSON
    function loadBooks() {
        var books = JSON.parse(localStorage.getItem('books'));
        if (!books) {
            $.getJSON('data/books.json', function(data) {
                localStorage.setItem('books', JSON.stringify(data));
                books = data;
                displayBooks(books);
            });
        } else {
            displayBooks(books);
        }
        return books;
    }

    // Display books on the main page
    function displayBooks(books, filter = '') {
        var bookList = $('#book-list');
        bookList.empty();
        books.filter(book => book.title.toLowerCase().includes(filter.toLowerCase()) || book.author.toLowerCase().includes(filter.toLowerCase())).forEach(function(book) {
            var listItem = $('<li class="list-group-item"></li>');
            var link = $('<a href="#" data-id="' + book.id + '" data-bs-toggle="modal" data-bs-target="#bookModal"></a>')
                .text(book.title + ' by ' + book.author);
            listItem.append(link);
            bookList.append(listItem);
        });
    }

    // Load books and setup search functionality
    var books = loadBooks();
    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        var filter = $('#search-input').val().trim();
        displayBooks(books, filter);
    });

    // Event listener for book links
    $('#book-list').on('click', 'a', function() {
        var bookId = $(this).data('id');
        var book = books.find(b => b.id == bookId);

        if (book) {
            $('#bookModalLabel').text(book.title);
            $('#book-author').text('by ' + book.author);

            var reviewList = $('#review-list');
            reviewList.empty();
            book.reviews.forEach(function(review) {
                var listItem = $('<li class="list-group-item"></li>').text(review);
                reviewList.append(listItem);
            });

            // Handle review form submission
            $('#review-form').off('submit').on('submit', function(event) {
                event.preventDefault();
                var newReview = $(this).find('textarea[name="review"]').val().trim();

                if (newReview) {
                    var listItem = $('<li class="list-group-item"></li>').text(newReview);
                    reviewList.append(listItem);

                    // Update the localStorage with new review
                    book.reviews.push(newReview);
                    localStorage.setItem('books', JSON.stringify(books));
                    $(this).find('textarea[name="review"]').val('');
                } else {
                    alert('Review cannot be empty!');
                }
            });
        }
    });
});
