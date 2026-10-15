# Quiet Covers · 纸间

**把一本书的余韵，留在一幅画里。**

[在线画廊](https://zjuzhiyucai.github.io/quiet-covers/) · [English](README.en.md) · [安装 Skill](#安装-skill) · [下载发布包](https://github.com/ZJUZhiyuCai/quiet-covers/releases/latest)

![Quiet Covers — 文学封面、提示词与可复用 Skill](press/github-cover.png)

Quiet Covers 是一个开放的文学封面实验：用暖白纸面、少量墨色和有情绪的空间，重新想象中外文学作品的封面。首辑包含 **10 张原创生成插画、20 张中英文排版封面**，以及可以继续创作的 Agent Skill。

从《平凡的世界》的一条小路，到《老人与海》的一叶小舟，先找到故事里的关系，再决定画什么。

## 可以直接使用什么

- **封面集**：每本书都有独立页面、构图说明、无字原图与中英文 PNG 下载。
- **生成方法**：[quiet-book-covers](skills/quiet-book-covers/SKILL.md) 包含视觉规范、四张参考图、完整提示词模板和审图标准；可独立安装。
- **排版与导出**：书名和作者单独排版，字体转为路径，不依赖本机字体，不让生图模型拼写书名。
- **完整过程**：实际使用的提示词、生成记录、原图校验值，以及两张封面修正前的首稿。
- **展示素材**：五张 1440 × 1920 竖版作品图与 GitHub 横版介绍图，见 [press/](press/)。

插画使用 OpenAI 内置生图工具制作；图像生成具有随机性。本项目开放的是可复用的方法和实际素材，不承诺用同一提示词生成完全相同的像素。画廊本身不调用生图 API，也不需要密钥。

## 第一辑：故事与留白

| 中国文学 | 外国文学 |
|---|---|
| 《平凡的世界》· 路遥 | 《基督山伯爵》· 大仲马 |
| 《边城》· 沈从文 | 《钢铁是怎样炼成的》· 尼古拉·奥斯特洛夫斯基 |
| 《白马啸西风》· 金庸 | 《老人与海》· 欧内斯特·海明威 |
| 《红楼梦》· 曹雪芹 | 《变形记》· 弗朗茨·卡夫卡 |
| 《骆驼祥子》· 老舍 | 《到灯塔去》· 弗吉尼亚·伍尔夫 |

四张奠基作品来自个人网站书架的视觉探索；其余六张为本项目新作。这些是独立设计实验，不对应某个出版版本，也不提供小说全文。

## 安装 Skill

需要一个支持图片生成和本地技能的 Agent。**只使用 Skill 不需要 Node.js**：下载发布包中的 `quiet-book-covers-v1.1.0.zip`，将里面的 `quiet-book-covers` 文件夹放入你的技能目录。Codex 默认目录为 `~/.codex/skills/`；如果配置了 `CODEX_HOME`，使用其下的 `skills/`。

也可以从项目安装（Node.js 22+）：

```sh
git clone https://github.com/ZJUZhiyuCai/quiet-covers.git
cd quiet-covers
npm ci
npm run skill:install
```

安装器保留已有同名 Skill，不会默认覆盖。审阅本地修改后，可以显式使用 `npm run skill:install -- --force` 更新。重新加载 Agent 会话后使用：

```text
使用 $quiet-book-covers 为《边城》设计一张封面。
先从故事里提炼一种情绪和一处空间，生成无字插画，再排中文书名和作者。
```

```text
Use $quiet-book-covers to design a cover for To the Lighthouse.
Keep the lighthouse small and let distance carry the emotion.
Deliver the artwork, English cover and exact generation prompt.
```

其他支持目录式技能的 Agent 可使用同一文件夹；图片生成与文件导出能力以具体宿主为准。没有生图能力时，Skill 会交付提示词并明确说明图片尚未生成。

## 本地运行与导出

Node.js 22+。安装依赖后，构建和导出均可离线执行。

```sh
npm ci
npm run dev
# http://127.0.0.1:4187/
```

开发服务启动时构建一次。编辑内容后运行 `npm run build` 并刷新浏览器；可通过 `PORT=4190 npm run dev` 更换端口。

```sh
npm test                    # 元数据、渲染、源图完整性、HTTP 行为
npm run build               # 双语静态画廊、WebP 预览、20 张 PNG 下载
npm run export              # 五张竖版作品图 + 横版介绍图 → output/
npm run export -- --book ordinary-world --lang en
npm run export -- --book border-town --lang zh --width 2048
```

封面原始尺寸为 1024 × 1536。更大的导出尺寸属于放大排版输出，不会凭空增加插画细节。`npm run export -- --help` 查看参数。

## 继续做一本书

1. 用 Skill 提炼 brief，再调用生图工具。保持标题区域和作者区域清楚。
2. 将无字 PNG 放入 `artwork/`，实际提示词放入 `prompts/`。
3. 在 `catalog.json` 添加中英文书目信息、断行、构图说明和生成记录。写入源文件 SHA-256。
4. 运行检查与构建，查看大图和 180 px 缩略图，确认画面、文字和系列关系。

具体字段及贡献约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。一张新作应带来不同的文学空间；不需要为了数量重复已有构图。

```text
skills/quiet-book-covers/  可独立安装的视觉 Skill
catalog.json              中英文书目、设计意图、图片校验值
artwork/                  10 张保留原样的生成插画
prompts/                  实际生成与修正提示词
process/                  两次作者留白修正的输入图
src/                      静态页面、样式、渐进增强交互
scripts/                  生成页面、字体排版、导出与本地预览
press/                    可分享作品图与文案草稿
fonts/                    中英文字体、来源校验值与 OFL 许可
tests/                    内容、渲染与服务行为验证
```

## 设计与实现

插画与文字是两层。插画负责空间、质感与情绪；排版器负责准确的字形、语言、行宽和留白。中文与英文分别设计字形和断行：朱雀仿宋的刻本气质、少量毛笔竖排，以及 Cormorant 正斜体的节奏。书名、译名、作者各有层次，具体选择写入可编辑的排版数据。下载文件使用字体路径，网页字体按实际字符生成小型 WOFF2 子集。

画廊使用静态 HTML/CSS 和少量原生 JavaScript。筛选和图层切换是渐进增强；书目、作品页面与下载链接无需客户端框架。构建时验证每张源图的校验值和全部本地链接。GitHub Actions 运行检查，再部署到 GitHub Pages。更多取舍见 [设计说明](docs/design.md)。

## 许可与致谢

代码、提示词和 Skill 指令使用 [MIT](LICENSE)。原创生成插画及其衍生图使用 [CC BY 4.0](LICENSE-ARTWORK)，以贡献者可许可的权利为限。字体使用 [OFL 1.1](fonts/OFL.txt)。完整素材来源与署名方式见 [ASSETS.md](ASSETS.md)。

创作与策划：[蔡志宇 Zhiyu Cai](https://caizhiyu.com/)。字体来源与许可见 [ASSETS.md](ASSETS.md)。
