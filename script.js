document.addEventListener('DOMContentLoaded', () => {
  // Mock flight data with prices in INR
  const flights = [
    {
      id: 1,
      from: 'New York',
      to: 'London',
      date: '2024-01-20',
      duration: '7h 30m',
      stops: 0,
      price: 49999,
      seats: generateSeats(),
      meals: getMealOptions()
    },
    {
      id: 2,
      from: 'New York',
      to: 'London',
      date: '2024-01-20',
      duration: '8h 15m',
      stops: 1,
      price: 41999,
      seats: generateSeats(),
      meals: getMealOptions()
    },
    {
      id: 3,
      from: 'New York',
      to: 'London',
      date: '2024-01-20',
      duration: '9h',
      stops: 2,
      price: 37499,
      seats: generateSeats(),
      meals: getMealOptions()
    },
    {
      id: 4,
      from: 'New York',
      to: 'London',
      date: '2024-01-20',
      duration: '7h 45m',
      stops: 0,
      price: 54999,
      seats: generateSeats(),
      meals: getMealOptions()
    },
    {
      id: 5,
      from: 'New York',
      to: 'London',
      date: '2024-01-20',
      duration: '8h 30m',
      stops: 1,
      price: 44999,
      seats: generateSeats(),
      meals: getMealOptions()
    }
  ];

  function getMealOptions() {
    return [
      { id: 1, name: 'Vegetarian', price: 1200 },
      { id: 2, name: 'Non-Vegetarian', price: 1500 },
      { id: 3, name: 'Vegan', price: 1200 },
      { id: 4, name: 'Kosher', price: 1800 },
      { id: 5, name: 'Halal', price: 1500 }
    ];
  }

  function generateSeats() {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const cols = ['1', '2', '3', '4', '5', '6'];
    
    rows.forEach(row => {
      cols.forEach(col => {
        seats.push({
          id: `${row}${col}`,
          row: row,
          col: col,
          type: row <= 'C' ? 'business' : 'economy',
          status: Math.random() > 0.3 ? 'available' : 'occupied',
          price: row <= 'C' ? 2500 : 0 // Additional price for business class
        });
      });
    });
    return seats;
  }

  // Initialize date picker
  const departureDateInput = document.getElementById('departureDate');
  
  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  departureDateInput.min = today;

  // Search form submission
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    searchFlights();
  });

  function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  function searchFlights() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departureDate = document.getElementById('departureDate').value;
    const passengers = document.getElementById('passengers').value;

    const filteredFlights = flights.filter(flight => 
      flight.from.toLowerCase().includes(from.toLowerCase()) &&
      flight.to.toLowerCase().includes(to.toLowerCase())
    );

    filteredFlights.sort((a, b) => a.price - b.price);
    displayFlights(filteredFlights);
  }

  function displayFlights(flights) {
    const flightList = document.getElementById('flightList');
    flightList.innerHTML = '';

    if (flights.length === 0) {
      flightList.innerHTML = `
        <div class="no-flights">
          <h3>No flights found matching your criteria</h3>
          <p>Please try different dates or destinations</p>
        </div>
      `;
      return;
    }

    flights.forEach(flight => {
      const flightCard = document.createElement('div');
      flightCard.className = 'flight-card';
      flightCard.innerHTML = `
        <div class="flight-header">
          <h3>${flight.from} → ${flight.to}</h3>
          <span class="price">${formatPrice(flight.price)}</span>
        </div>
        <div class="flight-details">
          <div>
            <strong>Duration:</strong> ${flight.duration}
          </div>
          <div>
            <strong>Stops:</strong> ${flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
          </div>
        </div>
        <div class="stops-indicator">
          <div class="stop-point"></div>
          ${flight.stops > 0 ? Array(flight.stops).fill('<div class="stop-line"></div><div class="stop-point"></div>').join('') : ''}
          <div class="stop-line"></div>
          <div class="stop-point"></div>
        </div>
        <div class="seat-selection">
          <h4>Select Seat</h4>
          <div class="seat-map">
            <div class="seat-legend">
              <div class="legend-item">
                <div class="seat available business"></div>
                <span>Business Class</span>
              </div>
              <div class="legend-item">
                <div class="seat available economy"></div>
                <span>Economy Class</span>
              </div>
              <div class="legend-item">
                <div class="seat occupied"></div>
                <span>Occupied</span>
              </div>
            </div>
            <div class="seat-grid">
              ${flight.seats.map(seat => `
                <div class="seat ${seat.status} ${seat.type}" 
                     data-seat="${seat.id}" 
                     data-price="${seat.price}"
                     title="${seat.status === 'available' ? 
                       `${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)} Class - Seat ${seat.id}${
                         seat.price ? ' (+' + formatPrice(seat.price) + ')' : ''
                       }` : 
                       'Seat Occupied'}">
                  ${seat.id}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <h4>Meal Options</h4>
        <div class="meal-options">
          ${flight.meals.map(meal => `
            <label class="meal-option">
              <input type="radio" name="meal-${flight.id}" value="${meal.id}">
              ${meal.name} (+${formatPrice(meal.price)})
            </label>
          `).join('')}
        </div>
        <div class="price-summary" id="price-summary-${flight.id}">
          <div class="base-price">Base Fare: ${formatPrice(flight.price)}</div>
          <div class="extras"></div>
          <div class="total"></div>
        </div>
        <button class="search-btn" onclick="bookFlight(${flight.id})">Book Now</button>
      `;
      flightList.appendChild(flightCard);
    });
  }

  // Initialize seat selection with price calculation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
      const flightCard = e.target.closest('.flight-card');
      const flightId = flightCard.querySelector('.meal-options input[type="radio"]').name.split('-')[1];
      const allSeats = flightCard.querySelectorAll('.seat.selected');
      allSeats.forEach(seat => seat.classList.remove('selected'));
      e.target.classList.add('selected');
      
      updatePriceSummary(flightId);
    }
  });

  // Update price when meal selection changes
  document.addEventListener('change', (e) => {
    if (e.target.type === 'radio' && e.target.name.startsWith('meal-')) {
      const flightId = e.target.name.split('-')[1];
      updatePriceSummary(flightId);
    }
  });

  function updatePriceSummary(flightId) {
    const flight = flights.find(f => f.id === parseInt(flightId));
    const flightCard = document.querySelector(`#price-summary-${flightId}`).closest('.flight-card');
    const selectedSeat = flightCard.querySelector('.seat.selected');
    const selectedMeal = flightCard.querySelector('input[type="radio"]:checked');
    
    let totalPrice = flight.price;
    const extras = [];

    if (selectedSeat) {
      const seatPrice = parseInt(selectedSeat.dataset.price);
      if (seatPrice > 0) {
        totalPrice += seatPrice;
        extras.push(`Seat ${selectedSeat.dataset.seat}: +${formatPrice(seatPrice)}`);
      }
    }

    if (selectedMeal) {
      const meal = flight.meals.find(m => m.id === parseInt(selectedMeal.value));
      totalPrice += meal.price;
      extras.push(`${meal.name} Meal: +${formatPrice(meal.price)}`);
    }

    const summaryElement = document.getElementById(`price-summary-${flightId}`);
    summaryElement.querySelector('.extras').innerHTML = extras.length ? 
      `<div class="extras-title">Extra Charges:</div>${extras.map(extra => `<div>${extra}</div>`).join('')}` : '';
    summaryElement.querySelector('.total').innerHTML = `<strong>Total: ${formatPrice(totalPrice)}</strong>`;
  }

  window.bookFlight = function(flightId) {
    const flightCard = document.querySelector(`#price-summary-${flightId}`).closest('.flight-card');
    const selectedSeat = flightCard.querySelector('.seat.selected');
    const selectedMeal = flightCard.querySelector(`input[name="meal-${flightId}"]:checked`);
    
    if (!selectedSeat) {
      alert('Please select a seat');
      return;
    }
    
    if (!selectedMeal) {
      alert('Please select a meal option');
      return;
    }

    alert('Booking successful! Thank you for choosing SkyTickets.');
  };
});