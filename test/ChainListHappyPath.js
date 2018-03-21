var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract('ChainList', function(accounts){
  var chainListInstance;
  var seller = accounts[1];
  var articleName = 'article 1';
  var articleDescription = 'description 1';
  var articlePrice = 10;


  it('should be init with empty values', function(){
    return ChainList.deployed().then(function(instance){
      return instance.getArticle();
    }).then(function(data){
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], "", "name must be empty");
      assert.equal(data[2], "", "description must be empty");
      assert.equal(data[3].toNumber(), 0, "price must be empty");
    })
  });

  it('should sell an article', function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName,articleDescription,web3.toWei(articlePrice, 'ether'), {from: seller});

  }).then(function(){
    return chainListInstance.getArticle();
  }).then(function(data){
    assert.equal(data[0], seller, "seller must be " + seller);
    assert.equal(data[1], articleName, "name must be " + articleName);
    assert.equal(data[2], articleDescription, "description must be " +articleDescription);
    assert.equal(data[3].toNumber(), web3.toWei(articlePrice), "price must be " + web3.toWei(articlePrice));
  })
  });

  it('should trigger an event when a new article is sold', function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName,articleDescription,web3.toWei(articlePrice, 'ether'), {from: seller});
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, 'one event should have been triggered');
      assert.equal(receipt.logs[0].event, "LogSellArticle", 'event should be LogSellArticle');
      assert.equal(receipt.logs[0].args._seller, seller, 'seller must be' + seller);
      assert.equal(receipt.logs[0].args._name, articleName, 'articleName must be' + articleName);
      assert.equal(receipt.logs[0].args._price, web3.toWei(articlePrice, 'ether'), 'Price must be' + web3.toWei(articlePrice, 'ether'));
    })
  });
});
