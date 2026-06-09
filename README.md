# Todo Management Web Application

Google OAuth認証を利用したタスク管理Webアプリケーションです。

ユーザーごとにタスクを管理でき、カレンダー表示や優先度フィルタによって効率的なタスク管理を実現します。

## Features

### ユーザー管理

* Google OAuthによるログイン
* JWT認証によるセッション管理
* ユーザーごとのタスク管理
* アカウント削除機能

### タスク管理

* タスクの追加
* タスクの削除
* タスクの達成 / 未達成管理
* タグ付け
* 優先度設定（5段階）

  * 最重要
  * 重要
  * 高
  * 中
  * 低
* 期限日設定

### タスク表示

* 付箋形式表示
* テーブル形式表示
* 月間カレンダー表示
* 優先度フィルタ機能

---

## System Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌───────────────────┐
│ Frontend (Next.js)│
│ Chakra UI         │
└──────┬────────────┘
       │ REST API
       ▼
┌───────────────────┐
│ Backend (FastAPI) │
│ JWT Authentication│
│ SQLModel ORM      │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ PostgreSQL        │
│ Docker Container  │
└───────────────────┘
```

---

## 技術スタック

### フロントエンド

* Next.js
* React
* TypeScript
* Chakra UI

### バックエンド

* FastAPI
* SQLModel
* PyJWT
* OAuth2 (Google Login)

### 使用したデータベース

* PostgreSQL

### 使用したインフラ技術

* Docker
* Nginx
* Ubuntu Server
* Cloudflare Zero Trust

---

## このプロジェクトの構造

### フロントエンド

```text
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── task/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── delete/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── PriorityFilter.tsx
│   │   ├── TaskAdd.tsx
│   │   ├── TaskCalendarMonth.tsx
│   │   ├── TaskFusen.tsx
│   │   ├── TasksTable.tsx
│   │   └── UserMenuDrawer.tsx
│   │
│   └── lib/
│       ├── api.ts
│       └── types.ts
└── .env.local
```

### バックエンド

```text
backend/
├── app/
│   ├── api/
│   │   └── routes.py
│   ├── auth.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── oauth_google.py
│   ├── schemas.py
│   └── security.py
└── .env
```

---

## データベース設計

### users

| Column     | Description       |
| ---------- | ----------------- |
| id         | User ID           |
| google_sub | Google Account ID |
| email      | Email Address     |
| full_name  | User Name         |
| picture    | Profile Image URL |
| is_active  | Account Status    |
| created_at | Registration Date |

### tasks

| Column      | Description       |
| ----------- | ----------------- |
| id          | Task ID           |
| task_name   | Task Name         |
| tag         | Task Tag          |
| detail_task | Task Detail       |
| priority    | Task Priority     |
| deadline    | Due Date          |
| achievement | Completion Status |
| owner_id    | User ID (FK)      |

---

## 認証の流れ

1. ログインボタンを押す
2. Googleの認証画面へ移動
3. Googleアカウントで認証
4. バックエンドがユーザー情報を取得
5. JWTトークン発行
6. Cookieへ保存
7. タスク管理ページへ遷移
