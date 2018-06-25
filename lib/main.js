var Embryo = require('./embryo')
var Attribute = require('../plugins/attribute')
var BeforeAfter = require('../plugins/before-after')
var Surcharge = require('../plugins/surcharge')
var Memory = require('../plugins/memory')
var Static = require('../plugins/static')

// Configure all Embryo plugins
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

var staticPlugin = new Static()
staticPlugin.configure({
    prefix: '$'
})

// Configure Embryo ;-)
Embryo.configure({
    cstrName: 'init',
    cstrArrayName: '_types',
    forceCstr: true,
    nameType: '_type',
    forceTyping: true,
    typeDefault: 'Embryo',
    nameProperties: 'properties',
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
})
Embryo.use( attributePlugin, false )
Embryo.use( beforeAfterPlugin, false )
Embryo.use( surchargePlugin, false )
Embryo.use( memoryPlugin, false )
Embryo.use( staticPlugin, false )

module.exports = Embryo
