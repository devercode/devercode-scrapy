import { Curl } from "../curl";
import path from "path";
import { Scraper, ScraperError, ScraperRequestError } from "..";
describe("Curl", () => {
  const curl = new Curl();
  const scraper = new Scraper(curl);
  it("can access blur", async () => {
    const testUrl = "https://core-api.prod.blur.io/auth/challenge";
    const res = await scraper.post(
      testUrl,
      {
        walletAddress: "0xdb9ece7aab0ddbb78b59f44b0bef9539cfeaf203",
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    expect(res.status).toEqual(201);
  });

  it(`Can use auth proxy`, async () => {
    scraper.useProxy("http://jnunknlz:bhs71x4u0ay8@45.41.177.87:5737");
    const { data } = await scraper.get<string>("https://www.showmyip.com");
    expect(data.includes("45.41.177.87")).toBeTruthy();
  });
  it(`can use rotating proxy`, async () => {
    scraper.useProxy("http://69.46.80.226:8150");
    const { data } = await scraper.get("https://www.showmyip.com");
  });
  it("Can handle proxy error", async () => {
    try {
      scraper.useProxy("http://jnsunknlz:bhs71x4u0ay8@45.41.177.87:5737");
      await scraper.get("https://www.showmyip.com");
    } catch (err) {
      expect(err instanceof ScraperError).toBeTruthy();
    }
  });

  it("can handle bad request", async () => {
    scraper.useProxy("http://jnunknlz:bhs71x4u0ay8@192.241.94.76:7631");
    const testUrl = "https://core-api.prod.blur.io/auth/challenge";
    try {
      await scraper.post(
        testUrl,
        {
          walletAddress: "wrong addres",
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
    } catch (err) {
      expect(err instanceof ScraperRequestError).toBeTruthy();
    }
  });
  it("can test with opensea", async () => {
    scraper.useProxy("http://jnunknlz:bhs71x4u0ay8@104.232.209.149:6107");

    async function getAssetID(contractAddress, tokenId) {
      const data = {
        id: "AssetPageQuery",
        query:
          "query AssetPageQuery(\n  $tokenId: String!\n  $contractAddress: AddressScalar!\n  $chain: ChainScalar!\n) {\n  nft(tokenId: $tokenId, contractAddress: $contractAddress, chain: $chain) {\n    ...ItemCardAnnotations\n    ...ItemCardAnnotations__accountInfo_2V84VL\n    ...asset_display_name\n    ...ContentAuthenticity_data\n    assetContract {\n      address\n      chain\n      ...CollectionLink_assetContract\n      id\n    }\n    assetOwners(first: 1) {\n      edges {\n        node {\n          quantity\n          owner {\n            ...AccountLink_data\n            id\n          }\n          id\n        }\n      }\n      count\n    }\n    creator {\n      ...AccountLink_data\n      id\n    }\n    animationUrl\n    backgroundColor\n    collection {\n      description\n      displayData {\n        cardDisplayStyle\n      }\n      hidden\n      imageUrl\n      name\n      slug\n      ...CollectionLink_collection\n      ...Boost_collection\n      ...Property_collection\n      ...NumericTrait_collection\n      ...SocialBar_data\n      id\n    }\n    decimals\n    description\n    imageUrl\n    name\n    numVisitors\n    isDelisted\n    isListable\n    isReportedSuspicious\n    isBiddingEnabled {\n      value\n      reason\n    }\n    relayId\n    tokenId\n    hasUnlockableContent\n    favoritesCount\n    traits(first: 100) {\n      edges {\n        node {\n          relayId\n          displayType\n          floatValue\n          intValue\n          traitType\n          value\n          ...Boost_trait\n          ...Property_trait\n          ...NumericTrait_trait\n          ...Date_trait\n          id\n        }\n      }\n    }\n    ...AssetMedia_asset\n    ...Toolbar_asset\n    ...asset_url\n    ...itemEvents_data\n    ...itemEvents_viewItem_data\n    ...AssetDetails_data_4iqQ9J\n    ownedQuantity(identity: {})\n    totalQuantity\n    ...TradeStation_archetype_4iqQ9J\n    id\n  }\n  tradeSummary(archetype: {assetContractAddress: $contractAddress, tokenId: $tokenId, chain: $chain}) {\n    bestAsk {\n      closedAt\n      orderType\n      maker {\n        ...wallet_accountKey\n        id\n      }\n      relayId\n      id\n    }\n    ...TradeStation_data\n  }\n  assetEvents(archetype: {assetContractAddress: $contractAddress, tokenId: $tokenId, chain: $chain}, first: 11) {\n    edges {\n      node {\n        relayId\n        id\n      }\n    }\n  }\n  tradeLimits(chain: $chain) {\n    ...TradeStation_tradeLimits\n  }\n}\n\nfragment AccountLink_data on AccountType {\n  address\n  config\n  isCompromised\n  user {\n    publicUsername\n    id\n  }\n  displayName\n  ...ProfileImage_data\n  ...wallet_accountKey\n  ...accounts_url\n}\n\nfragment AssetCardBuyNow_data on AssetType {\n  tokenId\n  relayId\n  assetContract {\n    address\n    chain\n    id\n  }\n  orderData {\n    bestAskV2 {\n      relayId\n      priceType {\n        usd\n      }\n      id\n    }\n  }\n}\n\nfragment AssetDetails_data_4iqQ9J on AssetType {\n  assetContract {\n    openseaVersion\n    address\n    chain\n    blockExplorerLink\n    tokenStandard\n    id\n  }\n  collection {\n    ...useCollectionFees_collection_4iqQ9J\n    id\n  }\n  isEditableByOwner {\n    value\n  }\n  tokenId\n  isFrozen\n  frozenAt\n  tokenMetadata\n}\n\nfragment AssetMediaAnimation_asset on AssetType {\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMediaAudio_asset on AssetType {\n  backgroundColor\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMediaContainer_asset_2V84VL on AssetType {\n  backgroundColor\n  ...AssetMediaEditions_asset_2V84VL\n}\n\nfragment AssetMediaEditions_asset_2V84VL on AssetType {\n  decimals\n}\n\nfragment AssetMediaImage_asset on AssetType {\n  backgroundColor\n  imageUrl\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    id\n  }\n}\n\nfragment AssetMediaPlaceholderImage_asset on AssetType {\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    id\n  }\n}\n\nfragment AssetMediaVideo_asset on AssetType {\n  backgroundColor\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMediaWebgl_asset on AssetType {\n  backgroundColor\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  displayImageUrl\n  imageUrl\n  isDelisted\n  ...AssetMediaAnimation_asset\n  ...AssetMediaAudio_asset\n  ...AssetMediaContainer_asset_2V84VL\n  ...AssetMediaImage_asset\n  ...AssetMediaPlaceholderImage_asset\n  ...AssetMediaVideo_asset\n  ...AssetMediaWebgl_asset\n}\n\nfragment Boost_collection on CollectionType {\n  numericTraits {\n    key\n    value {\n      max\n    }\n  }\n  ...collection_url\n}\n\nfragment Boost_trait on TraitType {\n  displayType\n  floatValue\n  intValue\n  traitType\n}\n\nfragment CollectionLink_assetContract on AssetContractType {\n  address\n  blockExplorerLink\n}\n\nfragment CollectionLink_collection on CollectionType {\n  name\n  verificationStatus\n  ...collection_url\n}\n\nfragment ContentAuthenticity_data on AssetType {\n  authenticityMetadata {\n    signedOn\n    signedBy\n    producedWith\n    walletAddress\n    id\n  }\n  imageUrl\n  creator {\n    address\n    id\n  }\n  chain {\n    identifier\n  }\n}\n\nfragment Date_trait on TraitType {\n  traitType\n  floatValue\n  intValue\n}\n\nfragment ItemCardAnnotations on ItemType {\n  __isItemType: __typename\n  relayId\n  ... on AssetType {\n    chain {\n      identifier\n    }\n    decimals\n    favoritesCount\n    isDelisted\n    isFrozen\n    hasUnlockableContent\n    ...AssetCardBuyNow_data\n    orderData {\n      bestAskV2 {\n        orderType\n        maker {\n          address\n          id\n        }\n        id\n      }\n    }\n  }\n  ... on AssetBundleType {\n    assetCount\n  }\n}\n\nfragment ItemCardAnnotations__accountInfo_2V84VL on AssetType {\n  isFavorite\n}\n\nfragment NumericTrait_collection on CollectionType {\n  numericTraits {\n    key\n    value {\n      max\n    }\n  }\n  ...collection_url\n}\n\nfragment NumericTrait_trait on TraitType {\n  floatValue\n  intValue\n  maxValue\n  traitType\n}\n\nfragment OfferModal_asset_4iqQ9J on AssetType {\n  relayId\n  ...useOfferModalAdapter_asset_4iqQ9J\n}\n\nfragment OfferModal_tradeLimits on TradeLimitsType {\n  minimumBidUsdPrice\n  ...useOfferModalAdapter_tradeLimits\n}\n\nfragment OfferModal_tradeSummary on TradeSummaryType {\n  ...useOfferModalAdapter_tradeData\n  bestAsk {\n    relayId\n    closedAt\n    payment {\n      relayId\n      id\n    }\n    id\n  }\n}\n\nfragment OrderPrice on OrderV2Type {\n  priceType {\n    unit\n  }\n  perUnitPriceType {\n    unit\n  }\n  dutchAuctionFinalPriceType {\n    unit\n  }\n  openedAt\n  closedAt\n  payment {\n    ...TokenPricePayment\n    id\n  }\n}\n\nfragment OrderUsdPrice on OrderV2Type {\n  priceType {\n    usd\n  }\n  perUnitPriceType {\n    usd\n  }\n  dutchAuctionFinalPriceType {\n    usd\n  }\n  openedAt\n  closedAt\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n}\n\nfragment Property_collection on CollectionType {\n  ...collection_url\n  stats {\n    totalSupply\n    id\n  }\n}\n\nfragment Property_trait on TraitType {\n  traitCount\n  traitType\n  value\n}\n\nfragment SocialBar_data on CollectionType {\n  relayId\n  discordUrl\n  externalUrl\n  instagramUsername\n  mediumUsername\n  slug\n  telegramUrl\n  twitterUsername\n  connectedTwitterUsername\n  assetContracts(first: 2) {\n    edges {\n      node {\n        blockExplorerLink\n        chainData {\n          blockExplorer {\n            name\n            identifier\n          }\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment TokenPricePayment on PaymentAssetType {\n  symbol\n  chain {\n    identifier\n  }\n  asset {\n    imageUrl\n    assetContract {\n      blockExplorerLink\n      id\n    }\n    id\n  }\n}\n\nfragment Toolbar_asset on AssetType {\n  ...asset_url\n  ...itemEvents_data\n  assetContract {\n    address\n    chain\n    id\n  }\n  collection {\n    externalUrl\n    name\n    slug\n    id\n  }\n  externalLink\n  name\n  relayId\n  tokenId\n}\n\nfragment TradeStation_archetype_4iqQ9J on AssetType {\n  verificationStatus\n  assetContract {\n    chain\n    id\n  }\n  assetOwners(first: 1) {\n    edges {\n      node {\n        owner {\n          ...wallet_accountKey\n          id\n        }\n        id\n      }\n    }\n  }\n  isListable\n  isBiddingEnabled {\n    value\n    reason\n  }\n  relayId\n  ...OfferModal_asset_4iqQ9J\n}\n\nfragment TradeStation_data on TradeSummaryType {\n  bestAsk {\n    closedAt\n    dutchAuctionFinalPriceType {\n      unit\n    }\n    openedAt\n    orderType\n    priceFnEndedAt\n    englishAuctionReservePriceType {\n      unit\n    }\n    relayId\n    maker {\n      address\n      ...wallet_accountKey\n      id\n    }\n    item {\n      __typename\n      verificationStatus\n      relayId\n      collection {\n        slug\n        id\n      }\n      chain {\n        identifier\n      }\n      ... on AssetType {\n        tokenId\n        assetContract {\n          address\n          id\n        }\n      }\n      ...itemEvents_dataV2\n      ... on Node {\n        __isNode: __typename\n        id\n      }\n    }\n    priceType {\n      unit\n      usd\n    }\n    remainingQuantityType\n    perUnitPriceType {\n      usd\n    }\n    payment {\n      symbol\n      relayId\n      asset {\n        relayId\n        id\n      }\n      ...TokenPricePayment\n      id\n    }\n    taker {\n      ...wallet_accountKey\n      id\n    }\n    ...price_per_unit\n    ...OrderPrice\n    ...OrderUsdPrice\n    id\n  }\n  bestBid {\n    ...OrderPrice\n    ...OrderUsdPrice\n    payment {\n      relayId\n      id\n    }\n    priceType {\n      unit\n    }\n    perUnitPriceType {\n      usd\n    }\n    id\n  }\n  ...OfferModal_tradeSummary\n}\n\nfragment TradeStation_tradeLimits on TradeLimitsType {\n  ...OfferModal_tradeLimits\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment asset_display_name on AssetType {\n  tokenId\n  name\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    id\n  }\n  tokenId\n  chain {\n    identifier\n  }\n}\n\nfragment collection_url on CollectionType {\n  slug\n  isCategory\n}\n\nfragment itemEvents_data on AssetType {\n  relayId\n  assetContract {\n    address\n    id\n  }\n  tokenId\n  chain {\n    identifier\n  }\n}\n\nfragment itemEvents_dataV2 on ItemType {\n  __isItemType: __typename\n  relayId\n  chain {\n    identifier\n  }\n  ... on AssetType {\n    tokenId\n    assetContract {\n      address\n      id\n    }\n  }\n}\n\nfragment itemEvents_viewItem_data on AssetType {\n  ...itemEvents_data\n  isReportedSuspicious\n  verificationStatus\n}\n\nfragment price on OrderV2Type {\n  priceType {\n    unit\n  }\n}\n\nfragment price_per_unit on OrderV2Type {\n  perUnitPriceType {\n    unit\n  }\n}\n\nfragment useCollectionFees_collection_4iqQ9J on CollectionType {\n  openseaSellerFeeBasisPoints\n  totalCreatorFeeBasisPoints(chain: $chain)\n}\n\nfragment useOfferModalAdapter_asset_4iqQ9J on AssetType {\n  relayId\n  tokenId\n  verificationStatus\n  chain {\n    identifier\n  }\n  assetContract {\n    address\n    id\n  }\n  totalQuantity\n  collection {\n    paymentAssets(chain: $chain) {\n      relayId\n      symbol\n      chain {\n        identifier\n      }\n      asset {\n        usdSpotPrice\n        decimals\n        id\n      }\n      isNative\n      ...utils_PaymentAssetOption\n      id\n    }\n    id\n  }\n}\n\nfragment useOfferModalAdapter_tradeData on TradeSummaryType {\n  bestAsk {\n    isFulfillable\n    oldOrder\n    orderType\n    relayId\n    item {\n      __typename\n      verificationStatus\n      ... on Node {\n        __isNode: __typename\n        id\n      }\n    }\n    payment {\n      relayId\n      id\n    }\n    priceType {\n      unit\n    }\n    id\n  }\n  bestBid {\n    relayId\n    payment {\n      relayId\n      id\n    }\n    ...price\n    id\n  }\n}\n\nfragment useOfferModalAdapter_tradeLimits on TradeLimitsType {\n  minimumBidUsdPrice\n}\n\nfragment utils_PaymentAssetOption on PaymentAssetType {\n  relayId\n  symbol\n  asset {\n    relayId\n    displayImageUrl\n    usdSpotPrice\n    decimals\n    id\n  }\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n}\n",
        variables: {
          tokenId: tokenId,
          contractAddress: contractAddress,
          chain: "ETHEREUM",
        },
      };

      const headers = {
        "x-signed-query":
          "5fc07b62eac9266e5de18730d3a56fae0cf4c8c7725601503aae1294f1209a9f",
        "content-type": "application/json",
      };

      let response = await scraper.post(
        "https://opensea.io/__api/graphql/",
        data,
        {
          headers: headers,
        }
      );

      // const slug = response.data.data.nft.collection.slug;
      //@ts-ignore
      const assetID = response.data.data.nft.id;
      return assetID;
    }
    await getAssetID("0xe47fd6eafb89abce67071a7739ff2018c218ba8a", "813");
    return {
      isSuccess: true,
      isBlocked: false,
    };
  });

  it("can work with params", async () => {
    scraper.useProxy(undefined);
    await scraper.get("http://208.73.206.234:3000/list", {
      params: {
        type: "blur",
      },
    });
  });
});
