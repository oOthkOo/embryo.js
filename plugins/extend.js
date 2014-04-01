var Embryo = require('../lib/embryo')

var Extend = Embryo.Plugin.extend({
    name: 'Extend',
    options: {
        nameType: '_type',
        nameProperties: 'properties',
        deleteProperties: true,
        forceTyping: true
    },
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        debug && debug( this.name, 'BEFORE', o )

        /*var c = o[const_cstr] || null
        if (!c) {
            throw Error( 'no constructor function found.')
        }
        if (typeof(c) !== 'function') {
            throw Error( 'constructor function invalid.')
        }*/

        if (this.options.forceTyping && !o[this.options.nameType]) {        
            o[this.options.nameType] = 'xclassz'
        }

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
