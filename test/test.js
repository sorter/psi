'use strict';
/* eslint-env mocha */
var assert = require('assert');
var chalk = require('chalk');
var response = require('./fixtures/response');
var output = require('../lib/output');
var psi = require('../');

describe('Formatting', function () {
  beforeEach(function () {
    this.log = console.log;
    this.formattedOutput = '';

    console.log = function (content) {
      this.formattedOutput += content + '\n';
      this.log(content);
    }.bind(this);
  });

  afterEach(function () {
    console.log = this.log;
  });

  it('should correctly format PageSpeed Insights response', function () {
    return output({strategy: 'desktop'}, response).then(function () {
      assert(/Speed: +88/.test(chalk.stripColor(this.formattedOutput)));
    }.bind(this));
  });

  it('should format PageSpeed Insights response as TAP output', function () {
    return output({strategy: 'desktop', format: 'tap'}, response).then(function () {
      assert(/ok 1 - psi/.test(chalk.stripColor(this.formattedOutput)));
    }.bind(this));
  });

  it('should format PageSpeed Insights response as JSON output', function () {
    return output({strategy: 'desktop', format: 'json'}, response).then(function () {
      assert(/"Speed": 88/.test(chalk.stripColor(this.formattedOutput)));
    }.bind(this));
  });

  it('should have an error in the callback if threshold is not met', function () {
    return output({threshold: 100}, response).catch(function (err) {
      return err;
    }).then(function (err) {
      assert.equal(err.name, 'Error', 'Expected an error.');
    });
  });
});

describe('API', function () {
  this.timeout(50000);

  it('should get data from PageSpeed Insights', function () {
    return psi('google.com').then(function (data) {
      assert.strictEqual(data.title, 'Google');
    });
  });

  it('should support options', function () {
    return psi('google.com', {locale: 'no'}).then(function (data) {
      assert.strictEqual(data.formattedResults.locale, 'no');
    });
  });
});
