var Embryo = require('../lib/embryo')

var Memory = Embryo.Plugin.extend({
    name: 'Memory',
    options: {
        nameInstanceArray: 'instances',
        nameNewMethod: 'new',
        nameStatsMethod: 'stats',
        nameDestroyMethod: 'destroy'
    },
    methods: [],
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        o[this.options.nameInstanceArray] = []
        o[this.options.nameNewMethod] = function( oclass, args ) {
            var instance = args ? new oclass( args ) : new oclass()
            this.instances.push( instance )
            return instance
        }
        o[this.options.nameStatsMethod] = function() {
            /*for (var i=0; i<this.instances.length; i++) {
                //console.log('instance ' + i, this.instances[i])
            }*/
        }
        o[this.options.nameDestroyMethod] = function() {
            for (var i=0; i<this.instances.length; i++) {
                /*var instance = this.instances[i]
                var fdestroy = instance.destroy || null
                if (fdestroy) {
                    fdestroy()
                }*/
                delete this.instances[i]
            }
            this.instances = []
            //console.log('destroy')
        }

        debug && debug( this.name, 'AFTER', o )

        return o
    }
})

module.exports = Memory
