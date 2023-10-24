use pulldown_cmark::{html, Options, Parser};
use std::io::Write;
use std::{fs::File, path::Path};

const STYLE: &'static str = include_str!("../style.css");
const SCRIPT: &'static str = include_str!("../script.js");

fn create_page(content: String) -> String {
    format!(
        r#"
<!DOCTYPE html>
<html>
<head>
<title>uutils coreutils</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Oswald:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <style>{STYLE}</style>
    <main>
        <div id="content">
            {content}
        </div>
    </main>
    <footer>
        <div class="info">Terts Diepraam, Rust at TU Delft, 2023-10-26</div>
        <div>
          <span id="current-page-num"></span>/<span id="max-page-num"></span>
        </div>
        <div class="buttons">
            <button id="prev-button" class="button" onclick="prevSlide()">&lt;</button>
            <button id="next-button" class="button" onclick="nextSlide()">&gt;</button>
        </div>
    </footer>
    <div id="progress"></div>
    <script>{SCRIPT}</script>
</body>
    "#
    )
}

fn create_slide(title: &str, content: &str) -> String {
    let title_class = if title == "" { "title hidden" } else { "title" };

    format!(
        r#"
        <div class="slide">
            <div class="{title_class}">
                <div>
                {title}
                </div>
            </div>
            <div class="slide-content">
            {content}
            </div>
        </div>        
    "#
    )
}

struct Page {
    title: String,
    markdown: String,
}

fn main() {
    let content = std::fs::read_to_string("content.md").unwrap();
    let build_dir = Path::new("dist");

    // Ignore if it already exists
    let _ = std::fs::create_dir(build_dir);

    let _ = std::fs::copy("logo.svg", build_dir.join("logo.svg"));

    let mut pages = Vec::new();
    let mut current_page = Page {
        title: String::new(),
        markdown: String::new(),
    };

    for line in content.lines() {
        if let Some(title) = line.strip_prefix("---") {
            pages.push(current_page);
            let title = title.trim().into();
            current_page = Page {
                title,
                markdown: String::new(),
            };
        } else {
            current_page.markdown.push_str(line);
            current_page.markdown.push('\n');
        }
    }

    let mut rendered = Vec::new();
    for page in pages.iter() {
        let mut options = Options::empty();
        options.insert(Options::ENABLE_TABLES);
        let parser = Parser::new_ext(&page.markdown, options);

        // Write to String buffer.
        let mut html_output = String::new();
        html::push_html(&mut html_output, parser);
        rendered.push(create_slide(&page.title, &html_output));
    }

    let mut page_file = File::create(build_dir.join("index.html")).unwrap();
    write!(page_file, "{}", create_page(rendered.join("\n")),).unwrap();
}
