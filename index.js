'use strict';

/** [enb-headless-chrome-testing](https://github.com/direct-adv-interfaces/enb-headless-chrome-testing) */

const vow = require('vow');
const vowFs = require('vow-fs');
const runner = require('mocha-headless-chrome');

const Queue = require('promise-queue');

Queue.configure(vow.Promise);

const MAX_INSTANCES = require('os').cpus().length;
const MAX_QUEUE = Infinity;

let queue = new Queue(MAX_INSTANCES, MAX_QUEUE);

module.exports = require('enb/lib/build-flow').create()
    .name('headless-chrome-testing')
    .target('target', '?.test-result.json')
    .defineOption('headless', true)
    .dependOn('html', '?.html')
    .methods({
        resolveTargetPath: function(target) {
            let nodePath = this.node.getPath();
            let targetFileName = this.node.unmaskNodeTargetName(nodePath, target);

            return this.node.resolvePath(targetFileName);
        }
    })
    .builder(function() {
        let htmlPath = this.resolveTargetPath(this._html);

        return queue.add(() =>
            runner({
                file: htmlPath,
                reporter: 'none',
                visible: !this._headless,
                args: ['no-sandbox']
            }).then(obj => JSON.stringify(obj, null, 2)));
    })
    .needRebuild(function() { return true })
    .createTech();
