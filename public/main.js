document.addEventListener('DOMContentLoaded', () => {
  const properties = [
    { id: 1, name: "Sky Dandelions Apartment", location: "Sector 28, Gurgaon", price: 22000, img: "sky_dan.jpg" },
    { id: 2, name: "Wings Tower", location: "Sector 27, Gurgaon", price: 17000, img: "wing_tower.jpg" },
    { id: 3, name: "Wayside Modern House", location: "MG Road, Gurgaon", price: 18000, img: "way_side.jpeg" },
  ];

  let favoriteProperties = [];
  let userDetails = {};

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

      document.querySelectorAll('.favorite-button').forEach(button => {
        button.removeEventListener('click', handleFavoriteButtonClick);
        button.addEventListener('click', handleFavoriteButtonClick);
      });
    }
  }

  function handleFavoriteButtonClick(event) {
    event.stopPropagation();
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

  /*document.getElementById('details-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value;

    userDetails = { name, email, phone };

    // Update user profile page with user details
    document.getElementById('user-profile-info').innerHTML = `
      <p><strong>Name:</strong> ${userDetails.name}</p>
      <p><strong>Email:</strong> ${userDetails.email}</p>
      <p><strong>Phone:</strong> ${userDetails.phone}</p>
    `;

    // Update the home page properties
    displayProperties('#property-container-home', properties);

    // Switch to home page
    showPage('home-page');
  });*/

  function showPage(pageId) {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('search-page').classList.add('hidden');
    document.getElementById('favorites-page').classList.add('hidden');
    document.getElementById('user-page').classList.add('hidden');
    document.getElementById('property-details-page').classList.add('hidden');
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

  // Display the user details form initially
 // showPage('user-details-form');
  showPage('home-page');

  // Function to open the property details page
function openPropertyDetails(property) {
  // Update image, name, location, and price
  document.getElementById('property-detail-img').src = property.img;
  document.getElementById('property-detail-name').innerText = property.name;
  document.getElementById('property-detail-location').innerText = property.location;
  document.getElementById('property-detail-price').innerText = `₹ ${property.price}/month`;

  // Set initial payment details
  const periodBtns = document.querySelectorAll('.period-btn');
  let selectedPeriod = 6;
  updatePaymentDetails(selectedPeriod, property.price);

  periodBtns.forEach(btn => {
      btn.addEventListener('click', function () {
          selectedPeriod = parseInt(this.dataset.period);
          updatePaymentDetails(selectedPeriod, property.price);

          // Update selected button style
          periodBtns.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
          btn.classList.add('bg-blue-600', 'text-white');
      });
  });

  showPage('property-details-page');
}

// Update payment details based on selected period
function updatePaymentDetails(period, price) {
  const totalPrice = period * price;
  document.getElementById('selected-period').innerText = `${period} months`;
  document.getElementById('monthly-payment').innerText = price;
  document.getElementById('total-payment').innerText = totalPrice;
}

// Add click events to property cards to open details
document.querySelectorAll('.property-card').forEach(card => {
  card.addEventListener('click', function () {
      console.log('Card clicked:', this.id); // Debugging
      const propertyId = parseInt(this.id.replace('property-', ''));
      const property = properties.find(p => p.id === propertyId);
      if (property) {
          openPropertyDetails(property);}
  });
});

// Back to property list
document.getElementById('back-to-list-button').addEventListener('click', function () {
  showPage('home-page');
});

});
