# Router

순수 자바스크립트 라우터 테스트

## 사용법

### CDN

```html
<!-- v0.1.0 -->
<script src="https://cdn.jsdelivr.net/gh/kkn1125/router@v010/src/core/core.js" integrity="sha384-OzEJH1cHc5qA+NkORhcUCVHrE/kTInMCailvJggUiTMd8N5juIcpbKl6Ar7dbXOp" crossorigin="anonymous"></script>
```

현재 버전은 `0.1.0`입니다.

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

### CDN 기본 시작

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
        <script src="./main.js"></script>
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
Router.setPage('home', Home);
Router.setPage('about', About);
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
    module: {}, // 페이지에 모듈을 지정할 때
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

주요 페이지에 서브페이지 모듈을 사용할 때는 아래와 같습니다.

```javascript
// home.js
import {Router} from '../../core/core.js'
import HomeSub from './home.sub.js'

// parent 지정은 home.sub.js에서 this.parent로 해쉬 주소 사용 가능하게 합니다.
HomeSub.parent = '#home';
// Router에 페이지를 등록합니다.
Router.setPage('homesub', HomeSub);

export default {
    title: 'home',
    module: {
        homesub: Router['homesub']
    },
    template: function() {
        return `
        <div>
            test
            ${this.module.homesub.page.template()}
        </div>
        `
    }
}
```

`Router`에 등록된 `Router`객체에서 페이지 정보를 참조하려면 `page`프로퍼티로 사용해야 합니다.

서브페이지 모듈 부모 페이지처럼 `module`속성를 가질 수 있습니다. `module`속성을 사용한 이유는 한 페이지 내에서 사이드 바나 순차적으로 타고 들어가는 형태의 페이지가 있을 때 쉽고 오고 갈 수 있도록 하기 위함입니다.

```javascript
// home.sub.js
export default {
    title: 'homesub',
    template: function() {
        return `
        <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consequatur, nam nemo voluptatem illum voluptates eveniet explicabo, labore sit, repudiandae a et fuga quo laboriosam at? Necessitatibus expedita harum distinctio.
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

|구분|설명|인자|리턴|
|---|---|---|---|
|setPage|페이지 이름`(name)`과 정보`(page)`를 Router인스턴스로 만들어 Router에 등록|`name:string`, `page:object`|`void`|
|setModulePage|모듈 페이지 이름과 정보를 Router인스턴스로 만들어 Router에 보호되도록 등록|`name:string`, `page:object`|`void`|

## 버그, 제안 등

이슈를 통해 버그나 제안사항을 올려주시면 감사하겠습니다. 불편하신 점 또한 이슈로 주시면 수정하겠습니다 :)

전체 코드를 변경해서 사용법을 매번 고쳐가며 갱신 중 입니다. 많은 관심 부탁드립니다 🙇‍♂️

### 자주 생기는 오류

- `redefined` 문제가 생긴다면 `cdn`과 `import`가 겹쳐있지 않은지 확인바랍니다.
- `replace` 및 `convert`관련 에러가 난다면 페이지 또는 서브페이지 모듈에서 `core.js`가 맞는 경로로 되어 있는지 확인바랍니다.

## 블로그

Email <a href="mailto:chapet01@gmail.com">chapet01@gmail.com</a>

[devkimson blog](https://kkn1125.github.io)