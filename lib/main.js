var Embryo = require('./embryo')
var Extend = require('../plugins/extend')
var Attribute = require('../plugins/attribute')
var BeforeAfter = require('../plugins/before-after')
var Surcharge = require('../plugins/surcharge')
var Memory = require('../plugins/memory')

// Configure all Embryo plugins
var extendPlugin = new Extend()
extendPlugin.configure({
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

var memoryPlugin = new Memory()
memoryPlugin.configure({
    nameInstanceArray: 'instances',
    nameNewMethod: 'new',
    nameStatsMethod: 'stats',
    nameDestroyMethod: 'destroy'
})

// Configure Embryo ;-)
Embryo.configure({
    cstrName: 'init',
    cstrArrayName: '_types',
    forceCstr: true,
    nameType: '_type',
    forceTyping: true,
    typeDefault: 'Embryo',
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
})
Embryo.use( extendPlugin, false )
Embryo.use( attributePlugin, false )
Embryo.use( beforeAfterPlugin, false )
Embryo.use( surchargePlugin, false )
Embryo.use( memoryPlugin, false )

module.exports = Embryo
