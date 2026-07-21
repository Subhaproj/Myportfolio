function renderHome() {

    return `

<section class="hero">

<div class="container">

<p class="welcome">

Hello, I'm

</p>

<h1>

${portfolioData.home.hero.name}

</h1>

<h2>

${portfolioData.home.hero.title}

</h2>

<p class="hero-description">

${portfolioData.home.hero.description}

</p>

<a href="#/portfolio" class="primary-btn">

Explore My Portfolio

</a>

</div>

</section>

<section class="portfolio-home">

<div class="container">

<h2>

What I Create

</h2>

<div class="card-grid">

${portfolioData.home.categories.map(createCategoryCard).join("")}

</div>

</div>

</section>

`;

}

function createCategoryCard(category){

return `

<div class="category-card">

<img src="${category.image}" alt="${category.title}">

<h3>${category.title}</h3>

<p>${category.description}</p>

<button
class="explore-btn"
data-route="${category.id}">

Explore →

</button>

</div>

`;

}