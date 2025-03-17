"use strict";

const RSS = require('rss');
const winston = require.main.require('winston');
const db = require.main.require('./src/database');
const topics = require.main.require('./src/topics');
const posts = require.main.require('./src/posts');
const meta = require.main.require('./src/meta');

const controllers = {};

controllers.renderAdmin = async function(req, res) {
    res.render('admin/plugins/yandex-turbo-rss', {});
};

controllers.generateFeed = async function(req, res) {
    try {
        const topicsData = await getRecentTopics();
        const feed = createFeed(topicsData);
        
        res.header('Content-Type', 'application/rss+xml');
        res.send(feed.xml());
    } catch (err) {
        winston.error('[plugin/yandex-turbo-rss] Error generating feed: ' + err.message);
        res.status(500).send('Error generating feed');
    }
};

async function getRecentTopics() {
    const topics = await db.getSortedSetRevRange('topics:recent', 0, 49);
    return await Promise.all(topics.map(async (tid) => {
        const topicData = await topics.getTopicData(tid);
        const mainPost = await posts.getPostData(topicData.mainPid);
        return {
            ...topicData,
            content: mainPost.content
        };
    }));
}

function createFeed(topicsData) {
    const feed = new RSS({
        title: meta.config.title + ' - Yandex Turbo RSS',
        description: meta.config.description,
        feed_url: meta.config.url + '/turbo/feed.rss',
        site_url: meta.config.url,
        generator: 'NodeBB Yandex Turbo RSS Plugin',
        xmlns: {
            turbo: 'http://turbo.yandex.ru'
        }
    });

    topicsData.forEach((topic) => {
        const content = `
            <header>
                <h1>${topic.title}</h1>
            </header>
            <article>
                ${topic.content}
            </article>
        `;

        feed.item({
            title: topic.title,
            description: '<![CDATA[' + content + ']]>',
            url: meta.config.url + '/topic/' + topic.slug,
            date: topic.timestamp,
            custom_elements: [
                {'turbo:content': [
                    {_cdata: content}
                ]}
            ]
        });
    });

    return feed;
}

module.exports = controllers;