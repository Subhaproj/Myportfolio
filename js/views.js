// ========================================
// Show Category Collections
// ========================================

function showCollections(categoryId) {

    const category = portfolio.categories.find(
        item => item.id === categoryId
    );

    if (!category) return;

    const home = document.getElementById("homeContent");
    const view = document.getElementById("portfolioView");

    home.hidden = true;
    view.hidden = false;

    window.scrollTo(0,0);

    let cards = "";

    category.collections.forEach(collection => {

        cards += `

            <article class="project-card">

                <img
                    src="${collection.image}"
                    alt="${collection.title}">

                <div class="project-content">

                    <h3>${collection.title}</h3>

                    <p>${collection.description}</p>

                    <button
                        class="project-btn collection-btn"
                        data-category="${category.id}"
                        data-collection="${collection.id}">

                        View Collection →

                    </button>

                </div>

            </article>

        `;

    });

    view.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backHome">

                ← Back to Home

            </button>

            <h2 class="view-title">

                ${category.title}

            </h2>

            <p class="view-description">

                ${category.description}

            </p>

            <div class="projects-grid">

                ${cards}

            </div>

        </div>

    `;

    // Back Button

    document
        .getElementById("backHome")
        .addEventListener("click", goHome);

    // Collection Buttons

    document
        .querySelectorAll(".collection-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                showCollection(

                    button.dataset.category,
                    button.dataset.collection

                );

            });

        });

}


// ========================================
// Show One Collection
// ========================================

function showCollection(categoryId, collectionId) {

    const category = portfolio.categories.find(
        item => item.id === categoryId
    );

    if (!category) return;



    const collection = category.collections.find(
        item => item.id === collectionId
    );

    if (!collection) return;

    const view = document.getElementById("portfolioView");

    let works = "";

    collection.works.forEach(work => {

        works += `

            <article class="project-card">

                <img
                    src="${work.image}"
                    alt="${work.title}">

                <div class="project-content">

                    <h3>${work.title}</h3>

                    <p>${work.description}</p>

                    <button
                        class="project-btn artwork-btn"
                        data-category="${categoryId}"
                        data-collection="${collectionId}"
                        data-work="${work.id}">

                        View Artwork →

                    </button>

                </div>

            </article>

        `;

    });

    view.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backCollections">

                ← ${category.title}

            </button>

            <h2 class="view-title">

                ${collection.title}

            </h2>

            <p class="view-description">

                ${collection.description}

            </p>

            <div class="projects-grid">

                ${works}

            </div>

        </div>

    `;

    document
        .getElementById("backCollections")
        .addEventListener("click", () => {

            showCollections(categoryId);

        });

    document
        .querySelectorAll(".artwork-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                showArtwork(

                    button.dataset.category,
                    button.dataset.collection,
                    button.dataset.work

                );

            });

        });

}


// ========================================
// Show Artwork Details
// ========================================

function showArtwork(categoryId, collectionId, workId) {

    const category = portfolio.categories.find(
        item => item.id === categoryId
    );

    const collection = category.collections.find(
        item => item.id === collectionId
    );

    const work = collection.works.find(
        item => item.id === workId
    );

    const view = document.getElementById("portfolioView");

    view.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backGallery">

                ← ${collection.title}

            </button>

            <div class="artwork-details">

                <img
                    class="artwork-image"
                    src="${work.image}"
                    alt="${work.title}">

                <div class="artwork-info">

                    <h2>${work.title}</h2>

                    <p>${work.description}</p>

                </div>

            </div>

        </div>

    `;

    document
        .getElementById("backGallery")
        .addEventListener("click", () => {

            showCollection(categoryId, collectionId);

        });

}


// ========================================
// Go Back Home
// ========================================

function goHome() {

    document.getElementById("homeContent").hidden = false;

    document.getElementById("portfolioView").hidden = true;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}