const provideFile = require('enb/techs/file-provider');
const chromeTesting = require('../index');

module.exports = function(config) {

    config.nodes('test', node => {

        node.addTechs([
            [provideFile, { target: '?.html' } ],
            [chromeTesting]
        ]);

        node.addTargets(['?.test-result.json']);
    });
};
