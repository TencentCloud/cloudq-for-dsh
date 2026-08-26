import { defineConfig } from 'tsdown'

const packageId = 'dsh-cloudq'
const clientExternals = [
  'react',
  'react/jsx-runtime',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-runtime/client',
  '@deepseek-ai/dsh-client-ui-conversation/client',
  '@deepseek-ai/dsh-client-ui-settings-plugins/client',
  '@deepseek-ai/dsh-client-ui-slots/client',
  '@deepseek-ai/dsh-client-ui-workspace/client',
]

export default defineConfig([
  {
    name: `${packageId}/host`,
    entry: { index: 'src/index.js' },
    outDir: 'lib',
    format: 'esm',
    platform: 'node',
    target: 'es2024',
    fixedExtension: false,
    dts: false,
    clean: false,
    external: [
      '@deepseek-ai/cordis',
      '@deepseek-ai/dsh-credentials',
      '@deepseek-ai/dsh-host-webserver',
      '@deepseek-ai/dsh-settings',
      '@deepseek-ai/schemastery',
      'js-yaml',
    ],
  },
  {
    name: `${packageId}/client`,
    entry: { client: 'src/client/index.js' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    dts: false,
    sourcemap: false,
    clean: false,
    external: clientExternals,
    noExternal: id => clientExternals.includes(id) ? undefined : true,
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(packageId)}, factory: (require) => {`,
      intro: 'var module = { exports: {} }; var exports = module.exports;',
      footer: 'return module.exports; } });',
    },
  },
])
