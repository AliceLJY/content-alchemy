
import re
from bs4 import BeautifulSoup

def inline_css(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    style_tag = soup.find('style')
    if not style_tag:
        return html_content
    
    css_text = style_tag.string
    # Simple regex to find selectors and their rules
    # This is a basic inliner, doesn't handle complex selectors like :hover, @media, etc.
    rules = re.findall(r'([^{]+)\{([^}]+)\}', css_text)
    
    style_map = {}
    for selector, rule in rules:
        selector = selector.strip()
        rule = rule.strip().replace('\n', ' ')
        # Remove variables like var(--md-primary-color) which won't work in WeChat
        # Replace var(--md-primary-color) with #0F4C81 (from the :root)
        rule = rule.replace('var(--md-primary-color)', '#0F4C81')
        rule = rule.replace('var(--md-font-size)', '16px')
        rule = rule.replace('hsl(var(--foreground))', '#000')
        rule = rule.replace('var(--blockquote-background)', '#f7f7f7')
        
        style_map[selector] = rule

    # Apply styles to tags
    for selector, styles in style_map.items():
        # Handle basic tags
        elements = soup.select(selector)
        for el in elements:
            existing_style = el.get('style', '')
            # Merge styles (basic merge: semicolon)
            new_style = (existing_style.strip('; ') + '; ' + styles).strip('; ')
            el['style'] = new_style
            
    # Remove the style tag
    style_tag.decompose()
    
    # Wrap everything in a WeChat-friendly section
    content = soup.find('div', id='output')
    if content:
        # Create a wrapper section
        wrapper = soup.new_tag('section', style='max-width: 100%; box-sizing: border-box; overflow-wrap: break-word; font-family: -apple-system-font,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif; font-size: 16px; padding: 10px;')
        # Move all children of content to wrapper
        for child in list(content.children):
            wrapper.append(child)
        content.append(wrapper)
        
    return str(soup)

if __name__ == "__main__":
    with open('/tmp/final_rendered_article.html', 'r', encoding='utf-8') as f:
        html = f.read()
    inlined_html = inline_css(html)
    with open('/tmp/final_inlined_article.html', 'w', encoding='utf-8') as f:
        f.write(inlined_html)
    print("CSS Inlined and saved to /tmp/final_inlined_article.html")
