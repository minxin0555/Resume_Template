export const template = `// classic-blue resume template
#let resume(data: (:), style: (:)) = {
  let margin-map = (
    compact: (x: 1.4cm, y: 1.2cm),
    standard: (x: 1.6cm, y: 1.4cm),
    loose: (x: 2.0cm, y: 1.8cm),
  )
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
  let bullet-spacing = style.at("bulletSpacing", default: 0.3) * 1em
  let section-spacing = style.at("sectionSpacing", default: 0.5) * 1em

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
    if style.showPhoto and basic-photo != none and basic-photo != "" {
      image(basic-photo, width: 2.6cm)
    } else {
      []
    },
  )

  let sections-flag = style.at("sections", default: (:))
  let section-on(key) = sections-flag.at(key, default: true)

  let courses-data = data.at("courses", default: (overall: "", items: ()))
  let courses-overall = courses-data.at("overall", default: "")
  let courses-items = courses-data.at("items", default: ())

  let strengths-data = data.at("strengths", default: (mode: "bullets", bullets: (), paragraph: ""))
  let strengths-mode = strengths-data.at("mode", default: "bullets")
  let strengths-bullets = strengths-data.at("bullets", default: ())
  let strengths-paragraph = strengths-data.at("paragraph", default: "")

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

  let dispatch = (
    education: render-education,
    experience: render-experience,
    projects: render-projects,
    courses: render-courses,
    awards: render-awards,
    skills: render-skills,
    strengths: render-strengths,
  )

  let default-order = ("education", "experience", "projects", "courses", "awards", "skills", "strengths")
  let order = style.at("sectionOrder", default: default-order)
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
`;
