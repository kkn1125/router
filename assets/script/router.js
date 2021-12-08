'use strict';

const router = {
    'home': {
        referrer: document.referrer,
        select: (page) => pages.type(page),
    },
    'resume': {
        referrer: document.referrer,
        select: (page) => pages.type(page),
    },
    'about': {
        referrer: document.referrer,
        select: (page) => pages.type(page),
    },
    '404': {
        referrer: document.referrer,
        select: (page) => pages.type(page),
    }
};