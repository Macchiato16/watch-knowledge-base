<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ImageViewer from './components/ImageViewer.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <ImageViewer />
    </template>
  </Layout>
</template>
