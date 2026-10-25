import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  description: string
  tags: string[]
}

declare const data: Post[]
export { data }

/**
 * 在构建 / dev 启动时扫描 posts 目录，生成首页要用的文章列表。
 * 新增或修改 posts/*.md 会自动触发 HMR，无需重启 dev server。
 *
 * 约定（全部可选，未填时会尝试从正文里推断）：
 *   ---
 *   title: 文章标题        # 缺省取正文第一个 # 标题，再缺省取文件名
 *   date: 2024-01-01       # 缺省时按标题排序
 *   description: 摘要      # 缺省取正文第一段
 *   tags: [go, 并发]       # 缺省为空
 *   ---
 */
export default createContentLoader('posts/*.md', {
  includeSrc: true,
  transform(raw): Post[] {
    return raw
      // 排除 posts/index.md 这类目录首页（url 以 / 结尾）
      .filter((page) => !page.url.endsWith('/'))
      .map(({ url, frontmatter, src = '' }) => ({
        title: frontmatter.title || extractTitle(src) || titleFromUrl(url),
        url,
        date: normalizeDate(frontmatter.date),
        description: frontmatter.description || extractDescription(src),
        tags: normalizeTags(frontmatter.tags)
      }))
      .sort(
        (a, b) =>
          compareDesc(a.date, b.date) ||
          a.title.localeCompare(b.title, 'zh-Hans-CN')
      )
  }
})

function stripFrontmatter(src: string): string {
  return src.replace(/^---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/, '')
}

function extractTitle(src: string): string {
  const match = stripFrontmatter(src).match(/^#\s+(.+?)\s*$/m)
  return match ? match[1].replace(/[`*_]/g, '').trim() : ''
}

function extractDescription(src: string): string {
  const body = stripFrontmatter(src)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  for (const block of body.split(/\r?\n\s*\r?\n/)) {
    const text = block.trim()
    if (!text) continue
    // 跳过标题、引用、列表、表格、HTML、图片等非段落块
    if (/^(#{1,6}\s|>|[-*+]\s|\d+\.\s|\||<|!\[|---)/.test(text)) continue

    const plain = text
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (plain) {
      return plain.length > 140 ? plain.slice(0, 140) + '…' : plain
    }
  }
  return ''
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string') {
    const match = value.match(/^\d{4}-\d{2}-\d{2}/)
    return match ? match[0] : value
  }
  return ''
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    return value.split(/[,，\s]+/).filter(Boolean)
  }
  return []
}

function titleFromUrl(url: string): string {
  return decodeURIComponent(url.replace(/^.*\//, '').replace(/\.html?$/, ''))
}

function compareDesc(a: string, b: string): number {
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1
  return a < b ? 1 : a > b ? -1 : 0
}
