import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

mkdirSync(resolve(root, 'lib'), { recursive: true })

console.log('[build] Bundling host ESM (lib/index.js)...')
await build({
  entryPoints: [resolve(root, 'src/index.ts')],
  outfile: resolve(root, 'lib/index.js'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  external: [
    'node:*',
    'ws',
    'yaml',
    '@deepseek-ai/*',
    'cordis',
  ],
})

console.log('[build] Bundling client (lib/client.js)...')

// Simple plugin to handle css module by injecting <style> and exporting class map
const cssModulePlugin = {
  name: 'css-module-inline',
  setup(builder) {
    builder.onLoad({ filter: /\.module\.css$/ }, async (args) => {
      const source = readFileSync(args.path, 'utf8')
      // Extract class names
      const classNames = new Set()
      const regex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g
      let match
      while ((match = regex.exec(source)) !== null) {
        classNames.add(match[1])
      }

      // Prefix classes to avoid collision, sorting by length descending to avoid prefix overlap
      const sortedClasses = Array.from(classNames).sort((a, b) => b.length - a.length)
      let transformedCss = source
      const mapping = {}
      for (const cls of sortedClasses) {
        const scoped = `dsh-exp-${cls}`
        mapping[cls] = scoped
        transformedCss = transformedCss.replaceAll(new RegExp(`\\.${cls}(?=[^a-zA-Z0-9_-]|$)`, 'g'), `.${scoped}`)
      }

      const js = `
        const cssText = ${JSON.stringify(transformedCss)};
        if (typeof document !== 'undefined') {
          let style = document.getElementById('dsh-explorer-styles');
          if (!style) {
            style = document.createElement('style');
            style.id = 'dsh-explorer-styles';
            style.textContent = cssText;
            document.head.appendChild(style);
          }
        }
        export default ${JSON.stringify(mapping)};
      `
      return { contents: js, loader: 'js' }
    })
  },
}

const clientBuildResult = await build({
  entryPoints: [resolve(root, 'src/client/index.tsx')],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  write: false,
  plugins: [cssModulePlugin],
  external: [
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime',
    '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-conversation',
    '@deepseek-ai/dsh-client-ui-sidebar-right',
    '@deepseek-ai/dsh-client-modules',
  ],
})

const bundledClientCode = clientBuildResult.outputFiles[0].text

const clientWrapped = `window.__ModuleLoader__.load({
  id: "dsh-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

${bundledClientCode}

    return module.exports;
  }
});
`

writeFileSync(resolve(root, 'lib/client.js'), clientWrapped, 'utf8')
console.log('[build] Done! Artifacts created in lib/')

