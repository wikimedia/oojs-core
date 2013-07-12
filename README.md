OOJS [![Build Status](https://travis-ci.org/trevorparscal/oojs.png?branch=master)](https://travis-ci.org/trevorparscal/oojs) [![NPM version](https://badge.fury.io/js/oojs.png)](https://badge.fury.io/js/oojs)
=================

OOJS is a JavaScript library for working with objects.

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

Release
----------

Release process:

```bash
$ cd path/to/oojs/
$ git remote update
  # If you have a fork, be sure to checkout upstream/master or whatever
  # the name of the original remote is.
$ git checkout origin/master
  # Get commits since last version bump
  # Copy the resulting list into a new section on History.md
  # git add -p && git commit -m "history: Add notes for vNEXT" (where NEXT is the next version)
$ git log --format='* %s (%aN)' --no-merges v$(node -e 'console.log(JSON.parse(require("fs").readFileSync("package.json")).version);')...HEAD
  # The following will:
  # - Increase the version number in package.json
  # - Create a commit with message -m (substituting %s for the version)
  # - Create a git tag named "v%s"
$ npm version patch -m 'Tag v%s'
  # Push to the origin
$ git push --tags && git push origin HEAD:master
  # Publish to NPM
  # This will run the prepublish build script to run the tests first
  # and re-build dist/oo.js
$ git checkout v1.2.3
$ npm install && npm test && npm publish
```
