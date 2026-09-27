# PantryPal Java API — 第一阶段

这个目录实现菜谱的只读 API，兼容现有 Prisma 表名、字符串 ID 和中英文内容。
采用 Spring Boot 3.5.16、Java 17+、Spring JDBC、PostgreSQL。推荐本机使用 JDK 21。
参考 yildizmy/recipe-app 的分层思路，新写查询实现，不导入其不兼容的旧表结构。

## 1. 安装和准备

将压缩包里的 backend 和 src 合并到 D:\pantrypal，允许覆盖压缩包中列出的文件。
不要删除整个 src。先备份被覆盖的三个 page.tsx 文件。
不会覆盖你的环境变量文件、next.config.ts、package.json 或 package-lock.json。

PowerShell 检查 Java：

```powershell
java -version
```

需要 Java 17 或更高。若没有 Java，安装 JDK 21 后重新打开终端。

在 Neon 中从目前已有菜谱的分支创建开发分支（例如 pantrypal-dev），保留现有数据副本。
后端和本地 Next.js 必须连接这个同一个开发分支，否则收藏、评分、编辑会读写不同数据。
把本地项目的 DATABASE_URL 和 DIRECT_URL 更新为开发分支的相应连接信息。
不要更新线上部署的环境变量。无需运行迁移、db push、reset 或 seed。

## 2. 启动 Java（第一个 PowerShell 窗口）

从 Neon 开发分支连接窗口找到 host、database、role 和密码。
连接池开关关闭后取得直接连接信息。Java 使用 JDBC URL，用户名密码分别设置。
把下面 HOST 替换为完整 Neon 主机名，DATABASE 替换为数据库名（通常 neondb），ROLE 替换为角色（通常 neondb_owner）。

```powershell
cd D:\pantrypal
$env:JDBC_DATABASE_URL = "jdbc:postgresql://HOST:5432/DATABASE?sslmode=verify-full"
$env:DB_USERNAME = "ROLE"
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", (Read-Host "Neon database password" -AsSecureString)).Password
java -jar .\backend\pantrypal-api.jar
```

密码输入时不会显示，以上环境变量只存在于当前终端。
后端不会自动读取 Next.js 环境变量文件。
默认监听 127.0.0.1:8080，只提供公开菜谱读取接口。
数据库连接配置为只读；不运行建表和迁移操作。仍建议数据库角色只授予所需 SELECT 权限。

浏览器打开：
http://127.0.0.1:8080/api/v1/recipes?page=0&size=3

看到 items 中的真实菜谱 JSON 后再继续。仅出现 Started 日志还不能证明数据库连接成功。
如果是 503，检查 host、role、密码和开发分支是否含有现有表；终端中有详细原因，不要公开完整连接信息。

## 3. 切换前端（第二个 PowerShell 窗口）

在 D:\pantrypal 的 .env 增加：

```dotenv
RECIPE_API_URL=http://127.0.0.1:8080
```

保持上述 Java 窗口运行，在第二个窗口执行：

```powershell
cd D:\pantrypal
npm.cmd run dev
```

刷新首页、菜谱列表、详情页。Java 负责公开菜谱读取，Next.js 继续负责登录、用户归属、收藏、评分和写入。
无需 NEXT_PUBLIC_ 前缀；Java 接口由 Next.js 服务端调用，浏览器不直接调用它。
列表仍由前端搜索/筛选；适配层读取所有分页，避免只显示前 100 条。
这适合当前小型菜谱集，大规模数据时需改为服务端搜索分页。
列表和首页继续使用原来的 300 秒缓存及 recipes 标签失效机制。
Java 停止后不会偷偷切回 Prisma，而会显示请求失败，避免掩盖部署错误。

## 4. 回退

删除或注释 RECIPE_API_URL，然后重启 npm.cmd run dev。
首页、列表、详情恢复由 Prisma 读取；UI 不变。

## API

| 请求 | 行为 |
| --- | --- |
| GET /api/v1/recipes?page=0&size=24 | items、page、size、hasNext；page 从 0 开始，size 1–100 |
| GET /api/v1/recipes/{id} | 菜谱、分类、食材、评分均值和数量 |
| 无效分页 | 400 |
| 不存在的菜谱 | 404 |
| 数据库访问失败 | 503，响应不包含数据库内部错误 |

不返回评分用户列表，不提供 Java 写入接口。

## 从源码构建

压缩包包含已构建 JAR，日常启动无需安装 Maven。
需要修改 Java 后重新构建时（要求 JDK 且首次下载需联网）：

```powershell
cd D:\pantrypal\backend
.\mvnw.cmd clean package
Copy-Item .\target\pantrypal-api-0.1.0.jar .\pantrypal-api.jar
```

## 验证范围

- 前端 TypeScript 与 ESLint 检查。
- Java 接口测试覆盖分页、空列表、参数校验、404、只读方法限制和数据库错误响应。
- SQL 用原有 Prisma migrations 在 PGlite 隔离数据库执行，验证字段映射、空关系、评分及参数绑定。
- JSON 结果再由 Java DTO 测试反序列化。
- 未连接你的 Neon，也未完成你本机 Google 登录及写入功能的端到端验证。
- PGlite 的 SQL 验证不等同于 Neon/JDBC/TLS 联调；以上浏览器打开真实接口是必要验收步骤。

参考文档：
https://docs.spring.io/spring-boot/3.5/system-requirements.html
https://pglite.dev/docs/

SQL 验证可从 backend/verification 目录运行 `npm.cmd install`、`npm.cmd test`。这只操作内存样例数据库，不使用 Neon 凭据。
