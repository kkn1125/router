# router

router test in pure javascript

## 사용법

### 페이징처리 태그 지정

```html
<!-- index.html -->
<main id="app"></main>
```

`main`태그에 `id`를 `app`으로 부여합니다. 벗어난 설정 시 에러를 발생시킬 수 있습니다.

### 페이지 설정

변수명 `router`에 넣고자하는 페이지를 객체로 넣습니다. 빈 객체여야합니다.

```javascript
const router = {
    home: {},
    test: {},
    about: {},
    404: {}
}
```

로직처리에서 각 속성들에 내용을 특정 내용이 덮어씌워지기 때문에 빈 객체로 지정합니다.

### 뷰 페이지 html 파일 생성

먼저 `pages`폴더를 생성하고 폴더 내에 만들고자하는 페이지를 `html`로 생성합니다. 예를 들어 `home`이라는 `router`속성을 만들었다면, `pages`폴더에 `home.html`으로 같은 이름을 가지도록 만듭니다.

### 페이지에서 javascript 표현식 사용하기

생성된 html을 화면에 보여주는 설정은 아래와 같습니다.

```javascript
const templates = {
    home: {
        render: function(data, response, motion, connect){
            let arge = {
                // 사용할 변수 설정
            };

            connect(args, response, motion);
        }
    },
    // 다른 페이지들
}
```

페이지 렌더 설정은 위의 형태로 설정되어야하며, `args`는 필수로 선언되어야합니다.

선언되는 `args`의 역할은 `html`페이지에서 `${...}`를 사용할 수 있도록 해줍니다. 이때 변수를 전달하는 방법을 알려드리겠습니다. 변수의 전달은 `args`객체를 만들어 내부에 속성으로 전달하게됩니다. 사용은 `html`에서 `${...}`로 사용하고 `args`를 뺀 속성명만으로 사용합니다.

```javascript
const templates = {
    home: {
        render: function(data, response, motion, connect){
            let arge = {
                test: 123 // 사용할 변수 설정
            };

            connect(args, response, motion);
        }
    },
}
```

```html
<!-- home.html -->
<div>
    전달받은 변수값 test: ${test}
    <!-- 123이 출력됩니다. args.test (x) -->
</div>
```

아래는 페이지 렌더영역을 생성하는 예제입니다.

```javascript
const templates = {
    home: {
        render: function (data, response, motion, connect) {
            let args = {
                cover: ['https://cdn.pixabay.com/photo/2012/12/17/19/14/keyboard-70506_960_720.jpg', 'https://cdn.pixabay.com/photo/2020/03/28/16/03/dog-4977599_960_720.jpg', 'https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1853305_960_720.jpg'],
            };

            connect(args, response, motion);
        }
    },
    test: {
        render: async function (data, response, motion, connect) {
            let args = {
                test: 123
            };

            connect(args, response, motion);
        }
    },
    about: {
        render: function (data, response, motion, connect) {
            let args = {};

            connect(args, response, motion);
        }
    }
}
```

### 페이지 공통요소

네비게이션이나 푸터등 공통되는 요소가 있을 때에는 `parts`폴더를 생성하고, 폴더 내에 `html`파일을 생성합니다. `parts`의 연결 구문 형태는 아래와 같습니다.

```javascript
const parts = {
    paging: {
        render: function (hash, connect) {
            let args = {};

            connect(args, hash);
        }
    },
    // 더 많은 요소들
}
```

아래는 예제 코드입니다.

```javascript
const parts = {
    paging: {
        render: function (hash, connect) {
            let args = {};
            connect(args, hash);
        }
    },
    menu: {
        render: function (hash, connect) {
            let args = {};
            connect(args, hash);
        }
    }
};
```

### 설정 내용 실행

내용의 실행은 아래와 같습니다. 위의 옵션을 모두 설정하셨다면 아래와 같이 초기화 메서드를 실행하면 됩니다.

```javascript
let routers = Router.init({
    router,
    templates,
    parts
});
```

## 버그, 제안 등

이슈를 통해 버그나 제안사항을 올려주시면 감사하겠습니다. 불편하신 점 또한 이슈로 주시면 수정하겠습니다 :)

## 블로그

email <a href="mailto:chapet01@gmail.com">chapet01@gmail.com</a>
[devkimson blog](https://kkn1125.github.io)