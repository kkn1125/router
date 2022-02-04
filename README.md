# Router

순수 자바스크립트 라우터 테스트

## update list

### v0.2.1

1. 렌더링 두 번 되는 버그 수정

### v0.2.0

1. setPage, setSubPage 메서드 수정 (이전 버전 호환 x)
2. loadModules 메서드 추가 (이전 버전 호환 x)
3. page path 생성 방식 변경
4. subPage 등록 시 해당 subPage에서 origin속성 추가 (자기 자신 Router 참조 가능)
5. Router속성 기존 name, path, page에서 convertedPage 속성 추가
6. hash path 공백, ".", "_", "-" 등 "-"로 변환

#### Detail

> setPage, setSubPage, loadModules

|name|params|desc|return|
|---|---|---|---|
|setPage|pageName:{string}, pathName:{string}, page:{object}|메인 페이지 설정, origin 자동 생성 (hash path 생성)|{Router}|
|setSubPage|pageName:{string}, pathName:{string}, page:{object}|하위 페이지 설정, parent와 origin 자동 연결, 생성 (hash path 생성)|{Router}|
|loadModules|-|모듈 자동 로드, this.module['pagename']으로 사용, 서브페이지 등록 시 공백, ".", "-", "_"이 중간에 있어도 모든 텍스트 붙여서 호출|{LoadModules}|

#### subPage template example

```javascript
// home.js
import {Router} from './core/core.js'

import homesub from './views/pages/home.sub.js'

Router.setSubPage('this is page name', 'home.sub', homesub);

export default {
    module: Router.loadModules,
    template(){
        return `
            <div>
                <div>${this.origin.name}</div>
                <p>
                    ${this.module.homesub.page.path}
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto temporibus tenetur optio sequi earum expedita saepe! Illo iure distinctio, magnam eligendi atque debitis beatae excepturi libero nostrum placeat expedita laboriosam!
                </p>
            </div>
        `
    }
}
```

```javascript
// home.sub.js
export default {
    // title: 'test', // v0.2.0부터 없어도 무방합니다.
    template(){
        return `
            <div>
                <span class="h3">${this.origin.name}</span>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit delectus laboriosam reiciendis consequatur, velit id dolore, dicta eligendi numquam quam quae incidunt praesentium veritatis sapiente molestiae ipsam fugit, nam porro.
                </p>

                <a href="${this.origin.parent.path}">이전으로</a>
            </div>
        `;
    }
}
```

### v0.1.1

1. style : render 시점에 로컬 스타일 지정
2. created : 렌더 되기 전에 설정
3. mounted : 렌더 된 후에 설정
4. setSubPage : 부모 페이지의 하위 페이지 등록 (name, page)
5. setPage : 기존 방식에서 하위 모듈 페이지의 parent 자동 등록

## todo

1. setPage & setPageModule 메서드 -> 타이틀, hash네임 구분 하기
   - ex) setPage(hashname, title, page)
   - hashname = 링크에 달리는 해시 명
   - title = 페이지 타이틀
   - page = 그대로

## 사용법

### CDN

```javascript
/** v0.2.1 */
import core from 'https://cdn.jsdelivr.net/gh/kkn1125/router@v021/src/core/core.js'

/** v0.2.0 */
import core from 'https://cdn.jsdelivr.net/gh/kkn1125/router@v020/src/core/core.js'

/** v0.1.1 */
import core from 'https://cdn.jsdelivr.net/gh/kkn1125/router@v011/src/core/core.js'

/** v0.1.0 */
import core from 'https://cdn.jsdelivr.net/gh/kkn1125/router@v010/src/core/core.js'
```

현재 버전은 `0.1.1`입니다.

### download 기본 시작

```html
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Insert style, script ... -->

        <title>Route</title>
    </head>

    <body>
        <div id="app"></div>
        <!-- Insert scripts... -->
        <script src="./src/script/main.js" type="module"></script>
    </body>
</html>
```

`id`는 아무 값이나 괜찮습니다. `Route.js`에서 `init`할 때 설정합니다.

### Route.js 사용

현재 저장소를 다운받아 사용한다면 짜여진 파일 구조를 참고해서 사용하면 됩니다만 `CDN`을 사용하는 시점에서 설명하겠습니다.

`Route.js`는 레이아웃과 라우터를 받아 사용합니다. 사용할 때 파일을 설정해야하는 영역은 두 가지 입니다.

필요한 핵심 파일은 `core` 디렉토리 내의 파일입니다. `core.js`는 `Router`객체와 `Object`의 프로토타입 메서드가 설정되어 있습니다.

### 파일 구조 예제

> 예제일 뿐이며 편한 방법으로 파일 구조를 바꾸셔도 됩니다.

**파일 구조**

*project*  
　└ **core**  
　　└ core.js (선택)  
　└ **src**  
　　└ routes  
　　　└ router.js (`필수`)  
　└ **views**  
　　└ pages (Main page)  
　　　└ home.js  
　　　└ about.js  
　　　└ 404.js  
　　└ commons (Module page)  
　　　└ nav.js  
　　　└ footer.js  
　└ **assets**  
　　└ main.js  
　└ **index.html**  (`필수`)

설정하는 영역은 크게 세 가지입니다. core디렉토리를 만드는 이유는 긴 주소를 여러 곳에 쓰기보다 다시 내보내기로 짧게 쓰기 위함입니다.

1. `main.js` 에서 `Route` 초기화 실행
1. `routes/router.js` 작성
2. `pages/{pages.js[, about.js [, ...]]}` 페이지 작성

### Rout 초기화

`Route`, `router`, `layout`을 가져옵니다. 그리고 `layout`과 `router`는 초기화 옵션에 전달합니다.

```javascript
// ./main.js

import {Router, Route, Layout} from './core/core.js'
import router from './router.js'

Route.init({
    el: '#app',
    Layout,
    router,
})
```

### routes 설정

페이지와 모듈페이지 등록 방법은 아래와 같으며 부연 설명으로 `Router`의 메서드에 대해 알려드립니다.

```javascript
// ./src/routes/router.js

'use strict';
/**
 * 기본 코어 가져오기
 */
import {Router, Layout} from './core/core.js'

/**
 * 페이지 가져오기
 */
import Home from '../../views/pages/home.js'
import About from '../../views/pages/about.js'

/**
 * 모듈 가져오기 (페이지 공통)
 */
import nav from '../../views/common/nav.js'
import footer from '../../views/common/footer.js'

/**
 * 페이지 등록
 */
Router.setPage('pageName', 'home' Home);
Router.setPage('aboutPage', 'about', About);
// Router.setPage('404', Notfound);
// 기본으로 내장된 404페이지가 있습니다.
// 커스터마이징 하시려면 이렇게 덮어 쓰면 됩니다.

/**
 * 모듈 등록
 */
Router.setModulePage('nav', nav);
Router.setModulePage('footer', footer);

/**
 * layout에 모듈 연결
 */
Layout.module = {
    nav, footer
}

/**
 * page는 전환되는 페이지이므로 이름 달라도 자동으로 매칭
 * nav와 footer는 모듈 등록에서 지정한 이름과 같아야 함
 */
Layout.template(`
    {{nav}}
    {{page}}
    {{footer}}
`);

/**
 * 스프레드 표현식으로 Router를 넘김
 */
export default {
    ...Router
}
```

### page.js 기본 형태

```javascript
// home.js
export default {
    title: 'home', // Router 객체에 지정한 이름과 동일
    // module: {}, // 페이지에 모듈을 지정할 때 // v0.1.1 이전
    style: { // 작성하면 렌더링 시 자동 적용
        // 전역이 아닌 로컬 스타일을 지정합니다. 작성은 다음과 같습니다.
        body: {
            'background-color': 'black',
            color: 'white',
        }
    },
    created() {
        // 아직 렌더링이 되지 않은 상태입니다.
    },
    mounted() {
        // 렌더링이 된 상태입니다.
    },
    template: function() {
        return `
        <div>
            ...
        </div>
        `
    }
}
```

기본적으로 페이지를 작성하는 포멧입니다. `title`, `module`, `template`은 약속된 속성이고, 속성을 변수로 사용하려면 아무 명칭이나 붙여서 `this['blah']`로 사용하면 됩니다.

#### 페이지 함수 사용

메서드를 등록하여 사용할 수도 있습니다.

```javascript
import {Router} from './core/core.js'

import homesub from './views/pages/home.homesub.js'

Router.setPage('homesub', 'home-sub', homesub);
// name=homesub, <a href="#home-sub"></a>

export default {
    title: 'home',
    module: {
        homesub: Router['homesub']
    },
    capitalize(){ // this로 자신의 여러 속성을 참조하여 사용합니다.
        return this.title.charAt(0).toUpperCase() + this.title.split('').slice(1).join('');
    },
    template: function() {
        return `
        <div>
            test
        </div>
        `
    }
}
```

#### 서브페이지 모듈 사용

\* v0.2.0이후 자동 모듈 등록을 위해 부모 페이지 hashPath가 포함되어 이름을 작성해야합니다. 예를 들어 상위 페이지가 `home`이라면 `home.sub`, `home_sub`, `home-sub`, `home sub`, `homesub`로 지정해야합니다.

주요 페이지에 서브페이지 모듈을 사용할 때는 아래와 같습니다.

```javascript
// home.js
import {Router} from '../../core/core.js'
import HomeSub from './home.sub.js'

/**
 * parent 지정은 home.sub.js에서 this.parent로 해쉬 주소 사용
 * 가능하게 합니다.
 * 
 * HomeSub.parent = '#home'; // 0.1.1부터 setSubPage메서드에
 * 자동 등록
 * 
 * Router에 페이지를 등록합니다.
 */
Router.setSubPage('하위 페이지', 'home-sub', HomeSub);

/**
 * home-sub 는 $home_sub로 이름이 치환되어 아래 클로저 내에서
 * this.module.$home_sub 로 사용가능합니다.
 */
export default {
    title: 'home',
    template: function() {
        return `
        <div>
            test
            ${this.module.$home_sub.page.template()}
            띄어쓰기, . , -, _ 등은 모두 언더바(_)로 치환됩니다.
            점을 찍어 사용하기 편하게 하기 위함입니다.
        </div>
        `
    }
}
```

`Router`에 등록된 `Router`객체에서 페이지 정보를 참조하려면 `page`프로퍼티로 사용해야 합니다.

v0.2.0이후로 `setPage`로 페이지 등록 시점에 설정한 `hashPath`를 기준으로 `subPage`의 `hashPath`를 매칭하여 자동 등록합니다.

<del>서브페이지 모듈 부모 페이지처럼 `module`속성를 가질 수 있습니다. `module`속성을 사용한 이유는 한 페이지 내에서 사이드 바나 순차적으로 타고 들어가는 형태의 페이지가 있을 때 쉽고 오고 갈 수 있도록 하기 위함입니다.</del>

> \* v0.2.0부터는 module에 등록했던 파일들을 입력하지 않고 Router.loadModules를 속성값으로 주면 자동으로 매칭하여 등록합니다.

```javascript
// home.sub.js
export default {
    title: 'homesub',
    template: function() {
        return `
        <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consequatur, nam nemo voluptatem illum voluptates eveniet explicabo, labore sit, repudiandae a et fuga quo laboriosam at? Necessitatibus expedita harum distinctio.

            ${this.origin.page} origin은 서브모듈 페이지에서 this를 사용할 때 등록된 자기 자신 Router를 사용할 수 있게 합니다.

            this.origin은 Router[homesub] 과 같습니다.

            <a href="${this.parent}">Go parent</a>
        </div>
        `
    }
}
```

만일 다른 페이지에서 특정 모듈이나 주요페이지의 변수를 공유해야할 때는 아래와 같이 `Router`를 가져와 사용합니다.

```javascript
// other.sub.js
import {Router} from '../../core/core.js'

export default {
    template(){
        return `
            <p>
                this is subpage module.
            </p>
            ${Router.nav.page.menulist()}
            ${Router.home.brand}
            ...
        `
    }
}
```

#### Router methods

|구분|설명|인자|리턴|업데이트 시점|
|---|---|---|---|---|
|setPage|페이지 이름`(name)`과 정보`(page)`를 `Router`인스턴스로 만들어 `Router`에 등록|`pageName:string`, `pathName:string` `page:object`|`void`|v0.2.0|
|setSubPage|하위 페이지 이름`(name)`과 정보`(page)`를 `Router`인스턴스로 만들어 `Router`에 등록|`pageName:string`, `pathName:string` `page:object`|`void`|v0.2.0|
|setModulePage|모듈 페이지 이름과 정보를 `Router`인스턴스로 만들어 `Router`에 보호되도록 등록|`pageName:string`, `pathName:string` `page:object`|`void`|v0.1.1|
|loadModules|부모페이지에서 module속성값으로 사용하고 자동으로 매칭되는 서브페이지를 등록|-|`LoadModules`|v0.2.0|

#### Auto running methods

> 페이지 설정 js 파일 내에서 template외 세가지 특수 속성입니다.

1. style : style을 등록하면 렌더링 되는 로컬만 스타일 스코프를 할 수 있습니다.
2. created : 렌더링 되기 전 등록단계에 실행되고 한 번만 실행이 됩니다.
3. mounted : 렌더링 후 실행이 되며 페이지가 넘어갈 때마다 계속해서 실행됩니다.

**예제**

```javascript
export default {
    created(){
        // 전체 렌더링 시 한 번만 실행
        console.log('test')
    },
    mounted(){
        // 현재 페이지에 올 때마다 실행
        console.log(2);
    },
    template(){
        return `
        <div>
            <span class="h3">test</span>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas error laborum ullam, explicabo vitae accusantium alias ratione aperiam natus cupiditate fuga quaerat recusandae facere harum reiciendis quod iste odio non?
            </p>
        </div>
        `
    }
}
```

## 버그, 제안 등

이슈를 통해 버그나 제안사항을 올려주시면 감사하겠습니다. 불편하신 점 또한 이슈로 주시면 수정하겠습니다 :)

전체 코드를 변경해서 사용법을 매번 고쳐가며 갱신 중 입니다. 많은 관심 부탁드립니다 🙇‍♂️

### 자주 생기는 오류

- `redefined` 문제가 생긴다면 `cdn`과 `import`가 겹쳐있지 않은지 확인바랍니다.
- `replace` 및 `convert`관련 에러가 난다면 페이지 또는 서브페이지 모듈에서 `core.js`가 맞는 경로로 되어 있는지 확인바랍니다.
- `allorigins` 관련 문제는 대부분 포트번호가 `8080`이 아닐 때 발생합니다. 포트번호를 `8080`으로 맞추어 테스트 하시기 바랍니다.

## 블로그

Email <a href="mailto:chapet01@gmail.com">chapet01@gmail.com</a>

[devkimson blog](https://kkn1125.github.io)