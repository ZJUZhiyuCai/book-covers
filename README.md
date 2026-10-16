# Book Covers

**把一本书的余韵，留在一幅画里。**

[在线画廊](https://zjuzhiyucai.github.io/book-covers/) · [English](README.en.md) · [安装 Skill](#安装-skill) · [发布记录](https://github.com/ZJUZhiyuCai/book-covers/releases)

![Book Covers — 文学封面、提示词与可复用 Skill](press/github-cover.png)

Book Covers 是一个开放的文学封面实验：暖白纸面、少量墨色、有情绪的空间，以及单独设计的中英文标题。首辑包含 **10 张原创生成插画、20 张排版封面**，和可独立安装的 Agent Skill。

## 三项默认交付

| 输出 | 内容 |
|---|---|
| 无字 PNG | 保留完整的生成插画 |
| 带字 PNG | 用真实字体文件排入准确书名与作者，文字不交给生图模型绘制 |
| 生图提示词 | 可直接复制的完整文本，同时提供 TXT 文件 |

单语请求得到三个文件。双语请求分别排版，增加另一语言的带字 PNG；原图和提示词共用。每本书的画廊页面都有直接下载与复制入口。过程记录、可编辑排版方案和 WebP 预览可另行保留，不混入默认三项交付。

## 安装 Skill

**把这段话交给 Codex 或其他支持 Skills 的 Agent：**

```text
请安装 Book Covers skill：
https://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers
使用你原生的技能安装方式，包含 references 和 runtime；如已安装，保留本地修改后更新。
完成后告诉我调用方式。
```

Codex 可使用内置 `skill-installer`。无需手动下载 ZIP，也不用克隆整个画廊。安装后，在宿主刷新技能发现的下一轮对话中使用：

```text
使用 $book-covers 为路遥的《平凡的世界》设计中文封面。
交付无字 PNG、含书名与作者的非生图排版 PNG、可复制的生图提示词。
```

其他 Agent 可用原生安装器，或 [Skills CLI](https://github.com/vercel-labs/skills)：

```sh
npx skills add ZJUZhiyuCai/book-covers --skill book-covers
```

创作需要宿主的生图能力和本地执行能力。随 Skill 安装的排版器需要 Node.js 22+；Agent 用 npm 准备依赖，自动下载有固定版本和 SHA-256 校验的开源字体。不要求安装系统字体，也不要求用户寻找字体文件。首次准备后可离线排版。详见 [安装核验](INSTALL.md) 与 [排版工具用法](skills/book-covers/references/runtime.md)。安装 Skill 不会附赠图像模型或 API 凭据。

## 字体与构图

《红楼梦》的竖排、《边城》的疏朗短题、《到灯塔去》的标题节奏，以及《白马啸西风》的毛笔字形，是当前保留的排版基准。中文主标题的字等大、等重；艺术感来自笔形、间距、轴线和留白。英文采用 Cormorant 正体与真正的斜体，按语义决定层级。

[排版参考](skills/book-covers/references/typography.md) · [设计判断与局限](docs/design.md) · [本轮审查](docs/review-v1.4.0.md)

v1.4 调整《平凡的世界》《基督山伯爵》《钢铁是怎样炼成的》的中文排版，以及《老人与海》的英文排版；保留全部原始插画与上述四套认可的中英文排版。过去的整图生成文字实验保留在 `process/generated-lettering/`，供追溯，已退出默认工作流。

## 第一辑：故事与留白

| 中国文学 | 外国文学 |
|---|---|
| 《平凡的世界》· 路遥 | 《基督山伯爵》· 大仲马 |
| 《边城》· 沈从文 | 《钢铁是怎样炼成的》· 尼古拉·奥斯特洛夫斯基 |
| 《白马啸西风》· 金庸 | 《老人与海》· 欧内斯特·海明威 |
| 《红楼梦》· 曹雪芹 | 《变形记》· 弗朗茨·卡夫卡 |
| 《骆驼祥子》· 老舍 | 《到灯塔去》· 弗吉尼亚·伍尔夫 |

这些是独立设计实验，非出版社版本，不提供小说全文。插画由 OpenAI 内置生图工具生成；具体模型版本未由工具提供。开放的是实际素材与可复用过程，不承诺相同提示词生成相同像素。

## 本地运行与导出

```sh
npm ci
npm run dev                 # http://127.0.0.1:4187/
npm test                    # 内容、排版、三项交付、源图保护、HTTP 行为
npm run build               # 画廊、20 张带字 PNG、无字原图与可复制提示词
npm run export              # 五张竖版作品图与横版介绍图 → output/
npm run compose -- --spec examples/complete-cover.json --out output/custom
```

开发服务启动时构建一次，修改后执行 `npm run build` 并刷新。`PORT=4190 npm run dev` 可换端口。画廊依赖准备完成后，构建与导出不联网。

`compose` 也能处理公开目录以外的书。复制示例 JSON，填写所需语言的书名、作者、断行，以及相对该 JSON 的插画和提示词路径。默认输出三类文件；`--webp` 与 `--receipt audit.json` 按需添加预览和来源记录。已有成品默认受保护，`--force` 也不能覆盖输入文件。

源图为 1024 × 1536；放大导出不会增加插画细节。封面当前适合屏幕展示，尚不包含实体印刷需要的出血、书脊和色彩打样。

## 贡献与实现

[贡献流程](CONTRIBUTING.md)要求保留实际提示词、源图和修正记录。每张新作应增加一个不同的文学空间，而不是为数量重复景物。

```text
skills/book-covers/  独立 Skill、参考图与便携排版工具
catalog.json        中英文书目、设计意图、排版方案和源图校验值
artwork/            10 张原始生成插画
prompts/            实际生成与修正提示词
process/            历史修正、实验输入与证据
src/                静态页面、样式与渐进增强交互
scripts/            构建、导出、本地预览
press/              可分享作品图
fonts/              画廊使用的字体文件、来源与 OFL 许可
tests/              内容、导出与服务验证
```

画廊使用静态 HTML/CSS 和少量 JavaScript，没有分析追踪或生图后端。画廊与独立 Skill 共用排版核心：fontkit 生成字形路径，sharp 合成 PNG；实际墨迹边界用于检查重叠与越界。界面字体用 subset-font 制作小型 WOFF2。GitHub Actions 运行测试、构建和发布。

## 许可与致谢

代码、提示词和 Skill：[MIT](LICENSE)。原创插画及衍生图：[CC BY 4.0](LICENSE-ARTWORK)，以可许可权利为限。字体：[OFL](fonts/OFL.txt)，各字体原始声明随项目与 Skill 提供。完整来源和署名方式见 [ASSETS.md](ASSETS.md)。

创作与策划：[蔡志宇 Zhiyu Cai](https://caizhiyu.com/)。
