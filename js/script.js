
document.addEventListener("DOMContentLoaded", function () {

  // ---------- MOVIE PRICES ----------
  var prices = {
    "Zathura: A Space Adventure": 18,
    "3 Idiots": 16,
    "Tom and Jerry: The Fast and the Furry": 14,
    "The Godfather": 17,
    "Journey to the Center of the Earth": 15.5,
    "Bird Box": 18.5
  };


  // ---------- RECOMMENDATION PAGE ----------
  var recommendForm = document.getElementById("recommend-form");

  if (recommendForm) {
    recommendForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var genre = document.getElementById("genre").value;
      var age = document.getElementById("age-group").value;
      var result = document.getElementById("recommend-result");

      var movie = "";

      if (genre == "" || age == "") {
        alert("Please select a genre and age group.");
        return;
      }

      // Children receive G and PG recommendations
      if (age == "child") {
        if (genre == "Action") {
          movie = "Zathura: A Space Adventure";
        } else if (genre == "Adventure") {
          movie = "Journey to the Center of the Earth";
        } else {
          movie = "Tom and Jerry: The Fast and the Furry";
        }

      } else {
        // Teenagers and adults can receive all six
        if (genre == "Animation") {
          movie = "Tom and Jerry: The Fast and the Furry";
        } else if (genre == "Comedy") {
          movie = "3 Idiots";
        } else if (genre == "Action") {
          movie = "Zathura: A Space Adventure";
        } else if (genre == "Drama") {
          movie = "The Godfather";
        } else if (genre == "Adventure") {
          movie = "Journey to the Center of the Earth";
        } else if (genre == "Thriller") {
          movie = "Bird Box";
        } else {
          movie = "Tom and Jerry: The Fast and the Furry";
        }
      }

      result.innerHTML =
        "<h2>We recommend: " + movie + "</h2>" +
        "<p>This movie matches some of your selected preferences.</p>" +
        '<a class="button" href="booking.html?movie=' +
        encodeURIComponent(movie) + '">Book this movie</a>';
    });
  }


  // ---------- REGISTRATION PAGE ----------
  var registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {

      var errMsg = "";

      var username = document.getElementById("username").value.trim();
      var email = document.getElementById("register-email").value.trim();
      var phone = document.getElementById("register-phone").value.trim();
      var password = document.getElementById("password").value;
      var confirmPassword = document.getElementById("confirm-password").value;
      var country = document.getElementById("country").value;
      var gender = document.querySelector('input[name="gender"]:checked');
      var genres = document.querySelectorAll('input[name="preferred-genre"]:checked');

      // Check username
      if (username.length < 5 || !/^[A-Za-z0-9_]+$/.test(username)) {
        errMsg += "Username must contain at least 5 letters, numbers or underscores.\n";
      }

      // Check email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errMsg += "Please enter a valid email address.\n";
      }

      // Check phone number
      if (!/^\d{8,15}$/.test(phone)) {
        errMsg += "Phone number must contain 8 to 15 digits.\n";
      }

      // Check password
      if (password.length < 10 || !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password) || !/\d/.test(password) ||
          !/[^A-Za-z0-9]/.test(password)) {
        errMsg += "Password must contain at least 10 characters, uppercase, lowercase, a number and a special character.\n";
      }

      // Check passwords match
      if (password != confirmPassword) {
        errMsg += "Passwords do not match.\n";
      }

      // Check gender
      if (!gender) {
        errMsg += "Please select a gender.\n";
      }

      // Check preferred genres
      if (genres.length == 0) {
        errMsg += "Please select at least one preferred genre.\n";
      }

      // Check country
      if (country == "") {
        errMsg += "Please select a country or region.\n";
      }

      // Stop registration if there are errors
      if (errMsg != "") {
        alert(errMsg);
        event.preventDefault();
      }

    });
  }


  // ---------- BOOKING PAGE ----------
  var bookingForm = document.getElementById("booking-form");

  if (bookingForm) {

    var movie = document.getElementById("movie-select");
    var tickets = document.getElementById("tickets");
    var price = document.getElementById("ticket-price");
    var cost = document.getElementById("booking-cost");
    var screening = document.getElementById("screening");

    var voucherFields = document.getElementById("voucher-fields");
    var cardFields = document.getElementById("card-fields");
    var voucherCode = document.getElementById("voucher-code");
    var cardType = document.getElementById("card-type");
    var cardNumber = document.getElementById("card-number");

    var email = document.getElementById("booking-email");
    var billingEmail = document.getElementById("billing-email");
    var sameEmail = document.getElementById("same-billing-email");

    // Select movie from URL
    var params = new URLSearchParams(window.location.search);
    var chosenMovie = params.get("movie");

    if (chosenMovie && prices[chosenMovie]) {
      movie.value = chosenMovie;
    }

    // Minimum screening date is today
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    screening.min = now.toISOString().slice(0, 16);

    // Calculate ticket price and total
    function updatePrice() {
      var oneTicket = prices[movie.value] || 0;
      var count = Number(tickets.value) || 0;

      price.value = "$" + oneTicket.toFixed(2);
      cost.value = "$" + (oneTicket * count).toFixed(2);
    }

    movie.addEventListener("change", updatePrice);
    tickets.addEventListener("input", updatePrice);
    updatePrice();

    // Show payment fields
    var paymentOptions = document.querySelectorAll('input[name="payment-method"]');

    function updatePayment() {
      var payment = document.querySelector('input[name="payment-method"]:checked');

      voucherFields.hidden = !payment || payment.value != "voucher";
      cardFields.hidden = !payment || payment.value != "online";
    }

    paymentOptions.forEach(function (option) {
      option.addEventListener("change", updatePayment);
    });

    updatePayment();

    // Copy contact email to billing email
    function copyEmail() {
      if (sameEmail.checked) {
        billingEmail.value = email.value;
      }
    }

    sameEmail.addEventListener("change", copyEmail);
    email.addEventListener("input", copyEmail);

    // Validate booking form
    bookingForm.addEventListener("submit", function (event) {

      var errMsg = "";

      var name = document.getElementById("full-name").value.trim();
      var phone = document.getElementById("booking-phone").value.trim();
      var ticketCount = Number(tickets.value);
      var ticketType = document.getElementById("ticket-type").value;
      var payment = document.querySelector('input[name="payment-method"]:checked');

      // Check full name
      if (name == "") {
        errMsg += "Please enter your full name.\n";
      }

      // Check email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        errMsg += "Please enter a valid email address.\n";
      }

      // Check phone
      if (!/^\d{10,}$/.test(phone)) {
        errMsg += "Phone number must contain at least 10 digits.\n";
      }

      // Check movie
      if (movie.value == "") {
        errMsg += "Please select a movie.\n";
      }

      // Check screening date
      if (screening.value == "" || new Date(screening.value) < new Date()) {
        errMsg += "Please select a future screening date and time.\n";
      }

      // Check tickets
      if (tickets.value == "" || ticketCount < 1 || !Number.isInteger(ticketCount)) {
        errMsg += "Please enter at least one whole ticket.\n";
      }

      // Check ticket type
      if (ticketType == "") {
        errMsg += "Please select a ticket type.\n";
      }

      // Check billing email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail.value.trim())) {
        errMsg += "Please enter a valid billing email.\n";
      }

      // Check payment method
      if (!payment) {
        errMsg += "Please select a payment method.\n";
      }

      // Check voucher
      if (payment && payment.value == "voucher") {
        if (!/^\d{12}$/.test(voucherCode.value.trim())) {
          errMsg += "Voucher code must contain 12 digits.\n";
        }
      }

      // Check online payment
      if (payment && payment.value == "online") {

        if (cardType.value == "") {
          errMsg += "Please select a card type.\n";
        } else {
          var length = cardType.value == "amex" ? 15 : 16;

          if (!/^\d+$/.test(cardNumber.value) || cardNumber.value.length != length) {
            errMsg += "Card number must contain " + length + " digits.\n";
          }
        }
      }

      // Display errors and stop form submission
      if (errMsg != "") {
        alert(errMsg);
        event.preventDefault();
      }

    });
  }

});

