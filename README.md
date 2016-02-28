object-provide
==============

Install
-------

`npm install object-provide`

Intro
-----

This single function library represents a common pattern.

**Adding behavior conditionally.**

A Simple Example
----------------

```javascript
var extend = require('object-provide'),
    //Extend with the first call to extend.
    firstExtension = true;

function AConstructor(){}

//This assignment succeeds.
extend(AConstructor.prototype, firstExtension, {
    aMethod: function(){
        console.log('I am the first one.')
    }
});

//This assignment does not succeed.
extend(AConstructor.prototype, !firstExtension, {
    aMethod: function(){
        console.log('I am the second one.')
    }
});
```

The alternative could be.

```javascript
var firstExtension = true;
function AConstructor(){}

if(firstExtension){
    AConstructor.prototype.aMethod = function(){
        console.log('I am the first one.')
    };
}else{
    AConstructor.prototype.aMethod = function(){
        console.log('I am the second one.')
    };
}
```

The Interface
-------------

### extend(destination, use|source, source|filter)

`destination` is the object you want to extend with the `source` object.

`use` is a *boolean*. When `use` is **true** `source` properties are assigned to `destination`.

`filter` is a *function* callback.

#### filter(destination, source, value, key) -> boolean

The `filter` callback is used as a final control of properties. This `filter` callback is actually both a forEach, and a filter.

The `value` is the current property value of the `source` object.

`key` is the current property key of the `source` object.

When the return value is `false` the **current property** is not set.

When the return value is `true`, or `undefined` the **current property** is set.

Additionally you can set the value inside of the **filter** callback. Just return `false` if you do.

Usage of filter
---------------

```javascript
extend(AConstructor.prototype, firstExtension, {
    aProp: "Don't use me",
    aMethod: function(){
        console.log('I am the first one.')
    }
}, filter);

//For some odd reason we don't use "aProp" because it contains a string..
function filter(dest, source, value, key){
    if(typeof key === 'aProp' && typeof value === 'string'){
        return false;
    }
}
```

A more pragmatic example
------------------------

```javascript
extend(Array.prototype, Array.prototype.includes ? true : false, {
    includes: function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                 (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    }
});
```

About
-----

The `Array.prototype.includes` polyfill example is contrived.

This library is better used as a library helper. Where you add the behavior you want based on some condition that can't be controlled by the developer at run time.

So when you release a library it goes out, and acts exactly as it should. That is if you've taken the proper measures to make the alternative behaviors act the same. Which I know is a contradiction, but I think you know what I mean. :)

For instance let's say you have a library that has it's own includes.

```javascript
var canIncludes = Array.prototype.includes ? true : false;

function MyLib(){}

extend(MyLib.prototype, canIncludes, {
    includes: function(){
        return Array.prototype.includes.apply(this, arguments);
    }
});

extend(MyLib.prototype, !canIncludes, {
    includes: function(){
        //The alternate behavior.
    }
});

```

This conditional behavior can be used to set multiple properties as well.

Overall it is easy to just use ifelse branches to set properties conditionally, but `object-provide` is the implementation of this common idiom. Maybe code using `object-provide` can be slightly more organized, and provide good visual markers in code where conditional properties exist. Also don't repeat yourself though it could be argued there really isn't any less characters than using ifelse.

Maybe if you assign `object-provide` to just one, or two characters then you have less code:

```javascript
var OP = require('object-provide');
```

Happy coding!
