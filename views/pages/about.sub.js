export default {
    title: 'aboutsub',
    template: function (){
        return `
            <div class="main">
                <main>
                    <div class="fence-full">
                        <span class="h1">${this.origin.name}</span>
                        <p>
                            <a href="${this.origin.path}">${this.origin.name}</a>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis accusamus nulla incidunt suscipit ipsam quis, vel in alias rerum, expedita reprehenderit est iusto sint, unde voluptatibus atque dolorum quam possimus?
                            <a href="${this.parent.path}">이전으로</a>
                        </p>
                    </div>
                </main>
            </div>
        `
    }
}