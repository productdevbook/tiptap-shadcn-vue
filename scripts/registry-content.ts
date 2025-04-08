// Credits go to Shadcn UI and Shadcn Vue
// Modified by Selemondev

import type { Registry, RegistryFiles } from '../registry/schema'
import { readdir, readFile } from 'node:fs/promises'
import { parseSync } from 'oxc-parser'
import { join, resolve } from 'pathe'
import { compileScript, parse } from 'vue/compiler-sfc'

const DEPENDENCIES = new Map<string, string[]>([
  ['reka-ui', []],
  ['@vueuse/core', []],
])

const REGISTRY_URL = 'https://tiptap-shadcn-vue.pages.dev/r'
const REGISTRY_DEPENDENCY = '@/'

type ArrayItem<T> = T extends Array<infer X> ? X : never
type RegistryItem = ArrayItem<Registry>
export async function buildRegistry() {
  const registryRootPath = resolve('app', 'components')
  const registry = [] // This will hold all the UI registry items
  const uiPath = resolve(registryRootPath, 'ui')

  const [ui] = await Promise.all([
    traverseUI(uiPath),
  ])

  registry.push(...ui)

  return registry
}

async function traverseUI(rootPath: string) {
  const dir = await readdir(rootPath, { recursive: true, withFileTypes: true })

  const uiRegistry: Registry = []

  for (const dirent of dir) {
    if (!dirent.isDirectory())
      continue

    const componentPath = resolve(rootPath, dirent.name)
    const ui = await buildUIRegistry(componentPath, dirent.name)
    uiRegistry.push(ui)
  }

  return uiRegistry
}

async function buildUIRegistry(componentPath: string, componentName: string) {
  const dir = await readdir(componentPath, {
    withFileTypes: true,
  })

  const files: RegistryFiles[] = []
  const dependencies = new Set<string>()
  const registryDependencies = new Set<string>()
  const type = 'registry:ui'

  for (const dirent of dir) {
    if (!dirent.isFile())
      continue
    const filepath = join(componentPath, dirent.name)
    const relativePath = join('ui', componentName, dirent.name)
    const source = await readFile(filepath, { encoding: 'utf8' })
    const target = ''

    files.push({ content: source, path: relativePath, type, target })

    if (!dirent.name.endsWith('.vue'))
      continue

    const deps = await getFileDependencies(filepath, source)
    if (!deps)
      continue

    deps.dependencies.forEach(dep => dependencies.add(dep))
    deps.registryDependencies.forEach(dep => registryDependencies.add(dep))
  }

  return {
    name: componentName,
    type,
    files,
    registryDependencies: Array.from(registryDependencies),
    dependencies: Array.from(dependencies),
  } satisfies RegistryItem
}

async function getFileDependencies(filename: string, sourceCode: string) {
  const registryDependencies = new Set<string>()
  const dependencies = new Set<string>()

  function populateDeps(source: string) {
    const peerDeps = DEPENDENCIES.get(source)
    if (peerDeps !== undefined) {
      dependencies.add(source)
      peerDeps.forEach(dep => dependencies.add(dep))
    }

    if (source.startsWith(REGISTRY_DEPENDENCY) && !source.endsWith('.vue')) {
      const component = source.split('/').at(-1)!
      const jsonPath = component === 'utils' ? component : `${REGISTRY_URL}/${component}.json`
      registryDependencies.add(jsonPath)
    }
  }

  if (filename.endsWith('.ts')) {
    const ast = parseSync(sourceCode, {
      sourceType: 'module',
      sourceFilename: filename,
    })

    const sources = ast.program.body
      .filter((i: any) => i.type === 'ImportDeclaration')
      .map((i: any) => i.source)
    sources.forEach((source: any) => {
      populateDeps(source.value)
    })
  }
  else {
    const parsed = parse(sourceCode, { filename })
    if (parsed.descriptor.script?.content || parsed.descriptor.scriptSetup?.content) {
      const compiled = compileScript(parsed.descriptor, { id: '' })

      Object.values(compiled.imports!).forEach((value) => {
        populateDeps(value.source)
      })
    }
  }

  return { registryDependencies, dependencies }
}
