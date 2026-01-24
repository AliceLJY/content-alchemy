#!/usr/bin/osascript

-- ========================================
-- Content Alchemy - 改进版微信发布脚本 v2.0
-- ========================================
-- 解决问题：
-- 1. 竞态条件 - 使用智能等待
-- 2. 占位符碎裂 - 使用 HTML 注释
-- 3. 样式丢失 - 使用内联 CSS
-- ========================================

-- === 配置区 ===
property PROJECT_DIR : "/Users/anxianjingya/content-alchemy-repo"
property WECHAT_URL : "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77"
property MAX_WAIT_TIME : 15
property EDITOR_SELECTOR : ".editor"

-- === 智能等待函数 ===
on waitForElement(elementSelector, maxWaitSeconds)
    repeat maxWaitSeconds times
        try
            tell application "Safari"
                if (count of windows) = 0 then
                    delay 1
                else
                    set elementExists to do JavaScript "
                        document.querySelector('" & elementSelector & "') !== null
                    " in document 1
                    if elementExists then return true
                end if
            end tell
        end try
        delay 1
    end repeat
    return false
end waitForElement

-- === 验证内容是否注入成功 ===
on verifyContentInjected()
    try
        tell application "Safari"
            set contentLength to do JavaScript "
                document.querySelector('.editor').textContent.length
            " in document 1
            return contentLength > 50
        end tell
    on error
        return false
    end try
end verifyContentInjected

-- === 主流程 ===
on run argv
    try
        -- 参数：文章路径（可选）
        if (count of argv) > 0 then
            set articlePath to item 1 of argv
        else
            set articlePath to PROJECT_DIR & "/ai-agent-content-creation/wechat-article-formatted.md"
        end if
        
        log "📝 开始发布流程..."
        log "文章路径: " & articlePath
        
        -- Step 1: 检查文章是否存在
        try
            do shell script "test -f " & quoted form of articlePath
        on error
            display notification "文章文件不存在: " & articlePath with title "Content Alchemy"
            return "ERROR: Article not found"
        end try
        
        -- Step 2: 预处理文章（Python 脚本）
        log "🔧 预处理文章（CSS内联化、占位符转换）..."
        try
            set processedPath to do shell script "python3 " & quoted form of (PROJECT_DIR & "/scripts/preprocess_article.py") & " " & quoted form of articlePath
            log "✅ 预处理完成: " & processedPath
        on error errMsg
            display notification "预处理失败: " & errMsg with title "Content Alchemy"
            return "ERROR: Preprocessing failed"
        end try
        
        -- Step 3: 打开 Safari 并导航到微信编辑器
        log "🌐 打开微信编辑器..."
        tell application "Safari"
            activate
            if (count of windows) = 0 then
                make new document
            end if
            set URL of document 1 to WECHAT_URL
        end tell
        
        -- Step 4: 等待编辑器加载
        log "⏳ 等待编辑器加载..."
        if not my waitForElement(EDITOR_SELECTOR, MAX_WAIT_TIME) then
            display notification "编辑器加载超时，请检查网络" with title "Content Alchemy"
            return "ERROR: Editor load timeout"
        end if
        log "✅ 编辑器已加载"
        
        delay 2
        
        -- Step 5: 读取预处理后的 HTML
        log "📄 读取处理后的内容..."
        set htmlContent to do shell script "cat " & quoted form of processedPath
        
        -- Step 6: 注入内容
        log "💉 注入内容到编辑器..."
        tell application "Safari"
            do JavaScript "
                const editor = document.querySelector('.editor');
                if (editor) {
                    editor.innerHTML = " & quoted form of htmlContent & ";
                }
            " in document 1
        end tell
        
        delay 3
        
        -- Step 7: 验证内容
        log "🔍 验证内容是否成功注入..."
        if not my verifyContentInjected() then
            display notification "内容注入失败，请手动检查" with title "Content Alchemy"
            return "ERROR: Content injection failed"
        end if
        log "✅ 内容注入成功"
        
        -- Step 8: 完成提示
        display notification "草稿已保存，请在微信中设置封面并发布" with title "Content Alchemy"
        log "🎉 发布流程完成！"
        
        return "SUCCESS"
        
    on error errMsg number errNum
        display notification "发布失败: " & errMsg with title "Content Alchemy"
        log "❌ 错误: " & errMsg & " (" & errNum & ")"
        return "ERROR: " & errMsg
    end try
end run
