crypto = require 'crypto'
Blog = require './resources/blog'
Product = require './resources/product'
Order = require './resources/order'
ApplicationCharge = require './resources/application_charge'
CarrierService = require './resources/carrier_service'
FulfillmentService = require './resources/fulfillment_service'
Webhook = require './resources/webhook'
Shop = require './resources/shop'

trim = (string) ->
  string.replace(/^\s\s*/, '').replace(/\s\s*$/, '')

empty = (string)->
  string = trim(string)
  string.length is 0 

sortObj = (o) ->
  sorted = {}
  a = []

  for key of o 
    if o.hasOwnProperty key
      a.push key

  a.sort()

  for key in [0..a.length] 
    sorted[a[key]] = o[a[key]]
  
  return sorted

isNumeric = (n) ->
  !isNaN(parseFloat(n)) and isFinite(n)


class Session

  protocol: "https"

  constructor: (@url, @apiKey, @secret, @params = {}) ->

    if @params['signature']?
      timestamp = (new Date(@params['timestamp'])).getTime()
      expireTime = (new Date).getTime() - (24 * 84600)
      if not @validateSignature(@params) and expireTime > timestamp
        throw new Error 'Invalid signature: Possible malicious login.'
      
    @url = @prepareUrl(@url)

    if @valid
      @blog = new Blog(@site())
      @product = new Product(@site())
      @order = new Order(@site())
      @application_charge = new ApplicationCharge(@site())
      @carrier_service = new CarrierService(@site())
      @fulfillment_service = new FulfillmentService(@site())
      @webhook = new Webhook(@site())
      @shop = new Shop(@site())

  createPermissionUrl: ->
    "http://#{@url}/admin/api/auth?api_key=#{@apiKey}" if not empty(@url) and not empty(@apiKey)

  site: -> 
    "#{@protocol}://#{@apiKey}:#{@computedPassword()}@#{@url}/admin"

  valid: ->
    not empty(@url)

  prepareUrl: (url) ->
    return '' if empty(url)
    url.replace /https?:\/\//, ''
    url += '.myshopify.com' unless url.indexOf(".") isnt -1
    return url

  validateSignature: (params) ->
    @signature = params['signature']
    generatedSignature = @secret
    params = sortObj(params)
    for k, v of params
      if k isnt "signature" and k isnt "action" and k isnt "controller" and not isNumeric(k) and k?
        generatedSignature += "#{k}=#{v}"

    generatedSignature = generatedSignature.replace(new RegExp("undefined=undefined"), '')
    generatedSignature = crypto.createHash('md5').update("#{generatedSignature}").digest("hex")    
    generatedSignature is @signature   







module.exports = Session
