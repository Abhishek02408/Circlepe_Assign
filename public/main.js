document.addEventListener('DOMContentLoaded', () => {
  const properties = [
    { id: 1, name: "Sky Dandelions Apartment", location: "Sector 28, Gurgaon", price: 22000, img: "sky_dan.jpg" },
    { id: 2, name: "Wings Tower", location: "Sector 27, Gurgaon", price: 17000, img: "wing_tower.jpg" },
    { id: 3, name: "Wayside Modern House", location: "MG Road, Gurgaon", price: 18000, img: "way_side.jpeg" },
  ];

  let favoriteProperties = [];
  let userDetails = {};
  let currentPropertyPrice = 0; // Store current property price for modal reduction

  function updateFavoriteButton(button, isFavorited) {
    const icon = button.querySelector('i');
    if (isFavorited) {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
      button.classList.add('text-red-600');
    } else {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
      button.classList.remove('text-red-600');
    }
  }

  document.getElementById('filter-button').addEventListener('click', () => {
    document.getElementById('filter-popup').classList.remove('hidden');
  });

  // Close filter popup
  document.getElementById('close-filter').addEventListener('click', () => {
    document.getElementById('filter-popup').classList.add('hidden');
  });

  // Apply filters and update search results
  document.getElementById('apply-filters').addEventListener('click', () => {
    const name = document.getElementById('filter-name').value.toLowerCase();
    const location = document.getElementById('filter-location').value.toLowerCase();
    const maxPrice = parseFloat(document.getElementById('filter-price').value);

    const filteredProperties = properties.filter(property => {
      const matchesName = property.name.toLowerCase().includes(name);
      const matchesLocation = property.location.toLowerCase().includes(location);
      const matchesPrice = isNaN(maxPrice) || property.price <= maxPrice;

      return matchesName && matchesLocation && matchesPrice;
    });

    displayProperties('#property-container-search', filteredProperties);
    document.getElementById('filter-popup').classList.add('hidden'); // Close the popup
  });

  function displayProperties(containerId, propertiesToShow) {
    const container = document.querySelector(containerId);
    container.innerHTML = ''; // Clear previous content

    if (propertiesToShow.length === 0) {
      container.innerHTML = '<p class="text-gray-600">No properties available.</p>';
    } else {
      propertiesToShow.forEach(property => {
        const isFavorited = favoriteProperties.some(fav => fav.id === property.id);
        const propertyCard = `
          <div id="property-${property.id}" class="property-card bg-blue-100 p-4 rounded-lg shadow-lg flex items-center space-x-4 card cursor-pointer relative">
            <button class="absolute top-2 right-2 text-black hover:text-red-700 favorite-button" data-id="${property.id}">
              <i class="fa-${isFavorited ? 'solid' : 'regular'} fa-heart"></i>
            </button>
            <img src="${property.img}" alt="${property.name}" class="w-20 h-20 rounded-lg">
            <div class="ml-24">
              <h3 class="text-lg font-semibold">${property.name}</h3>
              <p class="text-sm text-gray-500">${property.location}</p>
              <p class="text-lg font-bold">₹ ${property.price}/month</p>
            </div>
          </div>
        `;
        container.innerHTML += propertyCard;
      });

      // Re-attach click event listener for each property card
      document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', function () {
          const propertyId = parseInt(this.id.replace('property-', ''));
          const property = properties.find(p => p.id === propertyId);
          if (property) {
            openPropertyDetails(property);
          }
        });
      });

      // Re-attach click events for favorite buttons
      document.querySelectorAll('.favorite-button').forEach(button => {
        button.removeEventListener('click', handleFavoriteButtonClick);
        button.addEventListener('click', handleFavoriteButtonClick);
      });
    }
  }

  function handleFavoriteButtonClick(event) {
    event.stopPropagation(); // Prevent card click event from firing
    const button = event.currentTarget;
    const propertyId = parseInt(button.dataset.id);
    const property = properties.find(p => p.id === propertyId);

    if (!property) return;

    const isFavorited = favoriteProperties.some(fav => fav.id === propertyId);

    if (isFavorited) {
      favoriteProperties = favoriteProperties.filter(p => p.id !== propertyId);
      alert(`${property.name} removed from favorites.`);
    } else {
      favoriteProperties.push(property);
      alert(`${property.name} added to favorites.`);
    }

    // Update all pages
    updateFavoriteButton(button, !isFavorited);
    displayFavorites(); // Update favorites page
    displayProperties('#property-container-home', properties); // Update home page
    displayProperties('#property-container-search', filterProperties('')); // Update search page
  }

  function displayFavorites() {
    displayProperties('#property-container-favorites', favoriteProperties);
  }

  function filterProperties(searchTerm) {
    const filteredProperties = properties.filter(property => {
      return property.name.toLowerCase().includes(searchTerm) ||
             property.location.toLowerCase().includes(searchTerm) ||
             property.price.toString().includes(searchTerm);
    });
    return filteredProperties;
  }

  const searchInput = document.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredProperties = filterProperties(searchTerm);
      displayProperties('#property-container-search', filteredProperties);
    });
  }

  function showPage(pageId) {
    const pages = ['home-page', 'search-page', 'favorites-page', 'user-page', 'property-details-page'];
    pages.forEach(page => document.getElementById(page).classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
  }

  document.getElementById('home-btn').addEventListener('click', function() {
    showPage('home-page');
  });

  document.getElementById('search-btn').addEventListener('click', function() {
    showPage('search-page');
  });

  document.getElementById('favorites-btn').addEventListener('click', function() {
    showPage('favorites-page');
  });

  document.getElementById('user-btn').addEventListener('click', function() {
    showPage('user-page');
  });

  document.getElementById('back-button').addEventListener('click', function() {
    showPage('home-page');
  });

  // Function to open the property details page
  function openPropertyDetails(property) {
    // Update image, name, location, and price
    document.getElementById('property-detail-img').src = property.img;
    document.getElementById('property-detail-name').innerText = property.name;
    document.getElementById('property-detail-location').innerText = property.location;
    document.getElementById('property-detail-price').innerText = `₹ ${property.price}/month`;

    // Set initial payment details
    const periodBtns = document.querySelectorAll('.period-btn');
    let selectedPeriod = 6; // Default period
    updatePaymentDetails(selectedPeriod, property.price);

    periodBtns.forEach(btn => {
      btn.classList.remove('bg-blue-600', 'text-white'); // Clear previous selections
      btn.addEventListener('click', function () {
        selectedPeriod = parseInt(this.dataset.period);
        updatePaymentDetails(selectedPeriod, property.price);

        // Update selected button style
        periodBtns.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
        btn.classList.add('bg-blue-600', 'text-white');
      });
    });

    // Store the selected property's price globally for the modal
    currentPropertyPrice = property.price;

    // Switch to the details page
    showPage('property-details-page');
  }

  // Update payment details based on selected period
  function updatePaymentDetails(period, price) {
    const totalPrice = period * price;
    document.getElementById('selected-period').innerText = `${period} months`;
    document.getElementById('monthly-payment').innerText = price;
    document.getElementById('total-payment').innerText = totalPrice;
  }

  // Function to calculate the reduced price (for example, a 10% discount)
  function calculateReducedPrice(price) {
    const discount = 0.10; // 10% discount
    const reducedPrice = price - (price * discount);
    return reducedPrice.toFixed(2); // Round to 2 decimal places
  }

// Open the modal when the Pay with Circle button is clicked
const payButton = document.querySelector('#property-details-page .w-full.mt-4.p-2.bg-blue-600'); // Pay with Circle button
const modal = document.getElementById('payment-modal');
const closeModal = document.getElementById('close-modal');

payButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Ensure the modal only opens without triggering other events

  // Calculate the reduced rent for the selected property
  const reducedPrice = calculateReducedPrice(currentPropertyPrice);

  // Update the modal rent offer with the reduced price
  document.querySelector('.font-bold.text-lg.text-blue-900').innerText = `₹ ${reducedPrice}`;

  // Open the modal
  modal.classList.remove('hidden');
});

// Close the modal when the close button is clicked
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Close modal when clicking outside of the modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});

// Pay with Circle button inside the modal
const payWithCircleButton = document.getElementById('pay-with-circle');

payWithCircleButton.addEventListener('click', () => {
  // Retrieve property name dynamically from the modal or details page
  const propertyName = document.getElementById('property-detail-name').innerText;

  // Open a new page dynamically
  const newPage = window.open('', '_blank');

  // Write the dynamic structure of the new page
  newPage.document.write(`
    <html>
      <head>
        <title>Circle App</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100 flex flex-col justify-center items-center h-screen">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-blue-900 mb-4">Circle App</h1>
          <p class="text-lg text-gray-700 mb-8">Payment is being processed for <strong>${propertyName}</strong>...</p>
        </div>

        <!-- Go Back Button -->
        <button id="go-back-btn" class="text-blue-600 underline mb-4">
          Go Back
        </button>

        <script>
          // Add event listener to the Go Back button
          document.getElementById('go-back-btn').addEventListener('click', () => {
            // Go back to the original page
            window.history.back(); // This will take the user back to the previous page
          });
        </script>
      </body>
    </html>
  `);

  // Close the document writing
  newPage.document.close();
});

// Back to property list
document.getElementById('back-to-list-button').addEventListener('click', function () {
  showPage('home-page');
});
});


 

