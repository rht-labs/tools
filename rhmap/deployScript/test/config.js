'use strict';

var config = require('../config.js');

describe('config', function () {
  it('should retrieve the default config', function (done) {
    var defaultConfig = config.getConfig();
    //console.log(defaultConfig);
    defaultConfig.project.name.should.equal('ph-mbaas-test');
    defaultConfig.project.environments.length.should.equal(3);
    defaultConfig.project.template.should.equal('fh-mbaas-template-1node.json');
    done();

  });

  it('should update the default config', function (done) {
    var defaultConfig = config.getConfig();
    var updatedConfig;
    defaultConfig.customField = 'Custom Field';
    config.update(defaultConfig);
    updatedConfig = config.getConfig();
    updatedConfig.customField.should.equal('Custom Field');
    done();

  });
});

