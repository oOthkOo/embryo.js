var Embryo = require('./embryo')
var Extend = require('../plugins/extend')
var Attribute = require('../plugins/attribute')
var BeforeAfter = require('../plugins/before-after')

// Configure all Embryo plugins
var extendPlugin = new Extend()
extendPlugin.configure({
    nameType: '_type',
    typeDefault: 'Embryo',
    forceTyping: true,
    nameProperties: 'properties',
    deleteProperties: true
})

var attributePlugin = new Attribute()
attributePlugin.configure({
    getPrefix: 'get',
    setPrefix: 'set',
    camelize: true
})

var beforeAfterPlugin = new BeforeAfter()
beforeAfterPlugin.configure({
    plusPrefix: '+',
    moinsPrefix: '-',
    hiddenPrefix: '_bah_'
})

// Configure Embryo ;-)
Embryo.configure({
    cstrName: 'init',
    forceCstr: true,
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
})
Embryo.use( extendPlugin, false )
Embryo.use( attributePlugin, true )
Embryo.use( beforeAfterPlugin, true )

module.exports = Embryo
