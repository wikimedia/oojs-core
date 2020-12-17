# Contribute to OOjs

## Commit messages

If you're a new contributor, don't worry if you're unsure about
the commit message. Maintainers will adjust or write these as needed
as part of code review and merge activities. If you're a regular
contributor, do try to follow this structure to help speed up the
process. Thanks!

Structure:

```
Component: Short subject line about what is changing

Additional details about the commit are placed after a new line
in the commit message body. That's this paragraph here.

Bug: T123
```

The subject line should use the [imperative mood](https://en.wikipedia.org/wiki/Imperative_mood),
and start with one of the following components:

* `core`
* `EmitterList`
* `EventEmitter`
* `Factory`
* `Registry`
* `docs`
* `release`
* `build`
* `tests`

See also [Commit message guidelines](https://www.mediawiki.org/wiki/Gerrit/Commit_message_guidelines).

## Release process

1. Create or reset your `release` branch to the latest head of the repository
   ```
   git remote update && git checkout -B release -t origin/master
   ```

2. Ensure tests pass locally.
   NOTE: This does not require privileges and may should be in isolation.
   ```
   npm ci && npm test
   ```

3. Prepare the release commit
   - Add release notes. Run the following and copy the resulting list
     to a new section on top of [History.md](./History.md).
     Remove any `build` and `test` changes unless they are observable to
     consumers of the library's published docs or package.
     If something might be worth cutting at least a patch relase for,
     it is probably worth mentioning in the release notes.
     ```
     git log --format='* %s (%aN)' --no-merges --reverse v$(node -e 'console.log(require("./package.json").version);')...HEAD | sort
     ```
   - Set the package version in [package.json](./package.json).
   - Review the changes and stage your commit:
     ```
     git add -p
     ```
   - Make your commit and push for review.
     ```
     git commit -m "Release vX.Y.Z"
     git review
     ```

After the release commit has been reviewed, passed by CI,
and merged, perform the actual release, like so:

1. Create or reset your `release` branch to the latest head of the repository,
   and confirm that the current HEAD is indeed your release prep commit.
   ```
   git remote update && git checkout -B release -t origin/master

   git show
   …
   Release vX.Y.Z
   …
   ```

3. Create signed tag and push to the Git server:
   ```
   git tag -s "vX.Y.Z"
   git push --tags
   ```

4. Generate the release artefact for npm, and confirm that the release
   file looks as expected (e.g. no "pre" release version header).
   NOTE: This does not require privileges and should be run in isolation.
   ```
   npm run build-release
   …

   head dist/oojs.js dist/oojs.jquery.js
   …
   OOjs v5.0.0
   …
   OOjs v5.0.0 optimised for jQuery
   …
   ```

5. Publish to npm:
   ```
   npm publish
   ```
