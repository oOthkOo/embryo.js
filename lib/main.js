var Embryo = require('./embryo')
var Extend = require('../plugins/extend')
var Attribute = require('../plugins/attribute')
var PlusMinus = require('../plugins/plus-minus')

// Configure all Embryo plugins
var extendPlugin = new Extend()
extendPlugin.configure({
    nameType: '_type',
    nameProperties: 'properties',
    deleteProperties: true,
    forceTyping: true
})

var attributePlugin = new Attribute()
attributePlugin.configure({
    getPrefix: 'get',
    setPrefix: 'set',
    camelize: true
})

var plusMinusPlugin = new PlusMinus()
plusMinusPlugin.configure({
    
})

// Setting Embryo ;-)
Embryo.configure({
    cstr: 'init'
})
Embryo.use( extendPlugin, false )
Embryo.use( attributePlugin, false )
Embryo.use( plusMinusPlugin, false )

module.exports = Embryo
