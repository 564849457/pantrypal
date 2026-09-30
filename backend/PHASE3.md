# 第三阶段：Java 身份验证与菜谱权限

本更新建立在已跑通第二阶段的版本上。保留 Auth.js Google 登录，不新增登录页面或账号密码。

## 实现范围

- 公开菜谱列表、搜索、分类和详情仍可匿名访问。
- Java /api/v1/me 识别当前用户，返回 id、name、image。
- Java /api/v1/me/recipes/{id} 返回当前用户的 isOwner、isFavorited、userRating。
- Java /api/v1/me/recipes/{id}/edit-permission：作者 200，其他用户 403，未登录 401，不存在 404。
- 前端详情页的个人状态改由 Java 查询；编辑页在显示表单前向 Java 检查权限。
- 新增/编辑/删除、收藏/评分写入仍由现有 Next.js Server Actions 校验并执行，尚未迁移到 Java。
- requireOwner 是后续 Java 写入服务可复用的检查，未来写入时必须在服务端再次执行，不能依赖此前的检查结果或按钮是否显示。

## 安装

1. 保存当前版本，停止前后端。
2. 将更新包里的 backend、src 合并到 D:\pantrypal，不要删除原目录。
3. pom.xml 增加 Spring Security。IDEA 点击 Maven 的 Reload/Sync 下载依赖。
4. 在 PowerShell 验证：

```powershell
cd D:\pantrypal\backend
mvn test
```

5. IDEA 重新运行 PantryPalApplication。
6. 前端在另一个终端运行：

```powershell
cd D:\pantrypal
npm.cmd run dev
```

不需要修改现有环境变量，不需要迁移数据库。Java 和 Next.js 必须连接同一 Neon 分支、同一个数据库。
Java 仍为只读数据源，需要读取 Session、User、Recipe、Favorite、Rating 表。
不要直接运行旧 JAR。更新包同时包含新 JAR；用 IDEA 运行时无需另开 JAR。

## 本机验收

1. 打开 http://localhost:3000，使用原来的 Google 登录。
2. 在同一浏览器打开 http://localhost:3000/api/backend/me。
   应返回你的 id、name、image，响应中没有会话 token。
3. 退出登录后刷新同一个地址，应返回 401 和 {"error":"unauthorized"}。
4. 无痕窗口不登录，列表/搜索/详情仍可浏览；/api/backend/me 应为 401。
5. 登录后看菜谱详情，收藏状态和自己的评分正常；自己的菜谱可进入编辑页。
6. 如有第二个测试账号，尝试打开不属于它的 /recipes/菜谱ID/edit，应返回详情页而不显示编辑表单。
   请用开发分支数据验证，不必为本次只读验收新建或删除线上数据。

在浏览器直接打开 http://127.0.0.1:8080/api/v1/me 返回 401 是正常的。
Java 只接受 Authorization: Bearer 请求头，不读取浏览器的 Auth.js Cookie。
/api/backend/me 是 Next.js 服务端转发验证入口，会读取当前浏览器的 HttpOnly 会话 Cookie。
登录和验证都使用 localhost:3000，不要切换到 127.0.0.1:3000，否则浏览器不会带同一个域名的 Cookie。

断点验证：可在 SessionRepository.findActive、CurrentUserController.me、RecipeAccessService.requireOwner 打断点。
前端超时为 10 秒，暂停后及时 F9 放行。

## 状态码

- 401：未登录、会话过期/被撤销、会话不存在。先尝试重新登录。
- 403：已登录但无权限。
- 503：认证数据库或 Java API 不可用；不自动当成匿名用户掩盖错误。
- 若 Next.js 显示已登录但 Java 一直 401，检查前后端是否用了不同 Neon 分支。

## 认证设计

当前 Auth.js 使用 database session，Cookie 是不透明的会话令牌，不是 JWT，也不是 Google access token。
Next.js 只在服务端读取此 Cookie，作为 Bearer 头传给固定的 Java API 地址。
Java 每次查询 Session 和 User，检查 expires；注销删掉会话后，下次请求立即失效。
不接受 query 参数 userId、X-User-Id 或 Java 请求中的 Cookie 作为身份依据。
个人数据不进入共享缓存。不会将 token 返回客户端 JavaScript，不写入 localStorage，不记录 token。
兼容 Auth.js v5 默认普通 Cookie 名、__Secure- Cookie 名和分块 Cookie。
若以后修改 Auth.js cookie 名或 session 策略，需要同步更新桥接代码。

Java 采用无 HTTP Session 的 Spring Security 过滤链，关闭表单登录、Basic 登录和 Java Cookie 认证。
Java CSRF 关闭的前提是只接受显式 Bearer 头，浏览器端 Auth.js 和 Next.js Server Actions 的保护仍保留。
以后新增写入入口必须保持这个边界，或重新评估 CSRF；不能直接新增未经保护的 Cookie 写入 API。
非本机认证请求要求 HTTPS；当前 http://127.0.0.1:8080 可以继续使用。
云部署时配置 HTTPS Java 地址。共享会话数据库是这次渐进迁移的设计，尚未变成独立身份服务。

## 验证范围

- Maven 全部 24 个测试通过，其中 13 个使用真实 Spring Security 过滤链验证身份边界。
- 测试覆盖匿名、无效/过期令牌、伪造身份参数、401/403、作者校验、跨请求身份隔离、数据库失败 503、禁止 Java 写入。
- PGlite 使用项目原始迁移执行生产 SQL，验证真实过期时间、时区、撤销、删除用户、绑定参数、归属及收藏/评分隔离。
- Next.js 真实路由配合样例 Java 服务，验证服务端 Bearer 转发、Cookie 不整包转发、个人信息字段白名单、no-store、退出及上游故障。
- 前端类型与 ESLint 检查通过。
- 尚未使用你的 Google 账号/Neon 凭据做端到端登录；需要按上方本机验收确认。

SQL 测试：进入 backend/verification，执行 npm.cmd install 和 npm.cmd test，只运行隔离内存样例数据。

## 回退

优先恢复安装前的源码提交并重启。临时移除 RECIPE_API_URL 并重启前端，也可回到原 Prisma 读取/权限逻辑。
不要提交 .env、会话 token、带数据库密码的 IDEA 配置和构建产物。
