(function() {
  var Base, CarrierService,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Base = require('./base');

  CarrierService = (function(_super) {

    __extends(CarrierService, _super);

    CarrierService.prototype.slug = "carrier_service";

    CarrierService.prototype.prefix = "/carrier_services";

    function CarrierService(site) {
      CarrierService.__super__.constructor.call(this, site);
    }

    return CarrierService;

  })(Base);

  module.exports = CarrierService;

}).call(this);
