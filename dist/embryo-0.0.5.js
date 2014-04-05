/**
    Embryo version 0.0.1
    Author:
        Tierry Danquin
    Github:
        https://github.com/oOthkOo/embryo.js
    Description:
        The most simple, customizable and easy to use
        JavaScript standard inheritance library
**/

var options = {
    cstrName: 'init',
    forceCstr: true,
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
}

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

var Embryo = function() {
    this[options.cstrName] && this[options.cstrName].apply(this, arguments)
}

Embryo.plugins = []

Embryo.extend = function( o ) {

    //var timeStart = new Date().getTime()

    var c = o[options.cstrName] || null
    if (options.forceCstr && !c) {
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
    Surrogate.prototype = parent.prototype
    child.prototype = new Surrogate

    /*/ Prepare class properties for all plugins
    var r = []
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            r.push({
                name: n,
                value: o[n],
                type: typeof(o[n])
            }) 
        }
    }
    console.log('r', r)*/

    for (var n in this.plugins) {
        if (this.plugins.hasOwnProperty(n)) {
            var plugin = this.plugins[n]
            //console.log('plugin', plugin.name)
            var debug = plugin.isDebug() ? debugPlugin : null
            o = plugin.exec( o, debug, child )
        }
    }

    for (var key in o) {
        if (key == options.nameBlacklist &&
            options.deleteBlacklist) {
            continue
        }
        child.prototype[key] = o[key]
    }

    //var timeEnd = new Date().getTime()
    //console.log('time: ' + (timeEnd - timeStart) + 'ms')

    return child 
}

Embryo.configure = function ( o ) {
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            options[n] = o[n]
        }
    }
}

Embryo.use = function ( plugin, debug ) {
    plugin.configure( options )
    plugin.setDebug( debug )
    Embryo.plugins[plugin.name] = plugin
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
        var pl = o['_blacklist']
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

var Attribute = Embryo.Plugin.extend({
    name: 'Attribute',
    options: {
        getPrefix: 'get',
        setPrefix: 'set',
        camelize: false
    },
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                var value = o[n]
                if (n != '_type' &&
                    typeof(value) !== 'function') {
                    var name = this.options.camelize ? this.camelize( n ) : n
                    var fname = this.options.getPrefix + name
                    this.defineGetter( o, fname, n )
                    name = this.options.camelize ? this.camelize( n ) : n
                    fname = this.options.setPrefix + name
                    this.defineSetter( o, fname, n )
                }    
            }
        }                

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    defineGetter: function( o, name, property ) {
        o[name] = function () {
            return this[property]
        }
    },
    defineSetter: function( o, name, property ) {
        o[name] = function ( v ) {
            this[property] = v
        }
    },
    camelize: function( text ) {
        text = text.toLowerCase()
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text
    }
})

var BeforeAfter = Embryo.Plugin.extend({
    name: 'BeforeAfter',
    options: {
        beforePrefix: '-',
        afterPrefix: '+',
        hiddenPrefix: '_pm_'
    },
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        var methods = {}
        var bp = this.options.beforePrefix
        var ap = this.options.afterPrefix

        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                var value = o[n]
                var name = ''
                var method = null
                if (typeof(value) == 'function') {
                    if (n.indexOf(ap) > -1) {
                        name = n.replace(ap,'')
                        method = methods[name]
                        if (!method) {
                            method = methods[name] = {
                                before: false,
                                after: false
                            }
                        }
                        method.after = true
                    }
                    else if (n.indexOf(bp) > -1) {
                        name = n.replace(bp,'')
                        method = methods[name]
                        if (!method) {
                            method = methods[name] = {
                                before: false,
                                after: false
                            }
                        }
                        method.before = true
                    }
                }  
            }
        }

        for (var m in methods) {
            if (methods.hasOwnProperty(m)) {
                //console.log(m,)
                var options = methods[m]
                this.defineMethod( o, m, options.before, options.after )
            }
        }

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    defineMethod: function( o, name, before, after ) {
        if (!o[name]) {
            throw new Error( 'method ' + name + ' not found.' )
        }
        var method = this.options.hiddenPrefix + name
        var beforeMethod = this.options.beforePrefix + name
        var afterMethod = this.options.afterPrefix + name
        o[method] = o[name]
        if (before && after) {
            o[name] = function () {
                this[beforeMethod]()
                this[method]()
                this[afterMethod]()
            }
        }
        else if (before) {
            o[name] = function () {
                this[beforeMethod]()
                this[method]()
            }
        }
        else {
            o[name] = function () {
                this[method]()
                this[afterMethod]()
            }
        }        
    }
})

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

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        if (this.options.forceTyping && !o[this.options.nameType]) {        
            o[this.options.nameType] = this.options.typeDefault
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

var Surcharge = Embryo.Plugin.extend({
    name: 'Surcharge',
    options: {
        suffix: '|',
        hiddenPrefix: '_pm_'
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

        var suffix = this.options.suffix
        this.methods = []

        //console.log('suffix', suffix)

        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                if (typeof(o[n]) == 'function') {
                    //console.log('n', n)
                    if (n.indexOf(suffix) > -1) {
                        parts = n.split(suffix)
                        //console.log('parts', parts)
                        var name = parts[0]
                        if (name) {
                            if (!this.isMethodExist(name)) {
                                this.methods.push(name)
                            }
                        }
                    }
                }  
            }
        }

        for (var m=0; m<this.methods.length; m++) {
            this.defineMethod( o, this.methods[m] )
        }

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    isMethodExist: function( name ) {
        for (var m=0; m<this.methods.length; m++) {
            if (this.methods[m] == name) {
                return true
            }
        }
        return false
    },
    defineMethod: function( o, name ) {
        var hiddenPrefix = this.options.hiddenPrefix
        var method = hiddenPrefix + name
        var suffix = this.options.suffix
        //console.log('method', method)
        o[method] = o[name]
        o[name] = function () {
            var fname = name + suffix + arguments.length
            //console.log('fname', fname)
            var fn = this[fname]
            if (!fn) {
                fname = hiddenPrefix + name
                //console.log('fname', fname)
                fn = this[fname]
            }
            if (!fn) {
                throw new Error( 'method "' + name + '" not defined.' )
            }
            fn()
        }        
    }
})

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
