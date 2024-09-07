//Loading DOM to manage different objects
document.addEventListener('DOMContentLoaded', () => {
  
  //Making Scrolling control smooth
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  //Property Object
  const properties = [
    { id: 1, name: "Sky Dandelions Apartment", location: "Sector 28, Gurgaon", price: 22000, img: "sky_dan.jpg" },
    { id: 2, name: "Wings Tower", location: "Sector 27, Gurgaon", price: 17000, img: "wing_tower.jpg" },
    { id: 3, name: "Wayside Modern House", location: "MG Road, Gurgaon", price: 18000, img: "way_side.jpeg" },
    { id: 4, name: "Sky Dandelions Apartment", location: "Anand Vihar, Delhi", price: 24000, img: "sky_dan.jpg" },
    { id: 5, name: "Wings Tower", location: "Nehru Vihar, Delhi", price: 27000, img: "wing_tower.jpg" },
    { id: 6, name: "Wayside Modern House", location: "MG Road, Delhi", price: 20000, img: "way_side.jpeg" },
  ];

  let favoriteProperties = [];//Stores favorite properties in array
  let userDetails = {};//Stores User Details form
  let currentPropertyPrice = 0; // Store current property price for modal reduction

 //Transition of favorite button
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
            <button class="absolute top-4 left-9 text-red-600 hover:text-red-700 favorite-button rounded-full bg-white " data-id="${property.id}">
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

  //Function of filter button
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
  
    // Update active footer button
  const footerLinks = document.querySelectorAll('.footer a');
  footerLinks.forEach(link => {
    if (link.id === pageId.replace('-page', '-btn')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
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

  document.getElementById('back-to-list-button').addEventListener('click', function() {
    showPage('home-page');
  });

  
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
  const payButton = document.querySelector('#property-details-page .w-full.mt-4.p-2.bg-blue-600');
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
  const payWithCircleButton = document.getElementById('pay-with-circle-btn');

  payWithCircleButton.addEventListener('click', () => {
    // Retrieve property name dynamically from the modal or details page
    const propertyName = document.getElementById('property-detail-name').innerText;

    // Open a new page dynamically
    const newPage = window.open('', '_blank');

    // Write the dynamic structure of the new page
    newPage.document.write(`
      <html>
        <head>
          <title>Circle Payment</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <script src="https://kit.fontawesome.com/a6c22c10c7.js" crossorigin="anonymous"></script>
        </head>
        <body class="bg-gray-100 ">
          <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold text-center mb-4">Circle<Sub>App</h1>
            <h2 class="text-lg font-semibold m-6 text-center bg-blue-100 rounded-lg">Rent at <span class="text-blue-600">Zero</span> Security Deposit</h2>
            <h3 class="text-gray-700">Set-up No Cost EMI in 3 steps<br></h3>
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex flex-col space-y-4">
                <h3 class="text-lg text-blue-600 font-semibold bg-blue-100 rounded-lg">1. Eligibility Check</h3>
                <ul class="list-disc pl-6">
                  <li>Basic Details (PAN & DOB)</li>
                  <li>Work Details (Employment Details)</li>
                </ul>
                <h3 class="text-lg text-blue-600 font-semibold bg-blue-100 rounded-lg">2. Setup AutoPay</h3>
                <ul class="list-disc pl-6">
                  <li>Bank Details (Salary Account Details)</li>
                  <li>Identity Verification (Selfie & Aadhaar KYC)</li>
                </ul>
                <h3 class="text-lg text-blue-600 font-semibold bg-blue-100 rounded-lg">3. Move-In</h3>
              </div>
            </div>
            <div class="flex items-center mb-4">
              <input type="checkbox" id="terms-agreement" class="mr-2">
              <label for="terms-agreement" class="text-sm text-gray-600">
                By clicking this, you agree to our <a href="#" class="text-blue-600 underline">terms and conditions</a> and <a href="#" class="text-blue-600 underline">privacy policy</a>.
              </label>
            </div>
            <div class="text-center">
              <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg">Get Started ></button>
            </div>
            <div class="text-center">
              <button id="go-back-btn" class="mt-4 text-blue-600 no-underline">Go Back</button>
            </div>
          </div>
        </body>
        <script>
          // Add Go Back button functionality to return to the previous page
          document.getElementById('go-back-btn').addEventListener('click', () => {
            window.close(); // Close the current page
          });
        </script>
      </html>
    `);

    // Ensure the new page's document is finished loading
    newPage.document.close();
  });

  // Back to property list
  document.getElementById('back-to-list-button').addEventListener('click', function () {
    showPage('home-page');
  });

  // Initially display properties on home page
  displayProperties('#property-container-home', properties);

  // Show user details form on page load
  document.getElementById('user-details-modal').classList.remove('hidden');

  // Handle user details form submission
  document.getElementById('user-details-form').addEventListener('submit', function(event) {
    event.preventDefault();

    userDetails.name = document.getElementById('user-name').value;
    userDetails.email = document.getElementById('user-email').value;
    userDetails.phone = document.getElementById('user-phone').value;

    // Update the user profile section
    document.getElementById('user-profile-info').innerHTML = `
      <p><strong>Name:</strong> ${userDetails.name}</p>
      <p><strong>Email:</strong> ${userDetails.email}</p>
      <p><strong>Phone:</strong> ${userDetails.phone}</p>
    `;

    // Hide the user details form and show the home page
    document.getElementById('user-details-modal').classList.add('hidden');
    showPage('home-page');
  });

  // Close user details form modal
    document.getElementById('close-user-details').addEventListener('click', () => {
    document.getElementById('user-details-modal').classList.add('hidden');
    showPage('home-page');
  });
});
