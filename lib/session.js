(function() {
  var ApplicationCharge, Blog, CarrierService, FulfillmentService, Order, Product, Session, Shop, Webhook, crypto, empty, isNumeric, sortObj, trim;

  crypto = require('crypto');

  Blog = require('./resources/blog');

  Product = require('./resources/product');

  Order = require('./resources/order');

  ApplicationCharge = require('./resources/application_charge');

  CarrierService = require('./resources/carrier_service');

  FulfillmentService = require('./resources/fulfillment_service');

  Webhook = require('./resources/webhook');

  Shop = require('./resources/shop');

  trim = function(string) {
    return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };

  empty = function(string) {
    string = trim(string);
    return string.length === 0;
  };

  sortObj = function(o) {
    var a, key, sorted, _ref;
    sorted = {};
    a = [];
    for (key in o) {
      if (o.hasOwnProperty(key)) a.push(key);
    }
    a.sort();
    for (key = 0, _ref = a.length; 0 <= _ref ? key <= _ref : key >= _ref; 0 <= _ref ? key++ : key--) {
      sorted[a[key]] = o[a[key]];
    }
    return sorted;
  };

  isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  Session = (function() {

    Session.prototype.protocol = "https";

    function Session(url, apiKey, secret, params) {
      var expireTime, timestamp;
      this.url = url;
      this.apiKey = apiKey;
      this.secret = secret;
      this.params = params != null ? params : {};
      if (this.params['signature'] != null) {
        timestamp = (new Date(this.params['timestamp'])).getTime();
        expireTime = (new Date).getTime() - (24 * 84600);
        if (!this.validateSignature(this.params) && expireTime > timestamp) {
          throw new Error('Invalid signature: Possible malicious login.');
        }
      }
      this.url = this.prepareUrl(this.url);
      if (this.valid) {
        this.blog = new Blog(this.site());
        this.product = new Product(this.site());
        this.order = new Order(this.site());
        this.application_charge = new ApplicationCharge(this.site());
        this.carrier_service = new CarrierService(this.site());
        this.fulfillment_service = new FulfillmentService(this.site());
        this.webhook = new Webhook(this.site());
        this.shop = new Shop(this.site());
      }
    }

    Session.prototype.createPermissionUrl = function() {
      if (!empty(this.url) && !empty(this.apiKey)) {
        return "http://" + this.url + "/admin/api/auth?api_key=" + this.apiKey;
      }
    };

    Session.prototype.site = function() {
      return "" + this.protocol + "://" + this.apiKey + ":" + (this.computedPassword()) + "@" + this.url + "/admin";
    };

    Session.prototype.valid = function() {
      return !empty(this.url);
    };

    Session.prototype.prepareUrl = function(url) {
      if (empty(url)) return '';
      url.replace(/https?:\/\//, '');
      if (url.indexOf(".") === -1) url += '.myshopify.com';
      return url;
    };

    Session.prototype.validateSignature = function(params) {
      var generatedSignature, k, v;
      this.signature = params['signature'];
      generatedSignature = this.secret;
      params = sortObj(params);
      for (k in params) {
        v = params[k];
        if (k !== "signature" && k !== "action" && k !== "controller" && !isNumeric(k) && (k != null)) {
          generatedSignature += "" + k + "=" + v;
        }
      }
      generatedSignature = generatedSignature.replace(new RegExp("undefined=undefined"), '');
      generatedSignature = crypto.createHash('md5').update("" + generatedSignature).digest("hex");
      return generatedSignature === this.signature;
    };

    return Session;

  })();

  module.exports = Session;

}).call(this);
