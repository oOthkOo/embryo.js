var PlusMinus = Plugin.extend({
    name: 'PlusMoins',
    options: {
        plusPrefix: '+',
        moinsPrefix: '-'
    },
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        debug && debug( this.name, 'BEFORE', o )

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    defineMethod: function( o, name, before, after ) {
        if (before && after) {
            o[name] = function () {
                return this[property]
            }
        }
        else if (before) {

        }
        else if (after) {
            
        }        
    }
})
