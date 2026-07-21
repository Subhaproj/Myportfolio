function router(){

    const app = document.getElementById("app");

    const hash = window.location.hash || "#/";

    switch(hash){

        case "#/":

            app.innerHTML = renderHome();

            break;

        default:

            app.innerHTML = `
                <div class="container">

                    <h1>Coming Soon</h1>

                </div>
            `;

    }

}