export default {
    title: 'homesub',
    template: function (){
        return `
            <div class="main">
                <main>
                    <div class="fence-full">
                        <span class="h1">${this.title}</span>
                        <p>
                            <a href="#${this.title}">${this.title}</a>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis accusamus nulla incidunt suscipit ipsam quis, vel in alias rerum, expedita reprehenderit est iusto sint, unde voluptatibus atque dolorum quam possimus?
                            <a href="${this.parent.path}">이전으로</a>
                        </p>
                    </div>
                </main>
            </div>
        `
    }
}