# 第二阶段：搜索、分类和分页

适用基础：第一阶段 Java API 已运行，前端 .env 已有 RECIPE_API_URL。

## 安装

1. 保存并提交当前可运行版本，停止 IDEA 的 Java 程序及前端 dev 服务。
2. 解压后，将 backend 和 src 合并进 D:\pantrypal，覆盖本包同名文件。
   不要删除原来的目录。本包不包含 .env、application.yml、IDEA 运行配置、package.json、package-lock.json 或数据库迁移。
3. 在 PowerShell 验证后端：

```powershell
cd D:\pantrypal\backend
mvn test
```

4. 在 IDEA 重新运行 PantryPalApplication，保留你配好的 JDBC_DATABASE_URL、DB_USERNAME、DB_PASSWORD。
5. 在另一个终端重新启动前端：

```powershell
cd D:\pantrypal
npm.cmd run dev
```

压缩包同时包含更新后的 backend/pantrypal-api.jar，只有从命令行运行 JAR 时才会用到它。
使用 IDEA 运行源码即可，无需额外启动 JAR。

## 页面操作

- 输入关键词后按 Enter 或点击“搜索”，不会每输入一个字就请求数据库。
- 点击分类立即应用当前搜索框的内容，并回到第一页。
- 默认每页 12 条，上一页/下一页保留已提交的条件。
- 地址栏保留 q、category、page、size，可以刷新或分享。
- “本页 N 道菜谱”仅表示当前页数量，不是搜索结果总数。
- 收藏页仍沿用现有本地筛选，未迁移收藏相关认证或写入。

## 你本机验收（菜谱少时用每页 2 条）

1. 打开 http://localhost:3000/recipes?size=2，应显示最多两张卡片。
2. 点击“下一页”，看到其他菜谱；“上一页”能返回。
3. 搜索“虾”或“SHRIMP”，检查返回结果；再搜索某个食材名称。
4. 搜索后选择一个分类，结果应同时满足两个条件。
5. 搜索明显不存在的词，显示空结果；“重置筛选”能恢复。
6. 在第二页搜索，页码应回到第一页；浏览器返回应恢复原来的条件。
7. 打开首页、菜谱详情、收藏页，检查原有入口仍然正常。

可直接检查 Java API：
- http://127.0.0.1:8080/api/v1/recipes?q=虾&page=0&size=2
- http://127.0.0.1:8080/api/v1/recipes/categories
- 用分类接口返回的 id 作为 category 参数。

若需要断点验证，在 RecipeController.list 的 repository.list 行打断点，并在前端点击搜索。
API 超时为 10 秒，命中断点后及时按 F9 放行，避免前端等到超时。

## 验证记录与范围

- Maven：11 个测试通过，包含过滤参数传递、长度校验、分页、分类、404 和错误响应。
- SQL：用现有 Prisma 迁移在隔离 PGlite 中执行真实查询，覆盖中英文/食材搜索、分类交集、字面百分号及下划线、注入字符串、空页和稳定排序。
- 前端：TypeScript、ESLint 通过；URL 参数边界检查通过。
- 浏览器：真实列表组件及服务端读取代码配合样例 API，验证搜索、分类、翻页、清除、历史返回、中文及移动端无横向溢出。
- 未连接你的 Neon；安装后的本机联调按上方步骤验证。

此阶段使用字面子串搜索，不含拼写纠错或模糊语义匹配；大规模数据再评估全文搜索或 trigram 索引。
分页按 createdAt 降序、id 升序排序；若翻页过程中有新增/删除，偏移分页可能发生位置移动。

## 回退

可恢复安装前的 Git 提交中本次修改的源码，再重启前后端。
也可以先移除 RECIPE_API_URL 并重启前端：列表会用 Prisma 执行等价的筛选分页。
