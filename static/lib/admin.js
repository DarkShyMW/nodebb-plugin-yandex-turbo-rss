'use strict';

define('admin/plugins/yandex-turbo-rss', ['settings'], function(Settings) {
    var ACP = {};

    ACP.init = function() {
        // You can add settings handling here if needed
        console.log('Yandex Turbo RSS ACP loaded');
    };

    return ACP;
});