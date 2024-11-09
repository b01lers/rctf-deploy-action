# rctf-deploy-action
Opinionated challenge metadata updater for rCTF deployment.

This action sets up a repository to act as the Single Source of Truth (SSOT) for challenge deployments on the rCTF
backend. To this end, this action will automatically deploy all challenges in the configured challenge source directory
(by default, `./src`).

Within the source directory, the action assumes the following directory structure:
- Every subfolder is a challenge category (e.g. `web`, `crypto`).
- Every folder within a subfolder is a challenge.

Within each challenge directory, the CI will automatically upload files in `[challname]/dist` and deploy the challenge
to rCTF with the name and description specified in `chal.json`.

```
src
|___ web
     |___ inspect_me
     |    |___ chal.json
     |    |___ ...
     |
     |___ another_csp
          |___ chal.json
          |___ dist
          |    |___ bot.js
          |    |___ ...
          |___ ...
```
###### Example directory structure for a ctf with two challenges, `web/inspect_me` and `web/another_csp`.

**Because this repository is the single source of truth for challenge deployments, any challenges manually created on
rCTF and not specified in this repository will be automatically deleted.** If you need to create an "empty" challenge
(i.e. for a challenge with multiple parts/flags or a welcome/survey chall), make a challenge directory containing only
a `chal.json` for deployment.

The format of `chal.json` is as follows:

| Name             |         Required         | Default | Description                                                                                          |
|------------------|:------------------------:|---------|------------------------------------------------------------------------------------------------------|
| name             | <ul><li>- [x] </li></ul> |         | The challenge name.                                                                                  |
| author           | <ul><li>- [x] </li></ul> |         | The challenge author.                                                                                |
| description      | <ul><li>- [x] </li></ul> |         | The challenge description. Markdown is supported.                                                    |
| flag             | <ul><li>- [x] </li></ul> |         | The challenge flag.                                                                                  |
| hidden           |                          | `false` | Whether to skip deploying this challenge; useful for releasing challenges at a specific time.        |
| minPoints        |                          | `100`   | The minimum number of points this challenge is worth.                                                |
| maxPoints        |                          | `500`   | The maximum number of points this challenge is worth.                                                |
| tiebreakEligible |                          | `true`  | Whether this challenge is eligible for tiebreakers.                                                  |
| prereqs          |                          |         | (Experimental) Challenges that need to be solved before this challenge is revealed, as a `string[]`. |
| difficulty       |                          |         | (Experimental) The difficulty of this challenge, as a `string`.                                      |

which can be combined with other deployment configuration values, e.g.
```json
{
    "name": "bash cat with pipe",
    "author": "ky28059",
    "description": "My terminal seems to be stuck... please help me fix it!\n\n`nc ctf.b01lers.com 7072`",
    "difficulty": "easy",
    "flag": "bctf{owwwww_th4t_hurt}",
    "ports": [
        7072
    ],
    "hidden": false,
    "can_be_auto_deployed": true
}
```
```json
{
    "name": "survey",
    "author": "b01lers",
    "description": "Please fill out our feedback survey [here](...)!",
    "flag": "bctf{th4nks_for_f1lling_out_th3_surv3y!}",
    "hidden": false,
    "minPoints": 1,
    "maxPoints": 1,
    "tiebreakEligible": false
}
```

### Inputs

| Name       |         Required         | Default | Description                                                                                   |
|------------|:------------------------:|---------|-----------------------------------------------------------------------------------------------|
| rctf-url   | <ul><li>- [x] </li></ul> |         | The public URL of the rCTF instance you are deploying to (ex: `http://ctf.b01lers.com:9001`). |
| rctf-token | <ul><li>- [x] </li></ul> |         | The authentication token of the configured admin account for the rCTF instance.               |
| base-dir   |                          | `src`   | The directory to look for challenges in.                                                      |

### Outputs
- `deployed` — the challenge IDs of the deployed challenges, as a `string[]`.
- `categories` — the names of the detected challenge categories, as a `string[]`.

### Example usage
```yml
name: Upload challenge metadata to rCTF on merge
on:
  push:
    branches:
      - main
    paths:
      - "src/**"
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: b01lers/rctf-deploy-action@main
        with:
          rctf-url: 'http://ctf.b01lers.com:9001'
          rctf-token: ${{ secrets.RCTF_TOKEN }}
```
