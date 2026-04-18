---
layout: home

hero:
  name: Life Cubed
  text: 一点想法
  tagline: 记录技术、阅读与生活里的一些思考
  actions:
    - theme: brand
      text: 全部文章
      link: '#posts'
    - theme: alt
      text: GitHub
      link: https://github.com/hex42/
---

<script setup>
import PostList from './.vitepress/theme/components/PostList.vue'
</script>

## 全部文章

<PostList />
