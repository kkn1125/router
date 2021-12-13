'use strict';

const router = {
    home: {},
    test: {},
    about: {},
    404: {}
}

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

let routers = Router.init({
    router,
    templates,
    parts
});