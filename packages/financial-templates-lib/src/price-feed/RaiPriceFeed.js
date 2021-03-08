const { PriceFeedInterface } = require("./PriceFeedInterface");
const { PriceModel } = require("../../src/price-feed/PriceModel");
const { BlockFinder } = require("./utils");
const assert = require("assert");

class RaiPriceFeed extends PriceFeedInterface {
  /**
   * @notice Constructs new price feed object that tracks the share price of a RAI https://reflexer.finance .
   * @param {Object} coefs Dictionary of BigInt model coefficients.
   * @param {Object} logger Winston module used to send logs.
   * @param {Object} RaiAbi RAI OracleRelay abi object to create a contract instance.
   * @param {Object} web3 Provider from Truffle instance of to connect to Ethereum network.
   * @param {String} RaiAddress Ethereum address of OracleRelay to monitor.
   * @param {Function} getTime Returns the current time.
   * @param {Function} [blockFinder] Optionally pass in a shared blockFinder instance (to share the cache).
   * @param {Integer} [minTimeBetweenUpdates] Minimum amount of time that must pass before update will actually run
   *                                        again.
   * @return None or throws an Error.
   */
  constructor({ coefs, logger, RaiAbi, web3, RaiAddress, getTime, blockFinder, minTimeBetweenUpdates = 60 }) {
    super();

    // Assert required inputs.
    assert(coefs, "coefs required");
    assert(logger, "logger required");
    assert(RaiAbi, "RaiAbi required");
    assert(web3, "web3 required");
    assert(RaiAddress, "RaiAddress required");
    assert(getTime, "getTime required");

    this.model = new PriceModel(coefs);
    this.logger = logger;
    this.web3 = web3;

    this.Rai = new web3.eth.Contract(RaiAbi, RaiAddress);
    this.uuid = `Rai-${RaiAddress}`;
    this.getTime = getTime;
    this.minTimeBetweenUpdates = minTimeBetweenUpdates;
    this.blockFinder = blockFinder || BlockFinder(web3.eth.getBlock);
  }

  getCurrentPrice() {
    return this.price;
  }

  async getHistoricalPrice(time) {
    const block = await this.blockFinder.getBlockForTimestamp(time);
    return this._getPrice(block.number, time);
  }

  getLastUpdateTime() {
    return this.lastUpdateTime;
  }

  getLookback() {
    // Return infinity since this price feed can technically look back as far as needed.
    return Infinity;
  }

  getPriceFeedDecimals() {
    return 9;
  }

  async update() {
    const currentTime = await this.getTime();
    if (this.lastUpdateTime === undefined || currentTime >= this.lastUpdateTime + this.minTimeBetweenUpdates) {
      this.price = await this._getPrice("latest", currentTime);
      this.lastUpdateTime = currentTime;
    }
  }

  async _getPrice(blockNumber, timestamp) {
    const redemptionPriceRaw = await this.Rai.methods.redemptionPrice().call(undefined, blockNumber);
    const redemptionPrice = this._convertRai2Bn(redemptionPriceRaw);
    const redemptionRateRaw = await this.Rai.methods.redemptionRate().call(undefined, blockNumber);
    const redemptionRate = this._convertRai2Bn(redemptionRateRaw);

    const resultFl = this.model.evaluate(redemptionPrice, redemptionRate, Number(timestamp));
    const BN = this.web3.utils.BN;
    const result = new BN(String(resultFl));

    console.log(
      "redemptionPrice=" +
        redemptionPrice +
        " redemptionRate=" +
        redemptionRate +
        " result=" +
        result +
        " " +
        typeof result +
        " coefs=" +
        JSON.stringify(this.model.coefs)
    );
    return result;
  }

  _convertRai2Bn(value) {
    const one = 1e27;
    const valueNr = Number(value);
    if (valueNr > one / 2) {
      return valueNr - one;
    }
    return valueNr;
  }
}

module.exports = {
  RaiPriceFeed
};
