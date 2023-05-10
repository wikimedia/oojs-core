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
   git remote update && git checkout -B release -t origin/HEAD
   ```

2. Ensure build and tests pass locally.
   NOTE: This does not require privileges and should be run in isolation.
   ```
   npm ci && npm test
   ```

3. Prepare the release commit
   - Add release notes to a new section on top of [History.md](./History.md).
     ```
     git log --format='* %s (%aN)' --no-merges --reverse v$(node -e 'console.log(require("./package.json").version);')...HEAD | sort | grep -vE '^\* (build|docs?|tests?):'
     ```
   - Update AUTHORS.txt and preview the diff.
     If duplicates emerge, add entries to `.mailmap` as needed and re-run the command.
     ```
     npm run authors
     ```
   - Set the next release version in [package.json](./package.json).
   - Review and stage your commit:
     ```
     git add -p
     ```
   - Save your commit and push for review.
     ```
     git commit -m "Release vX.Y.Z"
     git review
     ```

After the release commit has been merged by CI, perform the actual release:

1. Update and reset your `release` branch, confirm it is at your merged commit.
   ```
   git remote update && git checkout -B release -t origin/HEAD
   # …
   git show
   # Release vX.Y.Z
   # …
   ```

3. Create a signed tag and push it to the Git server:
   ```
   git tag -s "vX.Y.Z"
   git push --tags
   ```

4. Run the build and review the release file (e.g. proper release version header
   in the header, and not a development build).
   NOTE: This does not require privileges and should be run in isolation.
   ```
   npm run build-release
   # …
   head dist/oojs.js
   # OOjs v5.0.0
   # …
   ```

5. Publish to npm:
   ```
   npm publish
   ```
