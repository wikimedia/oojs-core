OOjs [![NPM version](https://badge.fury.io/js/oojs.png)](https://badge.fury.io/js/oojs)
=================

OOjs is a JavaScript library for working with objects.

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

Or clone the repo, `git clone https://git.wikimedia.org/git/oojs/core.git`.

Versioning
----------

We use the Semantic Versioning guidelines as much as possible.

Releases will be numbered in the following format:

`<major>.<minor>.<patch>`

For more information on SemVer, please visit http://semver.org/.

Bug tracker
-----------

Found a bug? Please report it in the [issue tracker](https://bugzilla.wikimedia.org/enter_bug.cgi?product=OOjs)!

Release
----------

Release process:

```bash
$ cd path/to/oojs/
$ git remote update
$ git checkout -b release -t origin/master

# Ensure tests pass
$ npm install && npm test

# Avoid using "npm version patch" because that creates
# both a commit and a tag, and we shouldn't tag until after
# the commit is merged.

# Update release notes
# Copy the resulting list into a new section on History.md
$ git log --format='* %s (%aN)' --no-merges v$(node -e 'console.log(JSON.parse(require("fs").readFileSync("package.json")).version);')...HEAD
$ edit History.md

# Update the version number
$ edit package.json

$ git add -p
$ git commit -m "Tag vX.X.X"
$ git review

# After merging:
$ git remote update
$ git checkout origin/master
$ git tag "vX.X.X"
$ git push --tags
$ npm publish
```
