export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>掘金-文章</title>
    <style>
      .actions {
        padding: 10px 20px;
        position: sticky;
        top: 0;
        z-index: 1000;
        display: flex;
      }
      .post-list-warp {
        padding: 20px;
        border-bottom: 1px solid var(--vscode-breadcrumb-foreground);
        transition: all 0.5s ease-out;
      }
      .post-list-warp:hover {
        background: var(--vscode-activityBar-background);
      }
      .post-title {
        font-weight: 800;
        padding-bottom: 10px;
        color: var(--vscode-activityBar-activeBorder);
      }
      .post-title:hover {
        color: #f27573;
        cursor: pointer;
      }
      #scroll-to-top {
        position: fixed;
        width: 40px;
        height: 40px;
        right: 25px;
        bottom: 25px;
        background-color: #444444;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.25);
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      #scroll-to-top:hover {
        background-color: #007acc;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
      }
      #scroll-to-top span.icon::before {
        content: "";
        display: block;
        background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPHRpdGxlPnVwY2hldnJvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LDUuMWwtNy4zLDcuM0wwLDExLjZsOC04bDgsOGwtMC43LDAuN0w4LDUuMXoiLz4KPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+Cjwvc3ZnPgo=");
        width: 16px;
        height: 16px;
      }
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  <body>
    <a
      id="scroll-to-top"
      role="button"
      aria-label="scroll to top"
      href="#"
      title="#"
      ><span class="icon"></span
    ></a>
    <div class="actions">
      <button onclick="goBack()">返回文章列表页</button>
      <button onclick="changeReadMode()">切换阅读模式</button>
    </div>
    <div id="app"></div>
    <script>
      // loading 加载文章时防止用户进行其它操作
      class Loading {
        constructor() {
          this.loadingWarpEl = window.document.createElement("div");
          this.loadingWarpEl.style.backgroundColor =
            "var(--vscode-editor-background)";
          this.loadingWarpEl.style.position = "fixed";
          this.loadingWarpEl.style.top = "0";
          this.loadingWarpEl.style.left = "0";
          this.loadingWarpEl.style.bottom = "0";
          this.loadingWarpEl.style.right = "0";
          this.loadingWarpEl.style.zIndex = "10000";
          this.loadingWarpEl.style.display = "flex";
          this.loadingWarpEl.id = "__REQUEST_BEFORE_SEND__";
          let loadingEl = window.document.createElement("div");
          loadingEl.style.animation = "rotate 1.8s linear infinite";
          loadingEl.innerHTML =
            '<svg t="1586931554977" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1510" width="100" height="100"><path d="M755.0464 862.72a34.7648 34.7648 0 0 1-12.8512 48.0256 34.6624 34.6624 0 0 1-47.7696-12.8512 34.7648 34.7648 0 0 1 12.288-48.0256 35.4816 35.4816 0 0 1 48.3328 12.8z m-207.3088 74.9056c0 19.1488-15.8208 35.1744-35.6864 35.1744a35.2768 35.2768 0 0 1-35.1744-35.1744v-24.6272a35.4816 35.4816 0 0 1 70.8608 0v24.6272z m-216.9856-39.7312a35.072 35.072 0 0 1-48.3328 13.0048 34.8672 34.8672 0 0 1-13.0048-48.2816l26.112-45.7728a36.1472 36.1472 0 0 1 48.7936-13.056 35.328 35.328 0 0 1 12.5952 48.3328l-26.1632 45.7728zM162.304 755.712a35.5328 35.5328 0 0 1-48.3328-13.056 35.1744 35.1744 0 0 1 12.5952-48.2816l70.3488-40.7552a35.584 35.584 0 0 1 48.2816 13.0048 35.84 35.84 0 0 1-13.056 48.3328l-69.888 40.7552zM87.3984 547.84a35.1232 35.1232 0 0 1-35.1744-35.1744c0-19.6096 15.5648-35.4304 35.1744-35.4304h109.568c19.5584 0 35.1232 15.872 35.1232 35.1744a35.1744 35.1744 0 0 1-35.1744 35.4304h-109.568z m39.2192-217.3952a34.4576 34.4576 0 0 1-12.5952-48.0256 35.0208 35.0208 0 0 1 48.2816-13.0048l119.0912 69.12a35.2256 35.2256 0 0 1 13.056 47.7696 35.4816 35.4816 0 0 1-48.2304 13.056L126.6688 330.4448z m142.7456-168.3456l82.944 143.9744a35.2256 35.2256 0 1 0 61.0816-35.4304L330.0352 126.976a35.1232 35.1232 0 0 0-60.7232 35.1744z m207.5648-74.3936a35.84 35.84 0 0 1 35.1744-35.4304c19.6096 0 35.6864 15.9232 35.6864 35.4304v165.888a35.84 35.84 0 0 1-35.6864 35.6864 35.328 35.328 0 0 1-35.1744-35.7376V87.7056z m217.0368 39.2192a35.4304 35.4304 0 0 1 48.2816-13.056 34.816 34.816 0 0 1 13.056 48.3328L672.2048 306.176a35.4304 35.4304 0 0 1-48.2816 13.056 35.9424 35.9424 0 0 1-12.8512-48.5888l82.944-143.7184z m168.8576 142.4896l-144.128 83.0976a35.4816 35.4816 0 0 0-13.056 48.2816 36.2496 36.2496 0 0 0 48.2816 12.8512l144.2816-83.0976a34.9184 34.9184 0 0 0 12.5952-48.0256 34.6624 34.6624 0 0 0-47.9744-13.1072z m74.1376 207.872c19.7632 0 35.4304 15.7696 35.1744 35.3792a34.9184 34.9184 0 0 1-35.1744 35.1744h-166.0416a35.5328 35.5328 0 0 1-35.2256-35.4304c0-19.3536 16.0768-35.1744 35.2256-35.1744h166.0416z" fill="#F27573" p-id="1511"></path></svg>';
          loadingEl.style.margin = "auto";
          loadingEl.style.textAlign = "center";
          this.loadingWarpEl.append(loadingEl);
        }
        show() {
          if (!window.document.body.querySelector("#__REQUEST_BEFORE_SEND__")) {
            window.document.body.append(this.loadingWarpEl);
          } else {
            this.loadingWarpEl.style.display = "flex";
          }
        }
        hide() {
          setTimeout(() => {
            if (
              window.document.body.querySelector("#__REQUEST_BEFORE_SEND__")
            ) {
              this.loadingWarpEl.style.display = "none";
            }
          }, 400);
        }
      }

      let vscode = acquireVsCodeApi();
      let rootEl = document.querySelector("#app");
      let postListPageCache = "";
      let _pageId; // 页面 ID ，分为 list 和 postId 两种，用于控制顶部操作区
      let _readMode; // 阅读模式
      let postTitle; // 打开文章后记录文章的id，用于返回时控制滚动条定位到该锚点
      let isFetching = false; // 是否正在获取文章列表
      let loading = new Loading();

      init();

      // 渲染文章列表
      function renderPostList(postList) {
        rootEl.innerHTML += \`\${postList
          .map((post) => {
            let {
              id,
              title,
              originalUrl,
              time,
              user,
              tags,
              category,
              likeCount,
            } = post;
            let { username } = user;
            return \`<div class="post-list-warp" id="\${id}">
                <div class="post-title" onclick="toPost('\${originalUrl}', '\${id}')">\${title}</div>
                <div>
                  <span>\${username} · \${time} · \${tags
              .map((tag) => tag.title)
              .join("/")}</span>
                </div>
                </div>\`;
          })
          .join("")}\`;
        isFetching = false;
        loading.hide();
      }

      // 初始化 message 监听
      function initListenMessage() {
        window.addEventListener("message", (event) => {
          const message = event.data;
          switch (message.type) {
            case "POST_INIT":
            case "POST_NEXT":
              renderPostList(message.data);
              break;
            case "GET_POST":
              renderPost(message.data);
              break;
          }
        });
      }

      // 启用变量代理
      function r() {
        let lightReadModeStyleEl = document.createElement("style");
        lightReadModeStyleEl.textContent = \`
          article {
            background: #fff;
            color: #000;
          }
        \`;
        Object.defineProperties(window, {
          pageId: {
            get: () => _pageId,
            set: (val) => {
              if (val === "list") {
                document
                  .querySelector(".actions")
                  .querySelectorAll("button")
                  .forEach((button) => (button.style.display = "none"));
              } else {
                document
                  .querySelector(".actions")
                  .querySelectorAll("button")
                  .forEach((button) => (button.style.display = "inline-block"));
              }
              _pageId = val;
            },
          },
          readMode: {
            get: () => _readMode,
            set: (val) => {
              if (val === "light") {
                rootEl.append(lightReadModeStyleEl);
              } else if (val === "dark") {
                rootEl.removeChild(lightReadModeStyleEl);
              }
              _readMode = val;
            },
          },
        });
      }

      // 初始化
      function init() {
        loading.show();
        r();
        initListenMessage();
        window.pageId = "list";
        rootEl.innerHTML = "";
        getPostList();
        scrollListener();
      }

      // 获取文章列表
      function getPostList(type = "POST_INIT") {
        isFetching = true;
        vscode.postMessage({ type });
      }

      // 获取文章信息
      function toPost(url, title) {
        loading.show();
        postTitle = title;
        vscode.postMessage({ type: "GET_POST", data: url });
      }

      // 渲染文章
      function renderPost(data) {
        let { html, detailData } = data;
        _readMode = "dark";
        postListPageCache = rootEl.innerHTML;
        // 覆盖样式
        let overrideStyle = document.createElement("style");
        overrideStyle.textContent = \`
          .main-area[data-v-7407bc26] {
            background-color: var(--vscode-editor-background) !important;
          }
          article {
            margin-bottom: 0 !important;
          }
          h1, h2, h3, h4, h5, h6{
            color: var(--vscode-editor-foreground) !important;
          }\`;
        // 过滤掉无用的元素，只保留 meta、style、link、script和 id 为 juejin 的元素中的 article 元素
        let tempEl = document.createElement("div");
        tempEl.innerHTML = html;
        let meta = tempEl.querySelectorAll("meta");
        let style = tempEl.querySelectorAll("style");
        let script = tempEl.querySelectorAll("script");
        let link = tempEl.querySelectorAll("link");
        let juejinRootEl = tempEl.querySelector("#juejin");
        juejinRootEl = juejinRootEl.querySelector("article");
        window.overrideStyle = overrideStyle;
        // 从掘金接口获取到的 html 只有 data-src，而不是直接在 background-image 中设置src的。
        // 所以要在这里通过 js 添加图片。
        let nodeList = juejinRootEl.querySelectorAll("div, img");
        nodeList.forEach((node) => {
          let src = node.dataset.src;
          if (src) {
            if (node.tagName === "IMG") {
              node.src = src;
              node.style.visibility = "visible";
            } else {
              node.style.backgroundImage = \`url(\${src})\`;
            }
          }
        });
        // 获取到的 html 没有用户头像和昵称，需要自己填充
        let { avatarLarge, username } = detailData.user || {};
        let avatarEl = juejinRootEl.querySelector(".avatar");
        avatarEl.style.backgroundImage = \`url(\${avatarLarge})\`;
        avatarEl.style.backgroundColor = \`transparent\`;
        let usernamerEl = juejinRootEl.querySelector(".username");
        usernamerEl.textContent = username;

        rootEl.innerHTML = "";
        rootEl.append(
          ...meta,
          ...style,
          ...link,
          juejinRootEl,
          ...script,
          overrideStyle
        );
        goTop();
        window.pageId = "post";
        loading.hide();
      }

      // 回到顶部
      function goTop() {
        scrollTo("#");
      }

      // 控制滚动条到某一个位置，原生的 scrollTo 和 scrollBy 在 vscode 中不正常
      // 参照 vscode 扩展介绍页的 markdown goTop 按钮，使用 id 和 a 的跳转锚点方案。
      function scrollTo(elId) {
        let topEl = document.createElement("a");
        topEl.href = elId;
        topEl.click();
      }

      // 从文章页回到列表页
      function goBack() {
        pageId = "list";
        if (postListPageCache) {
          rootEl.innerHTML = postListPageCache;
          scrollTo(\`#\${postTitle}\`);
        } else {
          init();
        }
      }

      // 监听滚动条是否已经到达底部
      function scrollListener() {
        window.addEventListener("scroll", (x) => {
          if (pageId === "list") {
            let wScrollY = window.scrollY; // 滚动条位置
            let wInnerH = window.innerHeight; // 设备窗口的高度
            let bScrollH = document.body.scrollHeight; //  滚动条的总高度
            if (wScrollY + wInnerH >= bScrollH - 20 && !isFetching) {
              getPostList("POST_NEXT");
            }
          }
        });
      }

      // 切换阅读模式
      function changeReadMode() {
        if (readMode === "dark") {
          readMode = "light";
        } else if (readMode === "light") {
          readMode = "dark";
        }
      }
    </script>
  </body>
</html>
`;
