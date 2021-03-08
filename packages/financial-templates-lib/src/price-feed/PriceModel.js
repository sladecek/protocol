const assert = require("assert");

class PriceModel {
  /*
   * @notice Constructs new price model.
   * @param {Object} coefs Dictionary of model coefficients.
   * @return None or throws an Error.
   */
  constructor(coefs) {
    // Assert required inputs.
    assert(coefs, "this.coefs required");

    this.coefs = coefs;
  }

  evaluate(redemptionPrice, redemptionRate, time) {
    const q = this.coefs.q || 1e12;
    const c = this.coefs.c || 0;
    const r = this.coefs.r || 0;
    const p = this.coefs.p || 0;
    const t = this.coefs.t || 0;

    const rr = this.coefs.rr || 0;
    const pp = this.coefs.pp || 0;
    const tt = this.coefs.tt || 0;

    const pt = this.coefs.pt || 0;
    const pr = this.coefs.pr || 0;
    const rt = this.coefs.rt || 0;

    const l = this.coefs.l || 0;

    let result =
      (c +
        redemptionPrice * (p + pp * redemptionPrice + pr * redemptionRate + pt * time) +
        redemptionRate * (r + rr * redemptionRate + rt * time) +
        time * (t + tt * time)) /
      q;

    // Clamp result to range
    if (result < l) {
      return l;
    }

    if (this.coefs.h && result > this.coefs.h) {
      return this.coefs.h;
    }

    return Math.round(result);
  }
}

module.exports = {
  PriceModel
};
