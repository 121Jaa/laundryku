# 🛠️ Development Guide

Panduan lengkap setup, arsitektur, dan deploy LaundryKu Express.

---

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Setup Environment](#setup-environment)
3. [Setup Supabase](#setup-supabase)
4. [Struktur Project](#struktur-project)
5. [Environment Variables](#environment-variables)
6. [Menjalankan Dev Server](#menjalankan-dev-server)
7. [Build & Deploy](#build--deploy)
8. [Troubleshooting](#troubleshooting)

---

## Prasyarat

| Tool | Versi | Link Download |
|------|-------|---------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm / pnpm | Terbaru | Built-in |
| Git | Terbaru | [git-scm.com](https://git-scm.com) |
| Akun Supabase | Gratis | [supabase.com](https://supabase.com) |

---

## Setup Environment

```bash
# Clone project
git clone <repo-url>
cd laundryku

# Install dependencies
npm install