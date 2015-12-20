'use strict';

describe('Service: getIndexOfObject', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var getIndexOfObject;
  beforeEach(inject(function (_getIndexOfObject_) {
    getIndexOfObject = _getIndexOfObject_;
  }));

  it('should do something', function () {
    expect(!!getIndexOfObject).toBe(true);
  });

});
