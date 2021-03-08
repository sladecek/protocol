const { PriceModel } = require("../../src/price-feed/PriceModel");

describe("PriceModel", function() {
  it("should return 0 when all coefs are zero", function() {
    const pm = new PriceModel({});
    assert.equal(0, pm.evaluate(10, 100, 1000));
  });

  it("should clamp down to 'l' coef", function() {
    const pm = new PriceModel({ c: 6, q: 3, l: 3 });
    assert.equal(3, pm.evaluate(10, 100, 1000));
  });

  it("should clamp up to 'h' coef", function() {
    const pm = new PriceModel({ c: 6, q: 3, h: 1 });
    assert.equal(1, pm.evaluate(10, 100, 1000));
  });

  it("should return c/q when all other coefs are zero", function() {
    const pm = new PriceModel({ c: 6, q: 3 });
    assert.equal(2, pm.evaluate(10, 100, 1000));
  });

  it("should use default q equal to 10^12 when no q is given", function() {
    const pm = new PriceModel({ c: 1e13 });
    assert.equal(10, pm.evaluate(10, 100, 1000));
  });

  it("should correctly use linear coefficients p,r,t", function() {
    const pm = new PriceModel({ p: 2, r: 3, t: 5, q: 1 });
    assert.equal(5320, pm.evaluate(10, 100, 1000));
  });

  it("should correctly use quadratic coefficients pp,rr,tt", function() {
    const pm = new PriceModel({ pp: 2, rr: 3, tt: 5, q: 1 });
    assert.equal(5030200, pm.evaluate(10, 100, 1000));
  });

  it("should correctly use pr coefficient", function() {
    const pm = new PriceModel({ pr: 2, q: 1 });
    assert.equal(2000, pm.evaluate(10, 100, 1000));
  });

  it("should correctly use pr coefficient", function() {
    const pm = new PriceModel({ pt: 2, q: 1 });
    assert.equal(20000, pm.evaluate(10, 100, 1000));
  });

  it("should correctly use rt coefficient", function() {
    const pm = new PriceModel({ rt: 2, q: 1 });
    assert.equal(200000, pm.evaluate(10, 100, 1000));
  });
});
