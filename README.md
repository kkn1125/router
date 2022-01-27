# Router

순수 자바스크립트 라우터 테스트

## 사용법

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
        <script src="/cdnPath"></script>
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

설정하는 영역은 크게 세 가지입니다.

1. `main.js` 에서 `Route` 초기화 실행
1. `routes/router.js` 작성
2. `pages/{pages.js[, about.js [, ...]]}` 페이지 작성

### Rout 초기화

`Route`, `router`, `layout`을 가져옵니다. 그리고 `layout`과 `router`는 초기화 옵션에 전달합니다.

```javascript
// ./main.js

import Route from '../../src/core/Route.js'
import router from '../../src/routes/router.js'
import layout from '../../src/core/layout.js'

Route.init({
    el: '#app',
    layout,
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
import {Router} from '../core/core.js'
import layout from '../core/layout.js'

/**
 * 페이지 가져오기
 */
import Home from '../../views/pages/home.js'
import About from '../../views/pages/about.js'
import Notfound from '../../views/pages/404.js'

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
Router.setPage('404', Notfound);
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
layout.module = {
    nav, footer
}

/**
 * page는 전환되는 페이지이므로 이름 달라도 자동으로 매칭
 * nav와 footer는 모듈 등록에서 지정한 이름과 같아야 함
 */
layout.template(`
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

#### Router methods

|구분|설명|인자|리턴|
|---|---|---|---|
|setPage|페이지 이름`(name)`과 정보`(page)`를 Router인스턴스로 만들어 Router에 등록|`name:string`, `page:object`|`void`|
|setModulePage|모듈 페이지 이름과 정보를 Router인스턴스로 만들어 Router에 보호되도록 등록|`name:string`, `page:object`|`void`|

## 버그, 제안 등

이슈를 통해 버그나 제안사항을 올려주시면 감사하겠습니다. 불편하신 점 또한 이슈로 주시면 수정하겠습니다 :)

전체 코드를 변경해서 사용법을 매번 고쳐가며 갱신 중 입니다. 많은 관심 부탁드립니다 🙇‍♂️

## 블로그

email <a href="mailto:chapet01@gmail.com">chapet01@gmail.com</a>

[devkimson blog](https://kkn1125.github.io)