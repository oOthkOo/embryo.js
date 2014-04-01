/**
    Embryo version 0.0.1
    Author: Tierry Danquin
    Github: https://github.com/oOthkOo/embryo.js
    Description: The most simple, customizable and easy to use JavaScript standard inheritance library
**/

var const_cstr = 'init'
var plugins = []

var debugPlugin = function( name, step, o ) {
    console.log( '[' + name + '] - ' + step )
    console.log( "\ttype: ", o._type )
    var o = o.prototype || o
    for (var name in o) {
        if (o.hasOwnProperty(name)) {
            var value = o[name]
            var text = typeof(value)
            switch (text) {
                case 'function':
                    break
                case 'object':
                    text = JSON.stringify(value)
                    break
                default:
                    text = value
                    break
            }
            console.log( "\tproperty: [" + name + "]:\t\t[" + text + "] -> (" + typeof(value) + ")" )       
        }
    }
}

var Embryo = function() {
    this[const_cstr] && this[const_cstr].apply(this, arguments)
}

Embryo.extend = function( o ) {
    
    var parent = this    
    var child = function() {
        return parent.apply(this, arguments)
    }    
    child.extend = parent.extend
    
    var Surrogate = function() {} 
    Surrogate.prototype = parent.prototype
    child.prototype = new Surrogate

    for (var p=0; p<plugins.length; p++) {
        var plugin = plugins[p].handle
        var debug = plugins[p].debug ? debugPlugin : null
        o = plugin.exec( o, debug, child )
    }    

    for (var key in o) {
        child.prototype[key] = o[key]
    }

    return child 
}

Embryo.configure = function ( options ) {
    options = options || {}
    const_cstr = options.cstr || 'init'
}

Embryo.use = function ( plugin, debug ) {
    plugins.push({
        handle: plugin,
        debug: debug || false
    })
}    

Embryo.configure()

var Plugin = Embryo.extend({

    '_type': 'Plugin',

    name: 'Plugin',
    options: null,
    
    init: function() {
        
    },
    configure: function( o ) {
        this.options = o
    }    
})

module.exports = Embryo
module.exports.Plugin = Plugin
