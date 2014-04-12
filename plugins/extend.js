var Embryo = require('../lib/embryo')

var Extend = Embryo.Plugin.extend({
    name: 'Extend',
    options: {
        nameProperties: 'properties',
        deleteProperties: true
    },
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        var p = o[this.options.nameProperties] || null
        if (p) {
            if (typeof(p) !== 'object') {
                throw Error( 'properties object invalid.')
            }
            for (var n in p) {
                if (p.hasOwnProperty(n)) {
                    o[n] = p[n]     
                }
            }
        }

        if (this.options.deleteProperties) {
            delete o[this.options.nameProperties]
        }        

        debug && debug( this.name, 'AFTER', o )

        return o
    }
})

module.exports = Extend
