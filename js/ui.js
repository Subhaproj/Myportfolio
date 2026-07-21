function createCard(item) {

    return `
        <article class="project-card">

            <img src="${item.image}" alt="${item.title}">

            <div class="project-content">

                <h3>${item.title}</h3>

                <p>${item.description}</p>

                <button class="project-btn"
                        data-id="${item.id}">
                    Explore →
                </button>

            </div>

        </article>
    `;

}