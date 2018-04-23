'use strict';

/** [enb-headless-chrome-testing](https://github.com/direct-adv-interfaces/enb-headless-chrome-testing) */

const vow = require('vow');
const {runner} = require('mocha-headless-chrome');

const Queue = require('promise-queue');

Queue.configure(vow.Promise);

const CHROME_PATH = process.env.DEV_CHROME_PATH;
const MAX_INSTANCES = Number(process.env.MAX_CHROME_INSTANCES) || require('os').cpus().length;
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
        let opts = {
            file: htmlPath,
            reporter: 'none',
            visible: !this._headless,
            args: ['no-sandbox']
        };

        CHROME_PATH && (opts.executablePath = CHROME_PATH);

        return queue.add(() => runner(opts)
            .then(obj => JSON.stringify(obj, null, 2)));
    })
    .needRebuild(function() { return true })
    .createTech();
