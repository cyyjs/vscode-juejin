export default `<!DOCTYPE html>
<html lang="cn-ZH">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>掘金-沸点</title>
    <style>
      body {
        background-color: var(--vscode-editor-background);
        color: var(--vscode-dropdown-foreground);
      }
      .top {
        position: fixed;
        top: 0;
        height: 8vh;
        min-height: 20px;
        width: 100%;
        z-index: 1;
        box-sizing: border-box;
        padding: 20px;
        background-color: var(--vscode-editor-background);
      }
      .actions {
        float: right;
      }
      .contentWarp {
        position: absolute;
        top: 8vh;
        margin: 20px;
      }
      .avatar-large {
        width: 3.75rem !important;
        height: 3.75rem !important;
        border-radius: 50% !important;
      }
      .item {
        margin-bottom: 40px;
      }
      .userInfo {
        display: flex;
        margin-bottom: 8px;
      }
      .userInfoText {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        color: #8a9aa9;
        justify-content: space-evenly;
        margin-left: 20px;
      }
      label {
        color: var(--vscode-dropdown-foreground) !important;
      }
      .picture {
        max-width: 50%;
        margin-top: 5px;
      }
      .refresh-button {
        background-color: var(--vscode-activityBarBadge-background);
        outline: none;
        border: none;
        padding: 4px 10px;
        border-radius: 50px;
        display: inline-block;
      }
      .checkbox {
        display: inline-block;
      }
      .closed::before {
        content: "+";
      }
      .open::before {
        content: "- ";
      }
      .comment {
        margin: 10px 0;
      }
      .comment-warp {
        margin-top: 4px;
        background-color: var(--vscode-badge-background);
        padding: 5px 10px;
        border-radius: 2px;
      }
      .comment-label {
        cursor: pointer;
      }
      .comment-avatar {
        height: 40px;
        width: 40px;
        border-radius: 8px;
      }
      .comment-user {
        margin-left: 10px;
      }
      .comment-user > .userInfoText {
        margin-left: 0;
      }
      .comments {
        margin-left: 1rem;
        margin-top: 1rem;
      }
      .topic {
        border-radius: 8px;
        display: inline-block;
        padding: 2px 8px;
        border: var(--vscode-activityBarBadge-background) 1px solid;
      }
    </style>
    <link
      rel="shortcut icon"
      href="./dist/images/icon.png"
      type="image/x-icon"
    />
  </head>
  <body>
    <div class="top">
      <div>
        <span onclick="debug()">
          别看了，我在写代码。
        </span>
        <div class="actions">
          <button onclick="renderPrevPins()"><</button>
          <button onclick="getPinsNext()">></button>
          <button class="refresh-button" onclick="getPins()">
            刷新
          </button>
          <div class="checkbox">
            <input
              type="checkbox"
              name="showImage"
              checked
              onchange="showImage(this)"
            />
            <label>显示图片</label>
          </div>
        </div>
      </div>
    </div>
    <div class="contentWarp" id="pins"></div>

    <script>
      let pinsEl = null;
      let _isShowImage = true;
      let isShowImage = true;
      let commentEl;
      let pageCache = [];
      let pageNumber = 0;
      let vscode = acquireVsCodeApi();
      init({ el: "#pins" });
      // 初始化
      function init(options) {
        const { el } = options;
        pinsEl = document.querySelector(el);
        pinsEl.innerHTML = "加载数据中...请稍后";
        initListenMessage();
        getPins();
        listenImage();
      }

      // vscode 发送 消息
      function info(text, options) {
        vscode.postMessage({
          type: "INFO",
          text
        });
      }

      // 获取沸点
      function getPins() {
        pageCache = [];
        pageNumber = 0;
        vscode.postMessage({ type: "GET_PINS" });
      }

      // 获取沸点 下一页
      function getPinsNext() {
        vscode.postMessage({ type: "GET_PINS_NEXT" });
      }

      // 获取评论
      function getComment(target) {
        const status = target.dataset.status;
        if (status === "open") {
          target.dataset.status = "closed";
          target.classList.remove("open");
          target.classList.add("closed");
          commentEl.innerHTML = "";
        } else if (status === "closed") {
          commentEl = target.nextElementSibling;
          target.dataset.status = "open";
          target.classList.remove("closed");
          target.classList.add("open");
          vscode.postMessage({ type: "GET_COMMENT", id: target.id });
        }
      }

      // 初始化 message 监听
      function initListenMessage() {
        window.addEventListener("message", (event) => {
          const message = event.data;
          switch (message.type) {
            case "GET_PINS":
              renderPins(message.data);
              break;
            case "GET_PINS_NEXT":
              renderNextPins(message.data);
            case "GET_COMMENT":
              renderComments(message.data);
              break;
          }
          imageZoomInAndOut();
          window.isShowImage = _isShowImage;
        });
      }

      // 渲染下一页的沸点
      function renderNextPins(pins) {
        if (pageNumber > 4) {
          info("消息太过久远，已经埋没在历史的长河中了。");
        } else {
          if (pageCache.length > pageNumber) {
            pinsEl.innerHTML = pageCache[pageNumber + 1];
          } else if (pageCache.length === pageNumber) {
            pageCache.push(pinsEl.innerHTML);
            renderPins(pins);
          } else {
            return;
          }
          // FIXME: 无效
          document.body.scrollTop = 0;
          pageNumber++;
        }
      }

      // 渲染上一页的沸点
      function renderPrevPins(pins) {
        if (pageNumber === 0) {
          info("已经是第1页，您可以尝试刷新。");
        } else {
          let prevHtml = pageCache[pageNumber - 1];
          pageCache.push(pinsEl.innerHTML);
          pageNumber--;
          pinsEl.innerHTML = prevHtml;
        }
      }

      // 渲染沸点
      function renderPins(pins) {
        try {
          pinsEl.innerHTML = "<div class='items'>";
          pins.forEach((pin) => {
            const {
              id,
              avatarLarge,
              username,
              company,
              jobTitle,
              content,
              createdAt,
              likeCount,
              commentCount,
              pictures,
              title
            } = pin;
            let jobInfo = "";
            if (jobTitle && company) {
              jobInfo = \`\${jobTitle} @ \${company}\`;
            } else {
              if (jobTitle) jobInfo = jobTitle;
              if (company) jobInfo = company;
            }
            jobInfo += jobInfo ? \` · \${createdAt}\` : \` \${createdAt}\`;
            pinsEl.innerHTML += \`
            <div class='item'>
              <div class='userInfo'>
                <img class="avatar-large" src="\${avatarLarge}">
                <div class="userInfoText">
                  <a class="username">\${username}</a>
                  <span>\${jobInfo}</span>
                </div>
              </div>
              <div class="content">
                <div class="description">
                  <p>\${content}</p>
                </div>
                \${pictures
                  .map((picture) => \`<img class="picture" src="\${picture}"/>\`)
                  .join(" ")}
              </div>
              \${title ? \`<div class="topic">\${title}</div>\` : ""}
              <div class="comment-warp">
                <span class="comment-label closed" id="\${id}" onclick="getComment(this)" data-status="closed">评论 \${commentCount}条</span>
                <div class="comment-content"></div>
              </div>
            </div>\`;
          });
          pinsEl.innerHTML += \`</div>\`;
          onShowImage(_isShowImage);
        } catch (e) {
          console.log("error:", e);
          pinsEl.innerHTML = \`加载数据失败\`;
        }
      }

      // 渲染评论
      function renderComments(comments) {
        function genComment(comment) {
          if (!comment) return "";
          let className = "comment";
          if (Array.isArray(comment)) {
            // FIXME: 继续
            comment = comment[0];
            className = "comments";
          }
          let {
            createdAt,
            avatarLarge,
            username,
            jobTitle,
            company,
            content,
            topComment
          } = comment;
          let jobInfo = "";
          if (jobTitle && company) {
            jobInfo = \`\${jobTitle} @ \${company}\`;
          } else {
            if (jobTitle) jobInfo = jobTitle;
            if (company) jobInfo = company;
          }
          jobInfo += jobInfo ? \` · \${createdAt}\` : \` \${createdAt}\`;
          return \`
          <div class="\${className}">
            <div class="userInfo">
              <img class="comment-avatar" src="\${avatarLarge}">
              <div class="comment-user">
                <a class="username">\${username}</a>
                <div class="userInfoText">\${jobInfo}</div>
              </div>
            </div>
            <div>\${content}</div>
            \${genComment(topComment)}
          </div>
          \`;
        }
        if (!commentEl) return;
        commentEl.innerHTML += \`
        <div class="comments">
          \${comments.map((comment) => genComment(comment)).join("")}
        </div>
        \`;
      }

      // 放大缩小图片
      function imageZoomInAndOut() {
        document.querySelectorAll(".picture").forEach((pictureEl) => {
          pictureEl.style.cursor = "zoom-in";
          function zoomIn() {
            pictureEl.style["max-width"] = "100%";
            pictureEl.style["width"] = "100%";
            pictureEl.style["cursor"] = "zoom-out";
            pictureEl.onclick = zoomOut;
          }
          function zoomOut() {
            pictureEl.style["max-width"] = "50%";
            pictureEl.style["cursor"] = "zoom-in";
            pictureEl.onclick = zoomIn;
          }
          pictureEl.onclick = zoomIn;
        });
      }

      // 监听图片显示隐藏
      function listenImage() {
        Object.defineProperty(window, "isShowImage", {
          set: (show) => {
            onShowImage(show);
          }
        });
      }

      // 手动触发图片显示/隐藏
      function onShowImage(show) {
        if (show) {
          document.querySelectorAll(".picture").forEach((picture) => {
            picture.style["display"] = "inline-block";
          });
        } else {
          document.querySelectorAll(".picture").forEach((picture) => {
            picture.style["display"] = "none";
          });
        }
      }

      // 显示/隐藏图片
      function showImage(target) {
        let show = target.checked;
        window.isShowImage = show;
        _isShowImage = show;
      }

      function debug() {
        console.log(pageNumber, pageCache);
      }
    </script>
  </body>
</html>
`;