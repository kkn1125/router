'use strict';

const pages = {
    type: (type)=>templates[type],
    item: (type)=>parts[type],
};

const templates = {
    'home': {
        render: function(data, response){
            let cover = ['https://cdn.pixabay.com/photo/2012/12/17/19/14/keyboard-70506_960_720.jpg','https://cdn.pixabay.com/photo/2020/03/28/16/03/dog-4977599_960_720.jpg','https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1853305_960_720.jpg'];
            
            // let hasWeather = setTimeout(getWeather, 100);
            // let maxCount = 10;
            // function getWeather(){
            //     if(window['weather']) {
            //         document.querySelector('.loc').innerHTML = `<div>
            //             ${window['weather'].name} ${window['weather'].main.temp}
            //         </div>`;
            //         clearTimeout(hasWeather);
            //     } else {
            //         if(maxCount < 0) clearTimeout(hasWeather);
            //         else maxCount--;
            //         setTimeout(getWeather, 100);
            //     }
            // }

            return `
                <section page="${response}" style="background-image: url(${cover[parseInt(Math.random()*cover.length)]}); background-size: cover;">
                <!--<div class="home-weather">
                    <div class="home-weather-title">오늘의 날씨</div>
                    <div class="loc"></div>
                </div>-->
                <div class="intro">
                        <div class="profile">
                            <img class="profile-avatar" src="https://avatars.githubusercontent.com/u/71887242?v=4" alt="profile">
                        </div>
                        <div class="h5 capitalize">kimson</div>
                        <div class="intro-content">
                            안녕하세요! 백앤드 개발자가 되기 위해 여러가지에 관심이 많은 예비 개발자입니다.
                        </div>
                    </div>
                </section>
            `;
        }
    },
    'resume': {
        render: function(data, response){
            return `<section page="${response}">
                <div class="h5">resume</div>
                <div class="row-div resume">
                    <img class="resume-avatar" src="https://www.saramin.co.kr/zf_user/persons/picture?idx=8461393|f171125f2cc0c37cc4d9b5c12f78d29fce14120b1b62bf8b744dec097d7880d2" alt="profile">
                    <span class="info-table">
                        <ul>
                            <li><span>name</span><span>김경남</span></li>
                            <li><span>age</span><span>29</span></li>
                            <li><span>email</span><span>chaplet01@gmail.com</span></li>
                        </ul>
                    </span>
                </div>
                <div class="row-div work-exp">
                    <div class="h6">work experience</div>
                </div>
            </section>`;
        }
    },
    'about': {
        render: function(data, response){
            return `<section page="${response}">
                <div class="h5">about</div>
                <div class="row-div">
                    <div class="h6">이 사이트는</div>
                    <p>취미로 무언가를 만들어 내는 것을 좋아합니다. 자바스크립트로 SPA를 제작하는 것에 관심이 많습니다. 다양한 방법으로 시도하고 경험하며 자기계발을 합니다.</p>
                    <p>자바를 주 언어로 공부하고 있으며, 알고리즘, CS, 디자인 패턴 등의 내용을 위키와 블로그에 함께 기록하고있습니다.</p>
                    <p>블로그와 위키를 함께 관리하고 있으니 많은 관심 가져주시기를 바랍니다.</p>
                </div>
                <div class="row-div">
                    <div class="h6">다른 내용</div>
                    <p>
                        <a href="https://kkn1125.github.io">블로그</a>
                        <a href="https://kkn1125.github.io/wikimson">위키</a>
                    </p>
                </div>
            </section>`;
        }
    },
    '404': {
        render: function(data, response){
            return `<section page="${response}">
                <div class="text-center">
                    <div class="h1">404</div>
                    <div class="h6">Not Found</div>
                    <div class="errorMsg">${data.message}</div>
                </div>
            </section>`;
        }
    }
}

const parts = {
    'paging': {
        render: function(hash){
            const pagelist = Object.keys(router).filter(page=>page!='404');
            const isStart = pagelist.indexOf(hash.slice(1));
            return `<div class="side-paging">
                <div>
                    <button class="btn" data-dir="prev"${isStart==0?' hidden':''}>
                        <i class="fas fa-chevron-left fa-2x"></i>
                    </button>
                    <button class="btn" data-dir="next"${isStart==pagelist.length-1?' hidden':''}>
                        <i class="fas fa-chevron-right fa-2x"></i>
                    </button>
                </div>
            </div>`;
        }
    },
    'menu': {
        render: function(){
            return `<div class="side-menu">
                <button class="menu"><i class="fas fa-bars fa-2x"></i></button>
            </div>
            <nav id="side-menu">
                <ul class="font-gugi">
                    ${Object.keys(router).filter(page=>page!='404').map(page=>`<li><a href="#${page}" class="page">${page}</a></li>`).join('')}
                </ul>
            </nav>`;
        }
    }
}