//     _                    ____
//    / \  _ __ ___  _ __  |  _ \  _____   __
//   / = \| '_ ` _ \| '__| | | | |/ _ \ \ / /
//  / ___ | | | | | | |    | |_| |  __/\ V /
// /_/   \|_| |_| |_|_|    |____/ \___| \_/
//
const HLP = "℗℗℗℗_℗℗℗℗℗℗℗℗℗℗℗℗℗℗℗℗℗℗℗℗____℻℗℗℗/℗\\℗℗_℗__℗___℗℗_℗__℗℗|℗℗_℗\\℗℗_____℗℗℗__℻℗℗/℗=℗\\|℗'_℗`℗_℗\\|℗'__|℗|℗|℗|℗|/℗_℗\\℗\\℗/℗/℻℗/℗___℗|℗|℗|℗|℗|℗|℗|℗℗℗℗|℗|_|℗|℗℗__/\\℗V℗/℻/_/℗℗℗\\|_|℗|_|℗|_|_|℗℗℗℗|____/℗\\___|℗\\_/℻℗℻"
  .concat("℻℗℻Hello! I'm Amr :3℻a Music enthusiast and hobbyist programmer.℻I specialize in crafting efficient and performant systems.℻My journey in tech is driven by curiosity and ecstasy for development.℻℗")
  .concat("℻℗℻commands: (click to run)")
  .replace(/℗/g, " ").replace(/℻/g, "\n")

// [[title, brief, description, output: [title, brief, link] | string], ...]
const cmds = [
  [
    "tech-stack",
    "List my preferred technologies",
    "I'm a Void Linux user with a highly customized desktop environment.\nFocused on performance, flexibility, and open-source tools.",
    [
      ["void-linux", "Robust minimalist Linux distribution", "https://voidlinux.org"],
      ["Node.js", "JavaScript runtime for web-servers", "https://nodejs.org"],
      ["OpenGL", "Cross-platform 2D/3D graphics API", "https://www.opengl.org"],
      ["Godot", "Free open source light game engine", "https://godotengine.org"],
      ["Julia", "Highly optimized dynamic language", "https://julialang.org"],
      ["Bevy", "Open source performant game engine", "https://bevyengine.org"],
    ]
  ], [
    "projects",
    "Showcase recent developments",
    "A selection of my latest projects. Each represents a unique\nchallenge and development experience. Explore and enjoy!",
    [
      ["amr-dev.info", "Terminal-style portfolio website", "https://github.com/cyber-amr/amr-dev.info"],
      ["Shapes.jl", "Advanced multi-D shape manipulation", "https://github.com/cyber-amr/Shapes.jl"],
    ]
  ], [
    "contact",
    "Connect with me online",
    "Find me on various platforms. Each offers a different perspective\non my work and interests. Feel free to reach out :)",
    [
      ["amr@programmer.net", "Professional inquiries and offers", "mailto:amr@programmer.net"],
      ["𝕏 (Twitter)", "Casual life updates and memes", "https://x.com/cyber_amr"],
      ["itch.io", "Published and unpublished games", "https://cyber-amr.itch.io"],
      ["YouTube", "The typical place for dev logs", "https://youtube.com/@cyber-amr"],
      ["GitHub", "Where open sourced projects live", "https://github.com/cyber-amr"]
    ]
  ]
]

sleep = ms => new Promise((r) => setTimeout(r, ms))
// target, tag, txt, classList
newElement = (t, tag, txt, cl) => {
  const e = document.createElement(tag)
  e.textContent = txt
  cl && e.classList.add(cl)
  t.appendChild(e)
  return e
}

get = e => document.querySelector(e)

hide = e => e.classList.add("hidden")

isStr = x => typeof x == "string"

class Animator {
  constructor(t) {
    this.target = t;
    this.reset()
  }
  reset() {
    this.i = 0;
    this.id = "";
  }
  clear() {
    this.reset()
    this.target.replaceChildren();
    this.target.textContent = "";
  }
  // ln: [title, brief, link]
  listItem(i, list) {
    const line = newElement(list, "tr")

    const [t, s, b] = [[i[0], "list-title"], [" ⎯ "], [i[1] ?? " "]].map(([t, c]) => newElement(line, "td", t, c))

    if (i[2]) {
      t.onclick = isStr(i[2]) ? () => window.open(i[2], '_blank') : i[2]
      t.classList.add("pressable")
      t.tabIndex = 0
    }

    !i[1] && (hide(s) || hide(b))
  }
  // x: [[title, brief, link], ...] | String
  async print(x, id) {
    this.id = id ?? x
    const l = isStr(x) ? x.split("\n") : newElement(this.target, "div", "", "list")
    while (this.id == (id ?? x) && this.i < (isStr(x) ? l.length : x.length)) {
      isStr(x) ? newElement(this.target, "div", l[this.i]) : this.listItem(x[this.i], l)
      this.i++
      await sleep(50)
    }
  }
  async printChar(s) {
    this.id = s
    while (this.id == s && this.i < s.length) {
      this.target.textContent += s.charAt(this.i)
      this.i++
      await sleep(25)
    }
  }
}

const ca = new Animator(get(".run .cmd")) // Command Line Animator
const ra = new Animator(get(".run .output")) // Output Animator
const q = []

document.addEventListener("keydown", e => (["Space", "Enter"].includes(e.code)) && document.activeElement.click())

async function run(cmd) {
  ca.clear()
  ra.clear()

  q.some(c => c == cmd) || q.push(cmd)
  await ca.printChar(cmd)
  if (q.shift() != cmd) return

  ra.clear()
  if (!cmds.some(c => c[0] == cmd)) return ra.print(`bash: ${cmd}: command not found`)

  const c = cmds.find(c => c[0] == cmd)
  c[2] && (await ra.print(c[2]) || ra.reset())
  ra.print(c[3], cmd)
}

// print help command
(async () => {
  const a = new Animator(get(".help .output"))

  await (new Animator(get(".help .cmd"))).printChar("amr-dev.info --help")
  await a.print(HLP)
  a.reset()

  await a.print(cmds.map(c => [c[0], c[1], () => run(c[0])]))

  hide(get(".help .cursor"));

  [".run .user", ".run .pwd", ".run .cursor"].map(e => get(e).classList.remove("hidden"))
})()
