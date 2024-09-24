# rctf-deploy-action
Opinionated challenge metadata updater for rCTF deployment.

### Inputs

| Name       | Required                 | Default | Description                                                                                   |
|------------|--------------------------|---------|-----------------------------------------------------------------------------------------------|
| rctf-url   | <ul><li>- [x] </li></ul> |         | The public URL of the rCTF instance you are deploying to (ex: `http://ctf.b01lers.com:9001`). |
| rctf-token | <ul><li>- [x] </li></ul> |         | The authentication token of the configured admin account for the rCTF instance.               |

### Outputs
- `deployed` — the challenge IDs of the deployed challenges, as a `string[]`.
