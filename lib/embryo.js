/**
    Embryo version 0.1.1
    Author:
        Tierry Danquin
    Github:
        https://github.com/oOthkOo/embryo.js
    Description:
        The most simple, customizable and easy to use
        JavaScript standard inheritance library
**/

var embryo_options = {
    cstrName: 'init',
    cstrArrayName: '_types',
    forceCstr: true,
    nameType: '_type',
    forceTyping: true,
    typeDefault: 'Embryo',
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
}

var embryo_plugins = []
var embryo_types = []

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
                    text = value.toString().replace(/\n/g,'')
                    text = text.replace(/\s+/g,' ')
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

var isTypeExist = function ( types, name ) {
    for (var t=0; t<types.length; t++) {
        var type = types[t]
        if (type.name == name) {
            return true
        }
    }
    return false
}

var Embryo = function() {

    //console.log('---START---')

    // Select all matched types
    var types = []
    for (var i=0; i<embryo_types.length; i++) {
        var type = embryo_types[i]
        if (this instanceof type.child) {
            types.push(type)
        }
    }

    // Extend types properties from last to first
    for (var i=types.length-1; i>-1; i--) {
        var type = types[i]
        var props = type.props
        if (props) {
            for (var n in props) {
                if (props.hasOwnProperty(n)) {
                    if (typeof this[n] == 'undefined') {
                        this[n] = props[n]
                        //console.log('['+n+']=['+props[n]+']')    
                    }
                }
            }
        }
    }

    // Call each types constructors
    for (var i=0; i<types.length; i++) {
        var type = types[i]
        //var name = type.name
        var init = type.init
        if (init) {
            init.apply(this, arguments)
        }
    }

    //console.log('---END---')
}

Embryo.version = '0.1.1'

Embryo.extend = function( o ) {

    //console.log('START')
    //console.log(o._type + ' - start')
    //var timeStart = new Date().getTime()

    var c = o[embryo_options.cstrName] || null
    if (embryo_options.forceCstr && !c) {
        if (!c) {
            throw Error( 'No constructor function found.')
        }
    }
    if (c && typeof(c) !== 'function') {
        throw Error( 'Constructor function invalid.')
    }

    var parent = this    
    var child = function() {
        return parent.apply(this, arguments)
    }    
    child.extend = parent.extend

    var Surrogate = function() {}
    Surrogate.prototype = this.prototype
    child.prototype = new Surrogate

    if (embryo_options.forceTyping && !o[embryo_options.nameType]) {        
        o[embryo_options.nameType] = embryo_options.typeDefault
    }
    var type = o[embryo_options.nameType]

    for (var p=0; p<embryo_plugins.length; p++) {
        var plugin = embryo_plugins[p]
        //console.log('plugin ' + plugin.name + ' -> ' + o._type)
        var debug = plugin.isDebug() ? debugPlugin : null
        o = plugin.exec( o, debug, child )
    }

    for (var key in o) {
        if (key == embryo_options.nameBlacklist &&
            embryo_options.deleteBlacklist) {
            continue
        }
        if (key == embryo_options.nameProperties) {
            continue
        }
        if (key == embryo_options.cstrName) {
            if (!isTypeExist( embryo_types, type )) {
                embryo_types.push({
                    name: type,
                    init: o[key] || null,
                    props: o[embryo_options.nameProperties] || null,
                    child: child
                })
            }
        }
        child.prototype[key] = o[key]
    }

    //console.log(balloons)
    //console.log('END')

    //console.log(o._type + ' - end')
    //var timeEnd = new Date().getTime()
    //console.log('time: ' + (timeEnd - timeStart) + 'ms') 

    return child 
}

Embryo.configure = function ( o ) {
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            embryo_options[n] = o[n]
        }
    }
}

Embryo.use = function ( plugin, debug ) {
    plugin.configure( embryo_options )
    plugin.setDebug( debug )
    embryo_plugins.push(plugin)
}

Embryo.plugins = function( name ) {
    for (var p=0; p<embryo_plugins.length; p++) {
        var plugin = embryo_plugins[p]
        if (plugin.name == name) {
            return plugin
        }
    }
    return null
}   

Embryo.configure()

Embryo.Plugin = Embryo.extend({
    '_type': 'Plugin',
    name: 'Plugin',
    options: null,
    init: function( debug ) {
        this.setDebug( debug )
    },
    configure: function( o ) {
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                this.options[n] = o[n]
            }
        }
    },
    isBlacklisted: function( o ) {
        var pl = o['_blacklist'] || false
        if (!pl) {
            return false
        }
        //console.log('pl', pl)
        for (var p=0; p<pl.length; p++) {
            var plugin = pl[p]
            //console.log('plugin', plugin)
            if (plugin == this.name ||
                plugin == '*') {
                return true
            }
        }
        return false
    },
    isDebug: function() {
        return this.debug
    },
    setDebug: function( debug ) {
        this.debug = debug || false
    },
    getName: function() {
        return this.name
    }  
})

module.exports = Embryo
