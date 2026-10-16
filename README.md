# Book Covers

**把一本书的余韵，留在一幅画里。**

[在线画廊](https://zjuzhiyucai.github.io/book-covers/) · [English](README.en.md) · [安装 Skill](#安装-skill) · [下载发布包](https://github.com/ZJUZhiyuCai/book-covers/releases/latest)

![Book Covers — 文学封面、提示词与可复用 Skill](press/github-cover.png)

Book Covers 是一个开放的文学封面实验：用暖白纸面、少量墨色和有情绪的空间，重新想象中外文学作品的封面。首辑包含 **10 张原创生成插画、20 张中英文排版封面**，以及可以继续创作的 Agent Skill。

从《平凡的世界》的一条小路，到《老人与海》的一叶小舟，先找到故事里的关系，再决定画什么。

## 可以直接使用什么

- **封面集**：每本书都有独立页面、构图说明、无字原图与中英文 PNG 下载。
- **生成方法**：[book-covers](skills/book-covers/SKILL.md) 包含视觉规范、四张参考图、完整提示词模板和审图标准；可独立安装。
- **完整封面是默认交付**：原创插画、艺术性书名和作者一起导出。无字底图只是中间素材，只有明确要求时才单独交付。
- **排版与导出**：书名和作者单独排版后合成完整图片，字体转为路径，不依赖浏览器字体。
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

**把下面这段话发给 Codex 或其他支持 Skills 的 Agent，让它完成安装：**

```text
请安装 Book Covers skill：
https://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers
使用你原生的技能安装方式，包含引用素材；如已安装，保留本地修改后更新。
完成后告诉我调用方式。
```

Codex 可通过内置 `skill-installer` 安装这个 GitHub 目录。安装单元只有 Skill 和它的参考素材；无需手动下载 ZIP、安装画廊依赖或系统字体。完成后，在下一轮对话中试试：

```text
使用 $book-covers 为路遥的《平凡的世界》设计一张完整封面。
书名五个字等大、等重，把作者也融入画面。
```

其他 Agent 可以使用原生安装器，或让 Agent 执行 [Skills CLI](https://github.com/vercel-labs/skills) 命令并选择对应宿主：

```sh
npx skills add ZJUZhiyuCai/book-covers --skill book-covers
```

这条可选 CLI 路径需要 Node/npm；Skill 本身不需要。完整的 Agent 安装说明、更新与核验方式见 [INSTALL.md](INSTALL.md)。实际创作需要宿主具备生图能力，安装 Skill 不会另外提供图像模型。

## 字体不应成为门槛

- **直接生成完整书封**：没有方便的字体文件或排版工具时，由生图工具同时生成插画、准确书名和作者，逐字核对成品。无需安装字体。
- **已有字体文件时排版**：本仓库直接读取随附的 OFL 字体，输出稳定、可编辑的文字层；不安装到系统，也不需要用户找字体。参考画廊继续使用这条路径，保留原插画像素。

中文主标题的字等大、等重，换行时也不把“平凡的”缩小或把“世界”放大。艺术感来自笔形、间距、位置和留白。译名与作者可以有独立层级；英文仍按语义安排正斜体与节奏。

[查看无需字体的《平凡的世界》实测示例](process/generated-lettering/ordinary-world-zh.png) · [完整提示词](prompts/ordinary-world-generated-lettering.txt) · [生成记录](process/generated-lettering/provenance.json)。此示例的文字由生图工具绘制；参考画廊里的对应作品仍使用字体文件排版。

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
npm run compose -- --spec examples/complete-cover.json --out output/custom
```

`compose` 可处理画廊之外的书籍：复制示例 JSON，填写准确的中英文书名、作者、断行和插画路径即可。插画路径相对于 JSON 所在目录；输出两种语言的完整 PNG、WebP 与来源记录。不会自动加入公开画廊，也不会默认覆盖已有成品。

封面原始尺寸为 1024 × 1536。更大的导出尺寸属于放大排版输出，不会凭空增加插画细节。`npm run export -- --help` 查看参数。

## 继续做一本书

1. 用 Skill 提炼 brief，再调用生图工具。保持标题区域和作者区域清楚。
2. 将无字 PNG 放入 `artwork/`，实际提示词放入 `prompts/`。
3. 在 `catalog.json` 添加中英文书目信息、断行、构图说明和生成记录。写入源文件 SHA-256。
4. 运行检查与构建，查看大图和 180 px 缩略图，确认画面、文字和系列关系。

具体字段及贡献约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。一张新作应带来不同的文学空间；不需要为了数量重复已有构图。

```text
skills/book-covers/  可独立安装的视觉 Skill
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

参考画廊的插画与文字分层保存。插画负责空间、质感与情绪；排版器负责准确的字形、语言、行宽和留白。中文整组书名等大等重，中英文分别设计字形和断行：朱雀仿宋的刻本气质、少量毛笔竖排，以及 Cormorant 正斜体的节奏。书名、译名、作者各有层次，具体选择写入可编辑的排版数据。下载文件使用字体路径，网页字体按实际字符生成小型 WOFF2 子集。

画廊使用静态 HTML/CSS 和少量原生 JavaScript。筛选和图层切换是渐进增强；书目、作品页面与下载链接无需客户端框架。构建时验证每张源图的校验值和全部本地链接。GitHub Actions 运行检查，再部署到 GitHub Pages。更多取舍见 [设计说明](docs/design.md)。

## 许可与致谢

代码、提示词和 Skill 指令使用 [MIT](LICENSE)。原创生成插画及其衍生图使用 [CC BY 4.0](LICENSE-ARTWORK)，以贡献者可许可的权利为限。字体使用 [OFL 1.1](fonts/OFL.txt)。完整素材来源与署名方式见 [ASSETS.md](ASSETS.md)。

创作与策划：[蔡志宇 Zhiyu Cai](https://caizhiyu.com/)。字体来源与许可见 [ASSETS.md](ASSETS.md)。
