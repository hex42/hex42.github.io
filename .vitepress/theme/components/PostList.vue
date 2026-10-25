<script setup lang="ts">
import { data as posts } from '../posts.data'
</script>

<template>
  <div id="posts" class="post-list">
    <article v-for="post in posts" :key="post.url" class="post-item">
      <h3 class="post-item-title">
        <a :href="post.url">{{ post.title }}</a>
      </h3>
      <div v-if="post.date || post.tags.length" class="post-item-meta">
        <time v-if="post.date" :datetime="post.date">{{ post.date }}</time>
        <span v-for="tag in post.tags" :key="tag" class="post-item-tag">
          {{ tag }}
        </span>
      </div>
      <p v-if="post.description" class="post-item-description">
        {{ post.description }}
      </p>
    </article>
    <p v-if="!posts.length" class="post-list-empty">还没有文章。</p>
  </div>
</template>

<style scoped>
.post-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-item:first-child {
  padding-top: 0;
}

.post-item:last-child {
  border-bottom: none;
}

.post-item-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.post-item-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.post-item-title a:hover {
  color: var(--vp-c-brand-1);
}

.post-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.post-item-tag {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.post-item-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.post-list-empty {
  color: var(--vp-c-text-3);
}
</style>
