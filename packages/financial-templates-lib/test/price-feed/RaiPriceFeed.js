const winston = require("winston");

const { RaiPriceFeed } = require("../../src/price-feed/RaiPriceFeed");
const { getTruffleContract } = require("@uma/core");

const CONTRACT_VERSION = "latest";

const RaiMock = getTruffleContract("RaiMock", web3, CONTRACT_VERSION);
const RaiInterface = getTruffleContract("RaiInterface", web3, CONTRACT_VERSION);

contract("RaiPriceFeed.js", function(accounts) {
  const owner = accounts[0];

  let raiMock;
  let raiPriceFeed;
  let mockTime = 0;
  let dummyLogger;

  beforeEach(async function() {
    raiMock = await RaiMock.new({ from: owner });

    dummyLogger = winston.createLogger({
      level: "info",
      transports: [new winston.transports.Console()]
    });

    raiPriceFeed = new RaiPriceFeed({
      coefs: { r: 1, c: 1e18 },
      logger: dummyLogger,
      web3,
      getTime: () => mockTime,
      RaiAbi: RaiInterface.abi,
      RaiAddress: raiMock.address
    });
  });

  it("Basic current price", async function() {
    await raiMock.setRedemptionPriceAndRate("0", "999999999874279187558202799");
    await raiPriceFeed.update();

    assert.equal(raiPriceFeed.getCurrentPrice().toString(), "874279");
  });

  it("Correctly selects most recent price", async function() {
    await raiMock.setRedemptionPriceAndRate("0", "999999999874279187558202799");
    await raiMock.setRedemptionPriceAndRate("0", "999999999774279187558202799");
    await raiMock.setRedemptionPriceAndRate("0", "999999999674279187558202799");
    await raiPriceFeed.update();

    assert.equal(raiPriceFeed.getCurrentPrice().toString(), "674279");
  });

  it("PriceFeedDecimals", async function() {
    assert.equal(raiPriceFeed.getPriceFeedDecimals(), 9);
  });
});
