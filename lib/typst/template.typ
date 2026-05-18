// classic-blue resume template
#let resume(data: (:), style: (:)) = {
  let template = style.at("template", default: "minimal")
  let is-banner = template == "banner"

  let margin-map = if is-banner {
    (
      compact: (top: 0cm, bottom: 1.0cm, x: 0cm),
      standard: (top: 0cm, bottom: 1.2cm, x: 0cm),
      loose: (top: 0cm, bottom: 1.6cm, x: 0cm),
    )
  } else {
    (
      compact: (x: 1.4cm, y: 1.2cm),
      standard: (x: 1.6cm, y: 1.4cm),
      loose: (x: 2.0cm, y: 1.8cm),
    )
  }
  let chosen-margin = margin-map.at(style.margin)
  set page(paper: "a4", margin: chosen-margin)
  set text(
    font: (style.fontLatin, style.fontCJK),
    size: style.baseFontSize * 1pt,
    lang: "zh",
  )
  set par(leading: (style.lineHeight - 1) * 1em, spacing: style.paragraphSpacing * 1em)
  // Soften the default bold (delta 300 → weight 700). Delta 200 yields weight
  // 600 (Semibold), which both Libertinus Serif and Noto Serif SC supply.
  set strong(delta: 200)

  let theme = rgb(style.themeColor)
  let theme-soft = theme.lighten(70%)
  let theme-softer = theme.lighten(85%)
  let theme-ink = theme.darken(20%)
  let bullet-spacing = style.at("bulletSpacing", default: 0.3) * 1em
  let section-spacing = style.at("sectionSpacing", default: 0.5) * 1em

  // Horizontal padding applied to non-hero content in the banner template.
  let banner-hpad = 0.8cm

  // ───────────── minimal-template helpers ─────────────
  let section(title) = {
    v(section-spacing)
    text(size: 13pt, fill: theme)[*#title*]
    v(-0.3em)
    line(length: 100%, stroke: 0.6pt + theme)
    v(0.2em)
  }

  let three-col(l, mid, r) = {
    grid(
      columns: (auto, 1fr, auto),
      column-gutter: 12pt,
      [*#l*],
      align(center)[*#mid*],
      align(right)[*#r*],
    )
    v(0.1em)
  }

  let labeled-bullet(lbl, content) = {
    block(inset: (left: 0.6em), spacing: bullet-spacing)[
      *●* *#lbl：*#content
    ]
  }

  let plain-bullet(content) = {
    block(inset: (left: 0.6em), spacing: bullet-spacing)[*●* #content]
  }

  // ───────────── banner-template helpers ─────────────
  // Pad a 2-char CJK label so colons line up (e.g. 电话 → 电　　话).
  let pad-cjk(label) = {
    if label == "" { return "" }
    let chars = label.clusters()
    let len = chars.len()
    if len == 2 { chars.at(0) + "　　" + chars.at(1) }
    else if len == 3 { chars.at(0) + "　" + chars.at(1) + "　" + chars.at(2) }
    else { label }
  }

  let banner-section(title) = {
    v(section-spacing * 0.6)
    pad(x: banner-hpad)[
      #grid(
        columns: (auto, 1fr),
        column-gutter: 4pt,
        align: (left + bottom, left + bottom),
        block(
          fill: theme-soft,
          inset: (x: 12pt, y: 4pt),
          radius: (left: 2pt, right: 0pt),
        )[
          #text(font: (style.fontCJK, style.fontLatin), weight: "bold", fill: theme-ink, tracking: 2pt)[#title]
        ],
        line(length: 100%, stroke: 0.6pt + theme-soft),
      )
    ]
    v(0.2em)
  }

  let banner-entry-head(period, mid, role, mid-align: center) = {
    pad(x: banner-hpad + 0.4em)[
      #grid(
        columns: (auto, 1fr, auto),
        column-gutter: 18pt,
        align: (left + horizon, mid-align + horizon, right + horizon),
        text(font: style.fontLatin, weight: "bold", size: 0.9em)[#period],
        text(weight: "bold")[#mid],
        text(weight: "bold", size: 0.95em)[#role],
      )
    ]
    v(0.1em)
  }

  let banner-labeled-bullet(lbl, content) = {
    pad(x: banner-hpad + 1em)[
      #block(spacing: bullet-spacing)[
        #box(baseline: -0.25em, circle(radius: 2.5pt, fill: theme))
        #h(6pt)
        *#lbl：*#content
      ]
    ]
  }

  let banner-plain-bullet(content) = {
    pad(x: banner-hpad + 1em)[
      #block(spacing: bullet-spacing)[
        #box(baseline: -0.25em, circle(radius: 2.5pt, fill: theme))
        #h(6pt)
        #content
      ]
    ]
  }

  let banner-sub-bullet(content) = {
    pad(x: banner-hpad + 2.4em)[
      #block(spacing: bullet-spacing)[· #content]
    ]
  }

  let banner-paragraph(content) = {
    pad(x: banner-hpad + 0.6em)[
      #block(spacing: bullet-spacing)[#content]
    ]
  }

  // ───────────── data accessors ─────────────
  let basic-photo = data.basic.at("photoDataUrl", default: none)
  let contact-rows = data.basic.at("contactRows", default: ())

  let format-item(item) = {
    let lbl = item.at("label", default: "")
    let val = item.at("value", default: "")
    if val == "" and lbl == "" {
      ""
    } else if lbl == "" {
      val
    } else if val == "" {
      lbl
    } else {
      lbl + "：" + val
    }
  }

  let format-row(row) = {
    let parts = row.map(format-item).filter(s => s != "")
    if parts.len() == 0 { "" } else { parts.join("｜") }
  }

  let sections-flag = style.at("sections", default: (:))
  let section-on(key) = sections-flag.at(key, default: true)

  let courses-data = data.at("courses", default: (overall: "", items: ()))
  let courses-overall = courses-data.at("overall", default: "")
  let courses-items = courses-data.at("items", default: ())

  let strengths-data = data.at("strengths", default: (mode: "bullets", bullets: (), paragraph: ""))
  let strengths-mode = strengths-data.at("mode", default: "bullets")
  let strengths-bullets = strengths-data.at("bullets", default: ())
  let strengths-paragraph = strengths-data.at("paragraph", default: "")

  let show-photo = style.showPhoto and basic-photo != none and basic-photo != ""

  // ───────────── minimal-template renderers ─────────────
  let render-minimal-header() = {
    let visible-lines = contact-rows.map(format-row).filter(s => s != "")
    grid(
      columns: (1fr, auto),
      column-gutter: 16pt,
      align: (left + horizon, right + horizon),
      [
        #text(size: 24pt, weight: "bold")[#data.basic.name]
        #v(0.3em)
        #for (i, line) in visible-lines.enumerate() {
          line
          if i < visible-lines.len() - 1 {
            linebreak()
          }
        }
      ],
      if show-photo { image(basic-photo, width: 2.6cm) } else { [] },
    )
  }

  let render-education() = {
    if data.education.len() > 0 {
      section("教育背景")
      for edu in data.education {
        three-col(edu.period, edu.school, edu.major + " / " + edu.degree)
        for b in edu.bullets {
          labeled-bullet(b.label, b.content)
        }
        v(0.2em)
      }
    }
  }

  let render-experience() = {
    if data.experience.len() > 0 {
      section("实习经历")
      for exp in data.experience {
        three-col(exp.period, exp.org, exp.role)
        for b in exp.bullets {
          labeled-bullet(b.label, b.content)
        }
        v(0.2em)
      }
    }
  }

  let render-projects() = {
    if data.projects.len() > 0 {
      section("项目经历")
      for (i, p) in data.projects.enumerate() {
        if i > 0 { v(0.7em) }
        let p-period = p.at("period", default: "")
        let p-subtitle = p.at("subtitle", default: none)
        let has-subtitle = p-subtitle != none and p-subtitle != ""
        if p-period == "" {
          [#strong[#p.name#if has-subtitle [ — #p-subtitle]]]
        } else {
          grid(
            columns: (auto, 1fr),
            column-gutter: 12pt,
            [*#p-period*],
            [#strong[#p.name#if has-subtitle [ — #p-subtitle]]],
          )
        }
        v(0.15em)
        for b in p.bullets {
          labeled-bullet(b.label, b.content)
        }
      }
    }
  }

  let render-courses() = {
    let has-overall = courses-overall != ""
    let item-list = courses-items.filter(s => s != "")
    if has-overall or item-list.len() > 0 {
      section("课程成绩")
      if has-overall {
        labeled-bullet("综合成绩", courses-overall)
      }
      if item-list.len() > 0 {
        labeled-bullet("课程成绩", "")
        for c in item-list {
          block(inset: (left: 2em), spacing: bullet-spacing)[· #c]
        }
      }
      v(0.2em)
    }
  }

  let render-awards() = {
    if data.awards.len() > 0 {
      section("获奖情况")
      for a in data.awards {
        plain-bullet(a)
      }
    }
  }

  let render-skills() = {
    if data.skills.len() > 0 {
      section("技能特长")
      for s in data.skills {
        labeled-bullet(s.category, s.detail)
      }
    }
  }

  let render-strengths() = {
    let bullet-list = strengths-bullets.filter(s => s != "")
    let has-content = if strengths-mode == "paragraph" {
      strengths-paragraph != ""
    } else {
      bullet-list.len() > 0
    }
    if has-content {
      section("个人优势")
      if strengths-mode == "paragraph" {
        block(inset: (left: 0.6em), spacing: 0.3em)[#strengths-paragraph]
      } else {
        for b in bullet-list {
          plain-bullet(b)
        }
      }
    }
  }

  // ───────────── banner-template renderers ─────────────
  let render-banner-hero() = {
    block(
      width: 100%,
      fill: gradient.linear(theme, theme.lighten(35%), angle: 135deg),
      inset: (x: banner-hpad, top: 16pt, bottom: 16pt),
    )[
      #set text(fill: white)
      #text(font: style.fontCJK, size: 22pt, weight: "regular", tracking: 8pt)[个人简历]
    ]
  }

  let render-banner-basic() = {
    banner-section("基本信息")

    // build (label, value) pairs
    let cells = ((pad-cjk("姓名"), data.basic.name),)
    for row in contact-rows {
      for item in row {
        let lbl = item.at("label", default: "")
        let val = item.at("value", default: "")
        if val != "" {
          cells.push((pad-cjk(lbl), val))
        }
      }
    }

    let basic-grid = grid(
      columns: (1fr, 1fr),
      column-gutter: 18pt,
      row-gutter: 14pt,
      ..cells.map(c => [#text(weight: "medium")[#c.at(0)]　：　#c.at(1)]),
    )

    pad(x: banner-hpad + 0.4em)[
      #block(
        fill: theme.lighten(92%),
        inset: (x: 12pt, y: 10pt),
        radius: 3pt,
        width: 100%,
      )[
        #if show-photo {
          grid(
            columns: (1fr, auto),
            column-gutter: 16pt,
            align: (left + top, right + top),
            basic-grid,
            image(basic-photo, width: 2.6cm),
          )
        } else {
          basic-grid
        }
      ]
    ]
  }

  let render-banner-education() = {
    if data.education.len() > 0 {
      banner-section("教育背景")
      for edu in data.education {
        banner-entry-head(
          edu.period,
          edu.school,
          edu.major + (if edu.degree != "" { " / " + edu.degree } else { "" }),
        )
        for b in edu.bullets {
          banner-labeled-bullet(b.label, b.content)
        }
        v(0.2em)
      }
    }
  }

  let render-banner-experience() = {
    if data.experience.len() > 0 {
      banner-section("实习经历")
      for exp in data.experience {
        banner-entry-head(exp.period, exp.org, exp.role)
        for b in exp.bullets {
          banner-labeled-bullet(b.label, b.content)
        }
        v(0.2em)
      }
    }
  }

  let render-banner-projects() = {
    if data.projects.len() > 0 {
      banner-section("项目经历")
      for (i, p) in data.projects.enumerate() {
        if i > 0 { v(0.6em) }
        let p-period = p.at("period", default: "")
        let p-subtitle = p.at("subtitle", default: none)
        let has-subtitle = p-subtitle != none and p-subtitle != ""
        banner-entry-head(
          p-period,
          p.name,
          if has-subtitle { p-subtitle } else { "" },
          mid-align: left,
        )
        for b in p.bullets {
          banner-labeled-bullet(b.label, b.content)
        }
      }
    }
  }

  let render-banner-courses() = {
    let has-overall = courses-overall != ""
    let item-list = courses-items.filter(s => s != "")
    if has-overall or item-list.len() > 0 {
      banner-section("课程成绩")
      if has-overall {
        banner-labeled-bullet("综合成绩", courses-overall)
      }
      if item-list.len() > 0 {
        banner-labeled-bullet("课程成绩", "")
        for c in item-list {
          banner-sub-bullet(c)
        }
      }
    }
  }

  let render-banner-awards() = {
    if data.awards.len() > 0 {
      banner-section("获奖情况")
      for a in data.awards {
        banner-plain-bullet(a)
      }
    }
  }

  let render-banner-skills() = {
    if data.skills.len() > 0 {
      banner-section("技能特长")
      for s in data.skills {
        banner-labeled-bullet(s.category, s.detail)
      }
    }
  }

  let render-banner-strengths() = {
    let bullet-list = strengths-bullets.filter(s => s != "")
    let has-content = if strengths-mode == "paragraph" {
      strengths-paragraph != ""
    } else {
      bullet-list.len() > 0
    }
    if has-content {
      banner-section("个人优势")
      if strengths-mode == "paragraph" {
        banner-paragraph(strengths-paragraph)
      } else {
        for b in bullet-list {
          banner-plain-bullet(b)
        }
      }
    }
  }

  // ───────────── dispatch ─────────────
  let dispatch = if is-banner {
    (
      education: render-banner-education,
      experience: render-banner-experience,
      projects: render-banner-projects,
      courses: render-banner-courses,
      awards: render-banner-awards,
      skills: render-banner-skills,
      strengths: render-banner-strengths,
    )
  } else {
    (
      education: render-education,
      experience: render-experience,
      projects: render-projects,
      courses: render-courses,
      awards: render-awards,
      skills: render-skills,
      strengths: render-strengths,
    )
  }

  let default-order = ("education", "experience", "projects", "courses", "awards", "skills", "strengths")
  let order = style.at("sectionOrder", default: default-order)

  if is-banner {
    render-banner-hero()
    render-banner-basic()
  } else {
    render-minimal-header()
  }

  let seen = ()
  for key in order {
    if key in dispatch and not (key in seen) {
      seen.push(key)
      if section-on(key) {
        (dispatch.at(key))()
      }
    }
  }
  for key in default-order {
    if not (key in seen) {
      seen.push(key)
      if section-on(key) {
        (dispatch.at(key))()
      }
    }
  }
}
