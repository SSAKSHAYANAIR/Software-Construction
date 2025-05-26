const page = document.querySelector('#page');

// ─── PAGE TRANSITION FUNCTIONS ────────────────────────────────────────────────
function showPage() {
  page.classList.add('page-enter');
  requestAnimationFrame(() => page.classList.add('page-enter-active'));
  page.addEventListener('transitionend', () => {
    page.classList.remove('page-enter', 'page-enter-active');
  }, { once: true });
}

function hidePage(callback) {
  page.classList.add('page-exit');
  requestAnimationFrame(() => page.classList.add('page-exit-active'));
  page.addEventListener('transitionend', () => {
    page.classList.remove('page-exit', 'page-exit-active');
    if (callback) callback();
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  showPage();

  // ─── LOGIN FORM ────────────────────────────────────────────────────────────────
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const users = [
      { username: 'builder1', password: 'pass123' },
      { username: 'builder2', password: 'pass456' },
    ];
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const uname = document.getElementById('username').value;
      const pword = document.getElementById('password').value;
      const isValid = users.some(u => u.username === uname && u.password === pword);

      if (!isValid) {
        alert('Invalid credentials');
        return;
      }
      sessionStorage.setItem('loggedInUser', uname);
      hidePage(() => { window.location.href = 'post.html'; });
    });
  }

  // ─── POST PROPERTY FORM ───────────────────────────────────────────────────────
  const propertyForm = document.getElementById('propertyForm');
  if (propertyForm) {
    propertyForm.addEventListener('submit', e => {
      e.preventDefault();
      // NO transition here
      const title = document.getElementById('title').value;
      const price = document.getElementById('price').value;
      const location = document.getElementById('location').value;
      const images = document.getElementById('images').files;

      const preview = document.getElementById('preview');
      preview.innerHTML = '';
      for (let i = 0; i < images.length; i++) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(images[i]);
        preview.appendChild(img);
      }
      console.log({ title, price, location, images });
    });

    // Navigation to Search (with transition)
    const goToSearch = document.getElementById('goToSearch');
    if (goToSearch) {
      goToSearch.addEventListener('click', e => {
        e.preventDefault();
        hidePage(() => { window.location.href = 'search.html'; });
      });
    }
  }

  // ─── PROPERTY SEARCH ──────────────────────────────────────────────────────────
  // Define filterProperties globally (for inline onclick or future handlers)
  window.filterProperties = function() {
    const bhk = document.getElementById('searchBHK').value.toLowerCase();
    const area = document.getElementById('searchArea').value.toLowerCase();
    const amenity = document.getElementById('amenitiesFilter').value;

    const dummyProperties = [
      { title: "2BHK in City Center", area: "Downtown", amenities: ["pool", "gym"] },
      { title: "3BHK in Suburbs", area: "Suburb", amenities: ["parking"] }
    ];

    const filtered = dummyProperties.filter(prop =>
      (bhk === "" || prop.title.toLowerCase().includes(bhk)) &&
      (area === "" || prop.area.toLowerCase().includes(area)) &&
      (amenity === "" || prop.amenities.includes(amenity))
    );

    const list = document.getElementById('propertyList');
    list.innerHTML = filtered.length
      ? filtered.map(p => `<div>${p.title} - ${p.area} - Amenities: ${p.amenities.join(', ')}</div>`).join('')
      : "<div>No properties found</div>";
  };

  // Navigation to Reviews (with transition)
  const goToReview = document.getElementById('goToReview');
  if (goToReview) {
    goToReview.addEventListener('click', e => {
      e.preventDefault();
      hidePage(() => { window.location.href = 'review.html'; });
    });
  }

  // ─── REVIEWS FORM ─────────────────────────────────────────────────────────────
  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');
  // Clear reviews from localStorage on refresh


  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  localStorage.removeItem('reviews');

  if (reviewForm) {
    // Render existing on load

    renderReviews();
    reviewForm.addEventListener('submit', e => {
      e.preventDefault();
      const text = document.getElementById('reviewText').value.trim();
      if (!text) return;
      reviews.push(text);
      localStorage.setItem('reviews', JSON.stringify(reviews));
      document.getElementById('reviewText').value = '';
      renderReviews();
    });
  }

  function renderReviews() {
    reviewsList.innerHTML = reviews
      .map((r, i) => `<div>Review ${i+1}: ${r}</div>`)
      .join('');
  }

  // ─── RATINGS FORM ─────────────────────────────────────────────────────────────
  const ratingForm = document.getElementById('ratingForm');
  const ratingsList = document.getElementById('ratingsList');
  localStorage.removeItem('ratings');
  let ratings = JSON.parse(localStorage.getItem('ratings')) || [];

  if (ratingForm) {
    renderRatings();
    ratingForm.addEventListener('submit', e => {
      e.preventDefault();
      const seller = document.getElementById('seller').value.trim();
      const rating = parseInt(document.getElementById('rating').value, 10);
      if (!seller || isNaN(rating) || rating < 1 || rating > 5) return;
      ratings.push({ seller, rating });
      localStorage.setItem('ratings', JSON.stringify(ratings));
      document.getElementById('seller').value = '';
      document.getElementById('rating').value = '';
      renderRatings();
    });
  }

  function renderRatings() {
    ratingsList.innerHTML = ratings
      .map(r => `<div>Seller: ${r.seller}, Rating: ${r.rating}</div>`)
      .join('');
  }
});
