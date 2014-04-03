var Embryo = require('./embryo')
var Extend = require('../plugins/extend')
var Attribute = require('../plugins/attribute')
var BeforeAfter = require('../plugins/before-after')
var Surcharge = require('../plugins/surcharge')

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
    beforePrefix: '-',
    afterPrefix: '+',
    hiddenPrefix: '_bah_'
})

var surchargePlugin = new Surcharge()
surchargePlugin.configure({
    suffix: '|',
    hiddenPrefix: '_pm_'
})

// Configure Embryo ;-)
Embryo.configure({
    cstrName: 'init',
    forceCstr: true,
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
})
Embryo.use( extendPlugin, false )
Embryo.use( attributePlugin, false )
Embryo.use( beforeAfterPlugin, false )
Embryo.use( surchargePlugin, false )

module.exports = Embryo
