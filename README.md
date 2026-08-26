# dsh-cloudq

CloudQ integration for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It adds a CloudQ mode to the Web profile, bundles the `cloudq` skill, exposes CloudQ usage and architecture views, and provides local credential and plugin-management settings.

## Requirements

- Node.js `>=22.19.0`
- DeepSeek Harness `0.1.1-rc.2` or a compatible newer `0.1.x` release
- `pnpm` available to the `dsh plugin` command
- Python 3 available as `python3`
- macOS or Linux

## Install

```sh
dsh plugin --profile web add dsh-cloudq
```

Restart the Web profile after installation:

```sh
dsh --profile web
```

Open the URL printed by DSH. The conversation input area and sidebar will expose the CloudQ entry. You can also invoke the bundled skill explicitly with `/cloudq`.

## Upgrade and remove

```sh
dsh plugin --profile web update dsh-cloudq
dsh plugin --profile web remove dsh-cloudq
```

Restart the Web profile after changing the installed package set.

## Credentials

The settings card supports the CloudQ OAuth flow and manually supplied Tencent Cloud `SecretId`/`SecretKey` credentials.

- Credentials are stored locally at `~/.tencent-cloudq/credential.json` with owner-only permissions.
- Secret values are sent to Python helpers through standard input, never command-line arguments.
- Browser APIs return only credential state and masked identifiers; local credential paths and secret values are not returned.
- Use the logout action to remove the stored credential.

Use credentials with the minimum permissions required for the CloudQ operations you intend to run. The bundled skill can invoke read and write cloud-management operations; review each requested action before approving it.

## Security model

- Host APIs accept only loopback, same-origin requests.
- JSON request bodies are limited to 64 KiB.
- Python helper output is bounded and unexpected internal errors are not returned to the browser.
- Remote values are inserted with DOM text nodes rather than HTML injection.
- Download links require HTTPS.
- No credentials, tokens, or local environment files are included in the npm package.

Security reports can be submitted through the repository issue tracker without including live credentials.

## Development

```sh
pnpm install
pnpm run lint
pnpm run typecheck
pnpm run test:all
pnpm run build
pnpm run check:client
npm pack --dry-run --registry=https://registry.npmjs.org/
```

The npm package contains prebuilt Host and Web client artifacts, the bundle patch, the required CloudQ logo, and the bundled skill. Registry installation does not require package build scripts.

## Repository layout

```text
src/                         Host and Web client source
skills/cloudq/               Bundled CloudQ skill and Python helpers
assets/cloudq.png            Runtime logo served by the Host
scripts/                     Build and release checks
tests/                       Unit, integration, and package-contract tests
cordis.patch.yml             DSH bundle layer
```

## Release

The initial release is published manually to the official npm registry. Subsequent tagged releases use npm Trusted Publishing from GitHub Actions; the workflow does not store a long-lived npm token.

## License

MIT. See [`LICENSE`](LICENSE).
