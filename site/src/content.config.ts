import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// YAML 會把 2025.09、2025 這種值讀成數字，一律轉成文字
const text = z.coerce.string();
const link = z.object({ label: z.string(), url: z.string() });

// 個人資料：只有一份 src/content/profile.md
const profile = defineCollection({
  loader: glob({ pattern: 'profile.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    role: z.string(),                       // 一行身份：資管系三年級｜前端實習生
    tagline: z.string(),                    // 首頁大標：一句話說你是誰、在做什麼
    intro: z.string(),                      // 首頁副標：兩三句補充
    status: z.string().optional(),          // 現在在找什麼：正在找 2027 暑期前端實習
    location: z.string().optional(),
    avatar: z.string().optional(),          // 大頭照：/images/me.jpg（放在 public/images/）
    photos: z.array(z.string()).default([]), // 其他照片（關於頁用）：生活照、工作照
    email: z.string().optional(),
    resume: z.string().optional(),          // 履歷 PDF 網址或 /files/resume.pdf
    links: z.array(link).default([]),
    highlights: z.array(z.object({ value: text, label: z.string() })).default([]),
    skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })).default([]),
    traits: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    interests: z.array(z.string()).default([]),
    quote: z.string().optional(),
  }),
});

// 作品：一個作品一份 md，檔名用英文（會變成網址）
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),                    // 一句話：做了什麼、給誰用
    role: z.string().optional(),            // 我負責什麼
    period: text.optional(),          // 2025.09 – 2026.01
    tags: z.array(z.string()).default([]),
    results: z.array(z.string()).default([]), // 成果，最好有數字
    cover: z.string().optional(),           // 封面：作品截圖 /images/xxx.jpg；沒有就留空，版面會自己處理
    gallery: z.array(z.object({ src: z.string(), caption: z.string().optional() })).default([]), // 作品頁的更多截圖
    links: z.array(link).default([]),
    featured: z.boolean().default(false),   // 要不要放首頁
    order: z.number().default(99),          // 排序，小的在前
  }),
});

// 經歷：實習、打工、社團、幹部、志工、競賽，一段一份 md
const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    title: z.string(),                      // 職稱或角色
    org: z.string(),                        // 單位
    type: z.string().optional(),            // 實習／打工／社團／競賽／志工／課程
    start: text,                      // 2025-07（排序用）
    period: text,                     // 顯示用：2025.07 – 2025.08
    summary: z.string(),
    points: z.array(z.string()).default([]),
  }),
});

// 文章：心得、學習筆記；沒有文章，導覽列會自動藏起來
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
  }),
});

export const collections = { profile, projects, experience, posts };
