"use strict";

const RSS = require('rss');
const controllers = require('./lib/controllers');

const plugin = {};

plugin.init = async function(params) {
    const { router, middleware } = params;
    
    // Setup routes
    const middlewares = [middleware.authenticateRequest];
    
    router.get('/turbo/feed.rss', middlewares, controllers.generateFeed);
    
    router.get('/admin/plugins/yandex-turbo-rss', middleware.admin.buildHeader, controllers.renderAdmin);
    router.get('/api/admin/plugins/yandex-turbo-rss', controllers.renderAdmin);
};

plugin.addAdminNavigation = async function(header) {
    header.plugins.push({
        route: '/plugins/yandex-turbo-rss',
        icon: 'fa-rss',
        name: 'Yandex Turbo RSS'
    });
    return header;
};

module.exports = plugin;