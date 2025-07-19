const express = require("express");
const app = express();
const path = require("path")
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//static assert file
app.use(express.static(path.join(__dirname, "image")));

//in memory data //allowing dynamic adding to the list no hard coded so everything need to add manually eg.data(displayallthe mainMenu Items, category, favoritelist)
let data = [];
let category = [];
let favoriteData = [];

//All the Boostrap Modal for validation etc popups , i put them all in the functions so i can re-use them as a reusable component.
function generateModal(id, title, message, type = "success") {
  const typeMap = {
    success: { bg: "bg-success", text: "text-white", btn: "btn-success" },
    warning: { bg: "bg-warning", text: "text-dark", btn: "btn-warning" },
    error:   { bg: "bg-danger", text: "text-white", btn: "btn-danger" },
  };
  const { bg, text, btn } = typeMap[type] || typeMap.success;
  return `
  <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header ${bg} ${text}">
          <h5 class="modal-title" id="${id}Label">${title}</h5>
        </div>
        <div class="modal-body text-center">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn ${btn}" data-bs-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  </div>`;
}
function confirmModal(id, title, message, confirmHref = "#", type = "warning", confirmText = "Yes", cancelText = "Cancel") {
  const typeMap = {
    success: { bg: "bg-success", text: "text-white", btn: "btn-success" },
    warning: { bg: "bg-warning", text: "text-dark", btn: "btn-warning" },
    error:   { bg: "bg-danger", text: "text-white", btn: "btn-danger" },
  };
  const { bg, text, btn } = typeMap[type] || typeMap.warning;

  return `
<div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}Label" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header ${bg} ${text}">
        <h5 class="modal-title" id="${id}Label">${title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <a href="${confirmHref}" id="confirmBtn" class="btn ${btn}">${confirmText}</a>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
      </div>
    </div>
  </div>
</div>`;
}


function successModal(id, title, message, image = "/Tick_Icons.png") {
  return `
<div class="modal fade" id="${id}" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-success text-white">
        <h5 class="modal-title">${title}</h5>
      </div>
      <div class="modal-body text-center">
        <img src="${image}" class="img-fluid mb-3" style="max-height:120px; object-fit:contain;">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-success" data-bs-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>`;
}

function warningModal(id, title, message, image = "/Error.png") {
  return `
<div class="modal fade" id="${id}" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-warning text-dark">
        <h5 class="modal-title">${title}</h5>
      </div>
      <div class="modal-body text-center">
        <img src="${image}" class="img-fluid mb-3" style="max-height:120px; object-fit:contain;">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-warning" data-bs-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>`;
}

function errorModal(id, title, message, image = "/Error.png") {
  return `
<div class="modal fade" id="${id}" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">${title}</h5>
      </div>
      <div class="modal-body text-center">
        <img src="${image}" class="img-fluid mb-3" style="max-height:120px; object-fit:contain;">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" data-bs-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>`;
}

let footer = `
<footer class="bg-dark text-white text-center py-4 px-3">
    <div class="container">
      <p class="mb-0">&copy; 2025 Music by Weijie. All rights reserved.</p>
    </div>
  </footer>`
let edit = `<img src="/YellowHeadset.png" class="img-rounded img-fluid" style="max-width:250px;object-fit:contain;"/>`

let BoostrapJS = () => {
  return `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
  `;
};

//Online learning here , concat to add one or two array together
//forEach with includes method() checking if the category is include the cat , trim the whitespace also 
let renderNavbar = () => {
  category = [];
  const allItems = data.concat(favoriteData);

  for (let i = 0; i < allItems.length; i++) {
    const cat = allItems[i].Category?.trim();
    if (cat && !category.includes(cat)) {
      category.push(cat);
    }
  }

  // Generate dropdown HTML
  let catDropdown = "";
  for (let i = 0; i < category.length; i++) {
    const cat = category[i];
    const encoded = encodeURIComponent(cat);
    catDropdown += `<li><a class="dropdown-item" href="/all_items/${encoded}">${cat}</a></li>`;
  }

  return `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" href="/"><i class="bi bi-music-note-beamed"></i> My<span class="text-muted">Playlist</span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/AddMusic">Add</a></li>
            <li class="nav-item"><a class="nav-link" href="/displayallitem">View</a></li>
            <li class="nav-item"><a class="nav-link" href="/favourites">Favourites</a></li>
            ${category.length ? `
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" data-bs-toggle="dropdown">
                  Categories
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  ${catDropdown}
                </ul>
              </li>` : ''}
          </ul>
        </div>
      </div>
    </nav>
  `;
};


//Home page 
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Music Playlist Logger</title>
  ${BoostrapJS()}
  
</head>

<body class="bg-light text-dark" >

${renderNavbar()}

  <section class="bg-light py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 py-4">
          <h1 class="display-5 fw-bold text-primary">Welcome to My Music Playlist Logger</h1>
<h3 class="text-dark mt-3">Curating vibes, one playlist at a time. <i class="bi bi-music-note-beamed"></i></h3>
<p class="text-muted mt-3">organize, explore, and revisit  favorite tracks effortlessly everything all in one place.</p>
<a href="#features" class="btn btn-warning text-dark shadow mt-3 px-4 py-2">Explore Now</a>
        </div>
        <div class="col-md-6 text-center">
<img src="craiyon_214150_image.png" class="img-fluid rounded" alt="Music Illustration" style="max-height: 400px; object-fit: contain;">
        </div>
      </div>
    </div>
  </section>

  <section class="bg-white text-center py-5">
    <div class="container shadow pb-4 pt-4">
      <h2 class="fw-bold mb-3">Meet Weijie</h2>
<p class="lead text-muted">I'm the creator of this Music logger Website , i was born with my love for curating songs that macthes every mood and meoment. of yours.</p>

<p class="fst-italic">For every emotional moments, there's a track  and I want a way to keep them all.</p>

<div class="text-center mt-4">
  <a href="/AddMusic" class="btn btn-dark text-white shadow me-2">Create Playlist</a>
  <a href="/displayallitem" class="btn shadow btn btn-muted">Browse My Library</a>
</div>

    </div>
  </section>

  <section class="py-5 bg-light">
    <div class="container">
      <h3 class="text-center fw-bold mb-5">Featured Favorites</h3>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card shadow-sm">
            <img src="/Coldplay.jpg" class="card-img-top w-100" style="max-height:200px; object-fit:cover;" alt="Coldplay">
            <div class="card-body" style="height:150px">
              <h5 class="card-title"><i class="bi bi-apple-music"></i> Sparks</h5>
              <p class="card-text">"Sparks" by Coldplay</p>
              <small class="text-muted">Release Year: 2000</small>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-150 shadow-sm">
            <img src="/Taylor-Swift-Lover-album-cover-820.jpg" class="card-img-top w-100" style="max-height:200px; object-fit:cover;" alt="Taylor Swift">
            <div class="card-body " style="height:150px">
              <h5 class="card-title"><i class="bi bi-apple-music"></i> Lover</h5>
              <p class="card-text">"Lover" by Taylor Swift</p>
              <small class="text-muted">Release Year: 2019</small>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card h-150 shadow-sm">
            <img src="/BrunoMars.png" class="card-img-top w-100" style="max-height:200px; object-fit:cover;" alt="Bruno Mars">
            <div class="card-body"style="height:150px">
              <h5 class="card-title"><i class="bi bi-apple-music"></i> 24K Magic</h5>
              <p class="card-text">"24K Magic" by Bruno Mars</p>
              <small class="text-muted">Release Year: 2016</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="features" class="bg-white py-5">
    <div class="container">
      <h3 class="text-center fw-bold mb-5">What You Can Do</h3>
      <div class="row text-center g-4">
        <div class="col-md-4">
          <div class="card h-100 shadow border-0" >
            <div class="card-body">
              <div class="fs-1 mb-3"><i class="bi bi-plus text-danger"></i></div>
              <h5 class="fw-bold ">Add Tracks</h5>
              <p>Log new music now and discover with personalized notes and details.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow border-0">
            <div class="card-body">
              <div class="fs-1 mb-3"><i class="bi bi-journal-text text-primary"></i></div>
              <h5 class="fw-bold">View Playlists</h5>
              <p>See your collections by mood, genre, or year.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow border-0">
            <div class="card-body">
              <div class="fs-1 mb-3"><i class="bi bi-collection-play-fill text-info"></i></div>
              <h5 class="fw-bold">Edit or Delete</h5>
              <p>update or remove songs as your taste changing.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-lg-12">
          <div class="card h-100 shadow border-0">
            <div class="card-body">
              <div class="fs-1 mb-3"><i class="bi bi-bookmarks text-success"></i></div>
              <h5 class="fw-bold">Bookmark Tracks</h5>
              <p>Save your favorite music playlists so you can easily revisit them anytime and anywhere.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-white py-5">
  <div class="container text-center">
    <h3 class="fw-bold mb-4">How It Works</h3>
    <div class="row g-4">
      <div class="col-md-4">
        <i class="bi bi-person-check fs-1 text-primary"></i>
        <h5 class="mt-3">Step 1: Add</h5>
        <p>Create your playlist.</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-search-heart fs-1 text-success"></i>
        <h5 class="mt-3">Step 2: Explore</h5>
        <p>View and search your favourite playlist name</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-magic fs-1 text-danger"></i>
        <h5 class="mt-3">Step 3: Enjoy</h5>
        <p>comeback find your music memories anytime, anywhere.</p>
      </div>
    </div>
  </div>
</section>

<section class="pt-4 mb-5 p-4 text-center bg-light">
  <h3 class="fw-bold mb-4">What Our Users Say</h3>
  <div class="container mb-4 mt-3">
  <div class="row g-12">
  <div class="col-md-12">
        <div class="card shadow h-100 text-center">

          <div class="card-body">
            <h3 class="card-title">Overall Rating</h3>
            <h6 class="card-subtitle mb-2 mt-3 text-muted">
            4.8
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-half text-warning"></i>
            </h6>
          </div>
        </div>
      </div>
  </div>
  </div>
  <div class="container">
    <div class="row g-4 justify-content-center">
      
      <div class="col-md-4">
        <div class="card shadow h-100">
            <img src="Asset 4.svg" class="card-img-top pt-4 d-flex justify-content-center img-rounded" height="200px" style="object-fit:contain">
          <div class="card-body">
            <h5 class="card-title">Leo</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-half text-warning"></i>
            </h6>
            <p class="card-text">"Super easy to organize my playlist , Love the clean interface!"</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow h-100">
                  <img src="Asset 2.svg" class="card-img-top pt-4 d-flex justify-content-center img-rounded" height="200px" style="object-fit:contain">

          <div class="card-body">
            <h5 class="card-title">Jasmine</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
            </h6>
            <p class="card-text">"A must-have tool for any music lovers. Simple, beautiful, and effective!"</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow h-100">
            <img src="/User1.svg" class="card-img-top pt-4 d-flex justify-content-center img-rounded" height="200px" style="object-fit:contain">
          <div class="card-body">
            <h5 class="card-title">Alicia</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star-fill text-warning"></i>
              <i class="bi bi-star text-warning"></i>
            </h6>
            <p class="card-text">"It's like a journal for my music moods everyday"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  
<button onclick="window.scrollTo({top: 0, behavior: 'smooth'});" class="btn btn-primary rounded-circle position-fixed" style="bottom: 20px; right: 20px; z-index: 1000;">
  <i class="bi bi-arrow-up"></i>
</button>
${footer}
</body>
</html>
  `);
});


//Add music GET
app.get("/AddMusic", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Add Playlist</title>
    ${BoostrapJS()}
  </head>
  <body>
    ${renderNavbar()}
    <div class="container-fluid p-0">
      <img src="/music_day.png" class="img-fluid w-100" style="height: 200px; object-fit:cover;" />
    </div>
    <div class="container mt-5 mb-5">
      <div class="d-flex justify-content-center align-items-center">
        <img src="Headsetpurple.png" class="img-rounded img-fluid" style="max-width:250px; object-fit:contain;" />
      </div>
      <h2 class="text-center mb-4">Add a New Playlist</h2>
      <form action="/add_item" id="playlistForm" method="POST" class="col-lg-8 mx-auto shadow p-4 rounded bg-light">
        <div class="mb-3"><label>Name</label><input type="text" name="Name" id="Name" class="form-control" placeholder="Name/Title of the music"></div>
        <div class="mb-3"><label>Description</label>
        <textarea name="Description" cols=10 rows=10 id="Description" placeholder="Description of the music" class="form-control">
        </textarea>
        </div>
        <div class="mb-3"><label>Category</label><input type="text" name="Category" id="Category" placeholder="Category of the music" class="form-control"></div>
        <div class="mb-3"><label>Year</label><input type="text" name="Year" id="Year" placeholder="Which year is the music published" class="form-control"></div>
        <div class="text-center">
          <button type="submit" class="btn btn-warning px-5 mb-3 mt-3 w-100">Add Playlist</button>
        </div>
        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" value="yes"  id="Favourite" name="Favourite">
          <label class="form-check-label" for="Favourite">
            <i class="bi bi-heart-fill text-danger"></i> Save this playlist to favourites
          </label>
        </div>
      </form>
    </div>
${successModal("successModal", "Added Successfully", "Your playlist has been added successfully!")}
${warningModal("duplicateModal", "Already Exists", "This playlist already exists in your collection.")}
${errorModal("errorModal", "Add Failed", "Your playlist could not be added. Please check your input fields.")}
<script>
  const form = document.getElementById("playlistForm");

  form.addEventListener("submit", function (e) {
  const name = form.Name.value.trim();
  const desc = form.Description.value.trim();
  const cat = form.Category.value.trim();
  const year = form.Year.value.trim();

  // Regular expression to check if year is a valid number and within range
  const currentYear = new Date().getFullYear();
  const yearPattern = /^[0-9]{4}$/; // Check if year is a 4-digit number

  if (!name || !desc || !cat || !year || !yearPattern.test(year) || year < 1900 || year > currentYear) {
    e.preventDefault();
    document.getElementById("fieldErrorBody").innerHTML =
      "Please fill in all fields and ensure the year is valid.";
    new bootstrap.Modal(document.getElementById("fieldErrorModal")).show();
  }
});
  const params = new URLSearchParams(location.search);

  if (params.get("duplicate") === "true") {
    new bootstrap.Modal(document.getElementById("duplicateModal")).show();
  }

  if (params.get("error") === "true") {
    new bootstrap.Modal(document.getElementById("errorModal")).show();
  }

  if (params.get("success") === "true") {
    const modal = new bootstrap.Modal(document.getElementById("successModal"));
    modal.show();

    document.querySelector("#successModal .btn-success").onclick = () => {
      window.location.href = params.get("fav") === "yes" ? "/favourites" : "/displayallitem";
    };
  }
</script>
<div class="modal fade" id="fieldErrorModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">Missing Required Fields</h5>
      </div>
      <div class="modal-body text-center" id="fieldErrorBody">
        <!-- Populated by JS -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" data-bs-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>
${footer}
  </body>
  </html>
  `);
});
app.post("/add_item", (req, res) => {
  const { Name, Description, Category, Year, Favourite } = req.body;

  const nameTrimmed = (Name || "").trim();
  const descriptionTrimmed = (Description || "").trim();
  const categoryTrimmed = (Category || "").trim();
  const yearTrimmed = (Year || "").trim();

  if (
    !nameTrimmed || 
    !descriptionTrimmed || 
    !categoryTrimmed || 
    !yearTrimmed 
  ) {
    return res.redirect("/AddMusic?error=true");
  }

  const newID = data.length + favoriteData.length + 1;
  const nameLower = nameTrimmed.toLowerCase();

  let duplicate = false;

  for (let item of data) {
    if (item.Name.trim().toLowerCase() === nameLower) {
      duplicate = true;
      break;
    }
  }

  if (!duplicate) {
    for (let item of favoriteData) {
      if (item.Name.trim().toLowerCase() === nameLower) {
        duplicate = true;
        break;
      }
    }
  }

  if (duplicate) {
    return res.redirect("/AddMusic?duplicate=true");
  }

  const item = {
    id: newID,
    Name: nameTrimmed,
    Description: descriptionTrimmed,
    Category: categoryTrimmed,
    Year: yearTrimmed,
  };

  let categoryExists = false;
  for (let c of category) {
    if (c.toLowerCase() === categoryTrimmed.toLowerCase()) {
      categoryExists = true;
      break;
    }
  }

  if (!categoryExists && categoryTrimmed) {
    category.push(categoryTrimmed);
  }
if (Favourite === "yes") {
  favoriteData.push(item);
} else {
  data.push(item);
}

res.redirect(`/AddMusic?success=true&fav=${Favourite === "yes" ? "yes" : "no"}`);

});

app.get("/displayallitem", (req, res) => {
  const query = (req.query.q || "").trim().toLowerCase();
  const sortBy = req.query.sort || "";

  const favoriteNames = favoriteData.map(item => item.Name.trim().toLowerCase());
  let filteredData = data.filter(item => !favoriteNames.includes(item.Name.trim().toLowerCase()));

  if (query) {
    filteredData = filteredData.filter(item => item.Name.toLowerCase().includes(query));
  }

  if (sortBy === "az") {
    filteredData.sort((a, b) => a.Name.localeCompare(b.Name));
  } else if (sortBy === "year") {
    filteredData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }else{
    filteredData.sort((a,b)=>b.Name.localeCompare(a.Name))
  }
let cards = '';

if (data.length === 0 && favoriteData.length === 0) {
  cards = `
    <div class="container py-5">
      <div class="text-center my-5">
        <img class="img-fluid rounded" src="/EmptyPlaylist.png" width="300px" height="300px" alt="No Playlists"/>
        <h1 class="display-1 text-danger">404</h1>
        <h3 class="mb-3">Oops! No playlists found.</h3>
        <p class="mb-4">You haven't added any playlists yet. Come back again later.</p>
        <a href="/AddMusic" class="btn btn-danger">Add Playlist</a>
      </div>
    </div>
  `;
} else if (filteredData.length === 0) {
  cards = `
    <div class="container text-center py-5">
      <h3 class="text-muted">No matching results found.</h3>
      <p>Try searching with a different keyword.</p>
    </div>
  `;
} else {
  cards = filteredData.map(item => `
<div class="col-sm-12 col-md-6 col-lg-4 d-flex align-items-stretch">
  <div class="card m-3 text-left w-100 shadow">
    <img src="/PLaylist1.jpg" class="card-img-top" style="max-height:150px;object-fit:cover;" />
    <div class="card-body">
      <h5 class="card-title"><strong>Name: </strong> ${item.Name}</h5>
            <h6 class="card-title"><p>Year: ${item.Year}</p> </h6>

      <div class="row">
        <div class="col-12 mb-2">
          <button onclick="confirmDelete(${item.id})" class="btn btn-outline-danger w-100 btn-sm">
            <i class="bi bi-trash3 me-1"></i>Delete
          </button>
        </div>
        <div class="col-12 mb-2">
          <button onclick="confirmEdit(${item.id})" class="btn btn-outline-primary w-100 btn-sm">
            <i class="bi bi-pencil-square me-1"></i>Edit
          </button>
        </div>
        <div class="col-12 mt-2 mb-2">
  <a href="/details/${item.id}" class="btn btn-outline-secondary w-100 btn-sm">
    <i class="bi bi-info-circle me-1"></i> More Details
  </a>
</div>
        <div class="col-12">
          <button onclick="confirmAddToFavourite(${item.id})" class="btn btn-outline-warning w-100 btn-sm">
            <i class="bi bi-heart-fill me-1 text-danger"></i>Add to Favourites
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  `).join("");
}


  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>All Playlists</title>
  ${BoostrapJS()}
</head>
<body>
  ${renderNavbar()}
  <div class="container py-5">
    <h2 class="mb-4">Playlists</h2>

   ${data.length || favoriteData.length?`<form method="GET" class="d-flex justify-content-between align-items-center mb-4">
      <div class="input-group me-3">
        <input type="text" class="form-control" name="q" placeholder="Search by name..." value="${query}">
        <button class="btn btn-outline-secondary" type="submit"><i class="bi bi-search"></i></button>
      </div>
      <div>
        <select name="sort" class="form-select" onchange="this.form.submit()" style="width:auto;">
          <option value="">Sort By</option>
          <option value="az" ${sortBy === "az" ? "selected" : ""}>A-Z</option>
          <option value="za" ${sortBy === "za" ? "selected" : ""}>Z-A</option>
          <option value="year" ${sortBy === "year" ? "selected" : ""}>Year</option>
        </select>
      </div>
    </form>`:``} 

    <div class="row justify-content-center">${cards}</div>
  </div>

  ${confirmModal("deleteModal", "Confirm Delete", "Are you sure you want to delete this playlist?", "#", "error", "Yes, Delete", "Cancel").replace('id="confirmBtn"', 'id="confirmDeleteBtn"')}
  ${confirmModal("editModal", "Confirm Edit", "Do you want to edit this playlist?", "#", "warning", "Yes, Edit", "Cancel").replace('id="confirmBtn"', 'id="confirmEditBtn"')}
  ${confirmModal("favModal", "Add to Favourites", "Add this playlist to your favourites?", "#", "success", "Yes, Add", "Cancel").replace('id="confirmBtn"', 'id="confirmFavBtn"')}

  <script>
    function confirmDelete(id) {
      document.getElementById('confirmDeleteBtn').href = '/delete/' + id;
      new bootstrap.Modal(document.getElementById('deleteModal')).show();
    }
    function confirmEdit(id) {
      document.getElementById('confirmEditBtn').href = '/edit/' + id;
      new bootstrap.Modal(document.getElementById('editModal')).show();
    }
    function confirmAddToFavourite(id) {
      document.getElementById('confirmFavBtn').href = '/savefavourite/' + id;
      new bootstrap.Modal(document.getElementById('favModal')).show();
    }
  </script>

  ${generateModal("favDuplicateModal", "Already in Favourites", "This playlist is already in your favourites.", "warning")}
  ${generateModal("favSuccessModal", "Added to Favourites", "Playlist successfully added to your favourites!", "success")}

  ${footer}
</body>
</html>
`);
});

//details routes
app.get("/details/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.find(i => i.id === id) || favoriteData.find(i => i.id === id)

  if (!item) return res.status(404).send("Item not found");

  res.send(`
    <html>
    <head>
      <title>${item.Name}-Details</title>
      ${BoostrapJS()}
    </head>
    <body>
      ${renderNavbar()}
      <div class="container mt-5 mb-5">
        <h2 class="text-center mb-4"><i class="bi bi-info-circle"></i>More Informations</h2>
        <div class="card shadow p-4 mx-auto" style="max-width: 600px;">
          <img src="/PLaylist1.jpg" class="card-img-top mb-4" style="max-height:250px; object-fit:cover;" />
          <h4><strong>Name:</strong> ${item.Name}</h4>
          <p><strong>Description:</strong> ${item.Description}</p>
          <p><strong>Category:</strong> ${item.Category}</p>
          <p><strong>Year:</strong> ${item.Year}</p>
          <div class="text-center mt-4">
            <a href="/displayallitem" class="btn btn-secondary">Back to All Playlists</a>
          </div>
        </div>
      </div>
      ${footer}
    </body>
    </html>
  `);
});



//Delete Items
app.get("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let deletedItem = null;
  let foundInData = false;

  // Manually find and remove from `data`
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      deletedItem = data[i];
      data.splice(i, 1); // Remove the item
      foundInData = true;
      break;
    }
  }

  // If not found in `data`, try `favoriteData`
  if (!deletedItem) {
    for (let i = 0; i < favoriteData.length; i++) {
      if (favoriteData[i].id === id) {
        deletedItem = favoriteData[i];
        favoriteData.splice(i, 1); // Remove the item
        break;
      }
    }

    if (!deletedItem) {
      return res.status(404).send("Item not found");
    }
  }

  // Check if the category is still used in either list
  let categoryStillExists = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i].Category?.trim() === deletedItem.Category?.trim()) {
      categoryStillExists = true;
      break;
    }
  }

  if (!categoryStillExists) {
    for (let i = 0; i < favoriteData.length; i++) {
      if (favoriteData[i].Category?.trim() === deletedItem.Category?.trim()) {
        categoryStillExists = true;
        break;
      }
    }
  }

  // Remove category if no longer used
  if (!categoryStillExists) {
    category = category.filter(cat => cat !== deletedItem.Category?.trim());
  }

  const fromCategory = req.query.fromCategory;
  if (fromCategory) {
    return res.redirect(`/all_items/${encodeURIComponent(fromCategory)}?deleted=true`);
  }

  res.redirect("/displayallitem");
});


app.get("/savefavourite/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let itemIndex = -1;
  let item = null;

  // Find item index in `data`
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      itemIndex = i;
      item = data[i];
      break;
    }
  }

  // If not found, redirect
  if (itemIndex === -1 || !item) {
    return res.redirect("/displayallitem");
  }

  // Check for duplicate in `favoriteData`
  let isNameDuplicate = false;
  for (let fav of favoriteData) {
    if (fav.Name.trim().toLowerCase() === item.Name.trim().toLowerCase()) {
      isNameDuplicate = true;
      break;
    }
  }

  if (isNameDuplicate) {
    return res.redirect("/displayallitem?duplicatefav=true");
  }

  // Add to favorites and remove from main list
  favoriteData.push(item);
  data.splice(itemIndex, 1);

  res.redirect("/displayallitem?favsuccess=true");
});




//GET Favoruite
app.get("/favourites", (req, res) => {
  const favListHtml = favoriteData.map(item => {
    let isInMain = false;
    for (let d of data) {
      if (d.Name.trim().toLowerCase() === item.Name.trim().toLowerCase()) {
        isInMain = true;
        break;
      }
    }

    return `
      <div class="col-md-4">
        <div class="card shadow m-3">
          <img src="/PLaylist1.jpg" alt="" class="card-img-top" style="max-height:150px;object-fit:cover;"/>
          <div class="card-body">
            <h5 class="card-title"><strong>Name:</strong> ${item.Name}</h5>
            <p class="card-text"><strong>Description: </strong>${item.Description}</p>
            <p><strong>Year:</strong> ${item.Year}</p>
            <div class="d-flex flex-column gap-2">
<button onclick="confirmRemoveFavourite(${item.id})" class="btn btn-danger btn-sm">Remove</button>
              ${isInMain
                ? `<span class="text-muted small">Already in Main Playlist</span>`
                : `<button onclick="confirmAddToMain(${item.id})" class="btn btn-success btn-sm">Add to Main Playlist</button>
`}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  res.send(`
    <html>
    <head><title>Favourite Playlists</title>${BoostrapJS()}</head>
    <body>
      ${renderNavbar()}
      <div class="container py-5">
        <h2 class="mb-4 text-center"><i class="bi bi-suit-heart-fill text-danger fs-3"></i>&nbsp;Your Favourite Playlists</h2>
        <div class="row justify-content-center">
          ${favListHtml || `
            <div class='col-sm-12 text-center'>
              <img src='/YellowHeadset.png' class='img-fluid rounded mb-4' style='max-height: 350px; object-fit: cover;' alt='No Favorites'>
              <h3 class='text-muted'>You have no favourites yet.</h3>
              <p class='text-center text-muted pt-3'>Come back and check out later</p>
            </div>
          `}
        </div>

        <div class="text-center mt-4">
          <a href="/displayallitem" class="btn btn-warning px-4 py-2">Back to Playlist</a>
        </div>
      </div>

      <!-- Modals -->
      ${confirmModal("addToMainModal", "Add to Main Playlist", "Are you sure you want to add this playlist to your main collection?", "#", "success", "Yes, Add", "Cancel").replace('id="confirmBtn"', 'id="confirmAddBtn"')}


      ${warningModal("mainDuplicateModal", "Playlist Exists", "A playlist with this name already exists in your main collection.")}
      ${successModal("mainAddSuccessModal", "Added Successfully", "This playlist was added to your main playlist.")}

      <!-- Modal trigger logic -->
      
      <script>
      
      function confirmAddToMain(id) {
  document.getElementById('confirmAddBtn').href = '/addtoplaylist/' + id;
  new bootstrap.Modal(document.getElementById('addToMainModal')).show();
}

      function confirmRemoveFavourite(id) {
  document.getElementById('confirmRemoveFavBtn').href = '/removefavourite/' + id;
  new bootstrap.Modal(document.getElementById('removeFavModal')).show();
}

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("duplicateMain") === "true") {
          new bootstrap.Modal(document.getElementById("mainDuplicateModal")).show();
        }
        if (urlParams.get("addMainSuccess") === "true") {
          new bootstrap.Modal(document.getElementById("mainAddSuccessModal")).show();
        }
      </script>
${confirmModal("removeFavModal", "Remove Playlist", "Are you sure you want to remove this from favourites?", "#", "error", "Yes, Remove", "Cancel").replace('id="confirmBtn"', 'id="confirmRemoveFavBtn"')}

      ${footer}
    </body>
    </html>
  `);
});

app.get("/addtoplaylist/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const favIndex = favoriteData.findIndex(item => item.id === id);
  if (favIndex === -1) return res.redirect("/favourites");

  const favItem = favoriteData[favIndex];

  let nameExists = false;
  for (const item of data) {
    if (item.Name.trim().toLowerCase() === favItem.Name.trim().toLowerCase()) {
      nameExists = true;
      break;
    }
  }
  if (nameExists) {
    return res.redirect("/favourites?duplicateMain=true");
  }

  data.push(favItem);
  favoriteData.splice(favIndex, 1);

  return res.redirect("/displayallitem");
});


app.get("/removefavourite/:id", (req, res) => {
  const id = parseInt(req.params.id);
  favoriteData = favoriteData.filter(item => item.id !== id);

  category = [];
  for (let i = 0; i < data.length; i++) {
    const cat = data[i].Category?.trim();
    if (cat && !category.includes(cat)) {
      category.push(cat);
    }
  }

  res.redirect("/favourites");
});


app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item =data.length?data.find(i => i.id === id): favoriteData.find(i => i.id === id);


  if (!item) return res.status(404).send("Item not found");

  res.send(`
  <html>
  <head>
    <title>Edit Playlist</title>
    ${BoostrapJS()}
  </head>
  <body>
    ${renderNavbar()}      
    <img src="/BackgroundDesign1.jpg" class="img-fluid w-100" style="height: 200px; object-fit: cover;" />

    <div class="container mt-5 mb-5">
      <h2 class="text-center mb-4"><i class="bi bi-pencil-square"></i>&nbsp;Edit Playlist</h2>
      <div class="d-flex justify-content-center align-items-center">${edit}</div>

<form id="editForm" action="/update/${item.id}${req.query.fromCategory ? `?fromCategory=${req.query.fromCategory}` : ''}" method="POST" class="col-lg-8 mx-auto shadow p-4 rounded bg-light">
        <div class="mb-3"><label>Name</label><input type="text" name="Name" class="form-control" value="${item.Name}" ></div>
        <div class="mb-3"><label>Description</label>
            <textarea name="Description" cols="10" rows="10" id="Description" placeholder="Description of the music" class="form-control">${item.Description}</textarea>
        </textarea>
        </div>
        <div class="mb-3"><label>Category</label><input type="text" name="Category" class="form-control" value="${item.Category}"></div>
        <div class="mb-3"><label>Year</label><input type="number" name="Year" class="form-control" value="${item.Year}"></div>
        <div class="text-center"><button type="submit" class="btn btn-success w-100 px-5">Update</button></div>
        <input type="hidden" name="fromCategory" value="${req.query.fromCategory || ''}" />

      </form>
    </div>
<div class="modal fade" id="fieldErrorModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">Missing Required Fields</h5>
      </div>
      <div class="modal-body text-center" id="fieldErrorBody">
        <!-- Populated by JS -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" data-bs-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>
    <!-- Modal -->
    <div class="modal fade shadow" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header text-white bg-success">
            <h5 class="modal-title " id="successModalLabel">Update Successfully</h5>
          </div>
          <div class="modal-body text-center">
          <div class="d-flex justify-content-center align-items-center ">
          <img src= "/Tick_Icons.png" class="img-fluid img-rounded " style="max-height:150px;object-fit:cover"/>
          </div>
                  playlist has been updated successfully!
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
${errorModal("errorModal", "Add Failed", "You have error. Please check your input fields.")}
    <script>

      const form = document.getElementById("editForm");
      const modal = new bootstrap.Modal(document.getElementById("successModal"));
       form.addEventListener("submit", function (e) {
    const name = form.Name.value.trim();
    const desc = form.Description.value.trim();
    const cat = form.Category.value.trim();
    const year = form.Year.value.trim();

    if (!name || !desc || !cat || !year) {
      e.preventDefault();
      document.getElementById("fieldErrorBody").innerHTML =
        "Please fill in all fields.";
      new bootstrap.Modal(document.getElementById("fieldErrorModal")).show();
    }
  });
 
    </script>
  </body>
  ${footer}
  </html>
  `);
});

//UPDATE ITEMS
app.post("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { Name, Description, Category, Year } = req.body;

  let updatedCategory = Category.trim();

  let updated = false;

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      data[i].Name = Name;
      data[i].Category = updatedCategory;
      data[i].Year = Year;
      data[i].Description = Description;
      updated = true;
      break;
    }
  }

  if (!updated) {
    for (let i = 0; i < favoriteData.length; i++) {
      if (favoriteData[i].id === id) {
        favoriteData[i].Name = Name;
        favoriteData[i].Category = updatedCategory;
        favoriteData[i].Year = Year;
        favoriteData[i].Description = Description;
        break;
      }
    }
  }

  // Clear category cache and update with the latest categories from the data and favoriteData
  category = [];
  const sourceList = data.length ? data : favoriteData;

  for (let i = 0; i < sourceList.length; i++) {
    const cat = sourceList[i].Category?.trim();
    if (cat && !category.includes(cat)) {
      category.push(cat);
    }
  }

  // After updating, redirect back to the displayallitem page
  res.redirect("/displayallitem?edited=true");
});


//ALL_ITEM/CATEGORY
app.get("/all_items/:category", (req, res) => {
  
  const categoryParam = req.params.category;
  const sortBy = req.query.sort || "az";

  // Combine both arrays
  const allItems = data.concat(favoriteData);
  let filtered = allItems.filter(item => item.Category === categoryParam);

  if (sortBy === "az") {
    filtered.sort((a, b) => a.Name.localeCompare(b.Name));
  } else if (sortBy === "year") {
    filtered.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }else{
    filtered.sort((a,b)=>b.Name.localeCompare(a.Name))
  }
  const items = filtered.map(item => `<div class="card m-3 shadow" style="width: 18rem;">
  <img src="/Music_Category.png" class="card-img-top w-100" style="max-height:200px; object-fit:cover;" alt="Playlist Image">

  <div class="card-body">
    <h5 class="card-title text-truncate"><strong>Name: </strong>${item.Name}</h5>
   
    <div class="row mt-3">
      <div class="col-12 mb-2">
        <button class="btn btn-warning w-100" onclick="confirmEdit(${item.id}, '${categoryParam}')">
          <i class="bi bi-pencil-square me-1"></i> Edit
        </button>
      </div>
      <div class="col-12 mt-2 mb-2">
  <a href="/details/${item.id}" class="btn btn-outline-secondary w-100 btn-sm">
    <i class="bi bi-info-circle me-1"></i> More Details
  </a>
</div>
      <div class="col-12">
        <button class="btn btn-danger w-100" onclick="confirmCategoryDelete(${item.id}, '${categoryParam}')">
          <i class="bi bi-trash3 me-1"></i> Delete
        </button>
      </div>
    </div>
  </div>
</div>

  `).join("");

  res.send(`
    <html>
   <head>
  <title>${categoryParam}</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${BoostrapJS()}

</head>

    <body class="bg-light">
      ${renderNavbar()}
      <div class="container-fluid p-0">
      <img src="/playlistbackgroundcat.jpg" class="img-fluid w-100" style="max-height:200px;object-fit:cover"/>
      </div>
      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Category: ${categoryParam}</h2>
          <form method="GET" action="/all_items/${categoryParam}">
            <select name="sort" class="form-select" onchange="this.form.submit()" style="width:auto;display:inline-block">
              <option value="az" ${sortBy === "az" ? "selected" : ""}>Sort A-Z</option>
              <option value="za"${sortBy==="za"?"selected":""}>Sort Z-A</option>
              <option value="year" ${sortBy === "year" ? "selected" : ""}>Sort by Year</option>
            </select>
          </form>
        </div>

        ${items.length ? `
  <div id="playlistCards" class="d-flex flex-wrap">
    ${items}
  </div>
` : `
  <div class="d-flex justify-content-center align-items-center mt-4">
    <div class='col-sm-12 text-center'>
      <img src='/OrangeHeadset.jpg' 
           class='img-fluid rounded mb-4' 
           style='max-height: 350px; object-fit: cover;' 
           alt='No Favorites'>
      <h3 class='text-muted'>You have no any Category yet.</h3>
      <p class='text-center text-muted'>Come Back Check out later</p>
      <a href="/AddMusic" class="btn btn-danger mt-4">Add Playlist</a>
    </div>
  </div>
`}

      </div>

${confirmModal("editModal", "Confirm Edit", "Do you want to edit this playlist?", "#", "warning", "Yes, Edit", "Cancel").replace('id="confirmBtn"', 'id="confirmEditBtn"')}
${confirmModal("categoryDeleteModal", "Confirm Delete", "Do you really want to delete this playlist? This cannot be undone.", "#", "error", "Yes, Delete", "Cancel").replace('id="confirmBtn"', 'id="confirmDeleteBtn"')}

<script>
  function confirmCategoryDelete(id, category) {
    const deleteLink = document.getElementById('confirmDeleteBtn');
    deleteLink.href = '/delete/' + id + '?fromCategory=' + encodeURIComponent(category);

    const modal = new bootstrap.Modal(document.getElementById('categoryDeleteModal'));
    modal.show();
  }

  function confirmEdit(id, category) {
    const editLink = document.getElementById('confirmEditBtn');
    editLink.href = '/edit/' + id + '?fromCategory=' + encodeURIComponent(category);

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }
</script>


<script>
  if (new URLSearchParams(window.location.search).get("deleted") === "true") {
    const deleteSuccess = new bootstrap.Modal(document.getElementById("deleteSuccessModal"));
    deleteSuccess.show();
  }
</script>
<script>
  const queryParams = new URLSearchParams(window.location.search);

  if (queryParams.get("deleted") === "true") {
    const deleteSuccess = new bootstrap.Modal(document.getElementById("deleteSuccessModal"));
    deleteSuccess.show();

    document.getElementById("deleteSuccessModal").addEventListener("hidden.bs.modal", () => {
      const remainingCards = document.querySelectorAll(".card");
      if (remainingCards.length === 0) {
        window.location.href = "/displayallitem";
      } else {
        window.location.href = window.location.pathname;
      }
    });
  }

  if (queryParams.get("edited") === "true") {
    const editSuccess = new bootstrap.Modal(document.getElementById("editSuccessModal"));
    editSuccess.show();
  }
</script>

<script>
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("deleted") === "true") {
    const deleteSuccessModal = new bootstrap.Modal(document.getElementById("deleteSuccessModal"));
    deleteSuccessModal.show();

    document.getElementById("deleteSuccessModal").addEventListener("hidden.bs.modal", () => {
      const remainingCards = document.querySelectorAll("#playlistCards .card");

      if (remainingCards.length === 0) {
        window.location.href = "/displayallitem";
      } else {
        window.location.href = window.location.pathname;
      }
    });
  }
   setTimeout(() => {
  const modal = bootstrap.Modal.getInstance(document.getElementById("deleteSuccessModal"));
  if (modal) modal.hide();
}, 2000);
</script>
</body>
${footer}
    </html>
  `);
});
//Port 3000 listening and  running
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
