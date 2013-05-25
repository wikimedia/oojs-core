oojs [![Build Status](https://travis-ci.org/trevorparscal/oojs.png)](https://travis-ci.org/trevorparscal/oojs) [![NPM version](https://badge.fury.io/js/oojs.png)](https://badge.fury.io/js/oojs)
=================

oo.js is a JavaScript library for working with objects.

Key features include inheritance, mixins and utilities for working with objects.

 ```javascript
/* Example */
( function ( oo ) {
    function Animal() {}
    function Magic() {}
    function Unicorn() {
        Animal.call( this );
        Magic.call( this );
    }
    oo.inheritClass( Unicorn, Animal );
    oo.mixinClass( Unicorn, Magic );
}( OO ) );
 ```

Quick start
----------

This module is available as an [npm](https://npmjs.org/) package! Install it right away:
```bash
npm install oojs
```

Or clone the repo, `git clone --recursive https://github.com/trevorparscal/oojs.git`.

Versioning
----------

We use the Semantic Versioning guidelines as much as possible.

Releases will be numbered in the following format:

`<major>.<minor>.<patch>`

For more information on SemVer, please visit http://semver.org/.

Bug tracker
-----------

Found a bug? Please report it in the [issue tracker](https://github.com/trevorparscal/oojs/issues)!
