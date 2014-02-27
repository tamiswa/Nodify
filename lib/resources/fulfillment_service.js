(function() {
  var Base, FulfillmentService,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Base = require('./base');

  FulfillmentService = (function(_super) {

    __extends(FulfillmentService, _super);

    FulfillmentService.prototype.slug = "fulfillment_service";

    FulfillmentService.prototype.prefix = "/fulfillment_services";

    function FulfillmentService(site) {
      FulfillmentService.__super__.constructor.call(this, site);
    }

    return FulfillmentService;

  })(Base);

  module.exports = FulfillmentService;

}).call(this);
