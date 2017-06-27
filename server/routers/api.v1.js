(function() {
    'use strict'

    var express = require('express');

    var trendByTime = require('../methods/fetch-trend-by-time.js');

    var defaultChar = 'x';
    var keywordSepChar = '&';

    var apiRouter = express.Router();

    var apiRE = (function() {
        var indexRE = 'by(time)';
        var keywordRE = [
            '(',
            '\\w+',
            '(?:',
            keywordSepChar,
            '\\w+',
            ')',
            '{0,4}',
            ')',
        ].join('');
        var timestampRE = [
            '(',
            '\\d{10}',
            '|',
            defaultChar,
            ')',
        ].join('');
        var maybeSlash = '(?:\\/)?';

        var re = new RegExp([
            '^\\/',
            [
                indexRE,
                keywordRE,
                timestampRE,
                timestampRE,
            ].join('\\/'),
            maybeSlash,
            '$',
        ].join(''));

        return re;
    }());

    var parseKeywords = function(kwParam) {
        var keywords = kwParam.split(keywordSepChar);
        return keywords;
    };

    var parseTimes = function(startParam, stopParam) {
        var times = {};

        if (startParam !== defaultChar) {
            times.start = startParam;
        }

        if (stopParam !== defaultChar) {
            times.stop = stopParam;
        }

        return times;
    };

    apiRouter
        .use(function(req, res, next) {
            console.log('API request made');
            next();
        })
        .get(apiRE, function(req, res) {
            var keywords = parseKeywords(req.params[1]);
            var times = parseTimes(req.params[2], req.params[3]);
            trendByTime(keywords, times).then(function(data) {
                res.json(data);
            });
        });

    module.exports = apiRouter;

}());
