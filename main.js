const books = [
        {
          image: "images/book1.jpg",
          title: "Practical AI Agents",
          author: "Alex Johnson",
          price: 45.99,
          rating: 4.5,
          category: "Agentic AI",
          type: "new_arrival",
          description: "This book provides a hands-on guide to building and deploying intelligent AI agents, covering everything from foundational principles to advanced real-world applications."
        },
        {
          image: "images/book2.jpg",
          title: "Web Application Security",
          author: "Sarah Chen",
          price: 59.99,
          rating: 4.8,
          category: "Cyber Security",
          type: "new_arrival",
          description: "A comprehensive guide to identifying and mitigating vulnerabilities in modern web applications, focusing on best practices for secure coding, authentication, and data handling."
        },
        {
          image: "images/book3.jpg",
          title: "The Art of UI Design",
          author: "Mike Thompson",
          price: 35.50,
          rating: 4.6,
          category: "UI/UX",
          type: "new_arrival",
          description: "Explore the principles of creating intuitive and visually appealing user interfaces, with practical examples and case studies on typography, color theory, and layout design."
        },
        {
          image: "images/book4.jpg",
          title: "The Ultimate Guide to UX",
          author: "Emily White",
          price: 49.00,
          rating: 4.9,
          category: "UI/UX",
          type: "best_seller",
          description: "Journey into the world of User Experience, learning how to conduct user research, create wireframes, and design products that meet user needs and business goals."
        },
        {
          image: "images/book5.jpg",
          title: "IT Fundamentals for Beginners",
          author: "David Lee",
          price: 29.99,
          rating: 4.2,
          category: "Information Technology",
          type: "best_seller",
          description: "This book covers the core concepts of information technology, from hardware and software basics to networking, databases, and system administration, making it perfect for newcomers."
        },
        {
          image: "images/book6.jpg",
          title: "Cryptography for Developers",
          author: "Mark Evans",
          price: 65.75,
          rating: 4.7,
          category: "Cyber Security",
          type: "best_seller",
          description: "Learn how to implement strong cryptographic algorithms and secure data in your applications. This book focuses on practical, code-based examples for developers."
        },
        {
          image: "images/book7.jpg",
          title: "Advanced Prompt Engineering",
          author: "Laura Adams",
          price: 55.00,
          rating: 4.4,
          category: "Agentic AI",
          type: "best_seller",
          description: "This book explores techniques for crafting effective prompts to guide large language models and other AI systems, unlocking their full potential."
        },
        {
          image: "images/book8.jpg",
          title: "Network & Systems Administration",
          author: "Chris Green",
          price: 42.50,
          rating: 4.1,
          category: "Information Technology",
          type: "new_arrival",
          description: "An in-depth guide to managing and maintaining computer networks and systems, including troubleshooting, security best practices, and performance optimization."
        }
      ];

      const newArrivalContainer = document.getElementById('new-arrival-books');
      const bestSellersContainer = document.getElementById('best-sellers-books');
      const bookTableBody = document.getElementById('book-list-table-body');
      const categoryButtons = document.querySelectorAll('.category-btn');
      const searchInput = document.getElementById('search-input');
      const previousPageBtn = document.getElementById('previous-page-btn');
      const nextPageBtn = document.getElementById('next-page-btn');
      const paginationInfo = document.getElementById('pagination-info');

      // Pagination variables
      let currentPage = 1;
      const booksPerPage = 5;
      let currentFilteredBooks = books;

      // Modal elements
      const bookDetailsModal = new bootstrap.Modal(document.getElementById('bookDetailsModal'));
      const modalImage = document.getElementById('modal-image');
      const modalTitle = document.getElementById('modal-title');
      const modalAuthor = document.getElementById('modal-author');
      const modalPrice = document.getElementById('modal-price');
      const modalDescription = document.getElementById('modal-description');


      // Function to render star ratings
      function getStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
          stars += '<i class="bi bi-star-fill"></i>';
        }
        if (hasHalfStar) {
          stars += '<i class="bi bi-star-half"></i>';
        }
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
          stars += '<i class="bi bi-star"></i>';
        }
        return stars;
      }

      // Function to generate and render book cards
      function renderBooks(booksToRender) {
        newArrivalContainer.innerHTML = '';
        bestSellersContainer.innerHTML = '';
        
        const newArrivals = booksToRender.filter(book => book.type === 'new_arrival');
        const bestSellers = booksToRender.filter(book => book.type === 'best_seller');
      
        function generateBookCard(book, index) {
          return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div class="book-card">
                <img src="${book.image}" alt="${book.title} book cover" class="img-fluid book-cover">
                <div class="book-card-body">
                  <div>
                    <h5>${book.title}</h5>
                    <p class="text-muted mb-0">by ${book.author}</p>
                    <p class="fw-bold mb-1">$${book.price.toFixed(2)}</p>
                    <div class="rating mb-2">
                      ${getStarRating(book.rating)}
                      <small>(${book.rating})</small>
                    </div>
                  </div>
                  <button class="btn btn-simple w-100 view-details-btn" data-bs-toggle="modal" data-bs-target="#bookDetailsModal" data-book-index="${books.indexOf(book)}">View Details</button>
                </div>
              </div>
            </div>
          `;
        }
      
        newArrivals.forEach((book, index) => {
          newArrivalContainer.innerHTML += generateBookCard(book, index);
        });
      
        bestSellers.forEach((book, index) => {
          bestSellersContainer.innerHTML += generateBookCard(book, index);
        });
      }

      function renderTablePage(page) {
        bookTableBody.innerHTML = '';
        const startIndex = (page - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const booksOnPage = currentFilteredBooks.slice(startIndex, endIndex);

        booksOnPage.forEach(book => {
          bookTableBody.innerHTML += `
            <tr>
              <td>
                <img src="${book.image}" alt="${book.title}" class="img-fluid me-2">
                ${book.title}
              </td>
              <td>${book.author}</td>
              <td>${book.description}</td>
              <td>$${book.price.toFixed(2)}</td>
            </tr>
          `;
        });
        updatePaginationControls();
      }

      function updatePaginationControls() {
        const totalPages = Math.ceil(currentFilteredBooks.length / booksPerPage);
        paginationInfo.querySelector('a').innerText = `Page ${currentPage} of ${totalPages}`;
        
        previousPageBtn.classList.toggle('disabled', currentPage === 1);
        nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
      }
      
      previousPageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
          currentPage--;
          renderTablePage(currentPage);
        }
      });
      
      nextPageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const totalPages = Math.ceil(currentFilteredBooks.length / booksPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderTablePage(currentPage);
        }
      });

      // Event listener for modal trigger button
      document.addEventListener('click', function(event) {
        if (event.target.matches('.view-details-btn')) {
          const bookIndex = event.target.getAttribute('data-book-index');
          const book = books[bookIndex];

          modalImage.src = book.image;
          modalTitle.innerText = book.title;
          modalAuthor.innerText = `by ${book.author}`;
          modalPrice.innerText = `$${book.price.toFixed(2)}`;
          modalDescription.innerText = book.description;
        }
      });

      // Initial render of all books and first table page
      renderBooks(books);
      renderTablePage(currentPage);

      // Event listener for category buttons
      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.category;
          currentFilteredBooks = books.filter(book => book.category === category);
          currentPage = 1;
          renderBooks(currentFilteredBooks);
          renderTablePage(currentPage);

          // Remove any previous 'Show All' buttons
          document.querySelectorAll('.show-all-btn').forEach(btn => btn.remove());

          // Add a "Show All" button to clear the filter
          const showAllBtn = document.createElement('button');
          showAllBtn.className = 'btn btn-simple mt-4 show-all-btn';
          showAllBtn.innerText = `Show All Books (${category})`;
          showAllBtn.addEventListener('click', () => {
            currentFilteredBooks = books;
            currentPage = 1;
            renderBooks(books);
            renderTablePage(currentPage);
            showAllBtn.remove();
          });
          document.querySelector('.container-fluid').insertBefore(showAllBtn, newArrivalContainer.parentElement);
        });
      });

      // Event listener for search input
      searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        currentFilteredBooks = books.filter(book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
        );
        currentPage = 1;
        renderBooks(currentFilteredBooks);
        renderTablePage(currentPage);
      });