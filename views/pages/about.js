'use strict';

export default {
    title: 'about',
    template: function() {
        return `
        <div class="main">
            <main>
                <div class="fence-full">
                    <div>
                        <span class="h1">${this.title}</span>
                    </div>
                    <p>
                        <a href="#home">home</a>
                        <a href="#about">about</a>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, deserunt obcaecati at reiciendis assumenda asperiores architecto eos maxime aut nesciunt, reprehenderit odit sunt quas mollitia corrupti adipisci, quos et quisquam!
                    </p>
                </div>
            </main>
        </div>
        `
    }
}