"use client";

import {
  ArrowUpRight, Github, Linkedin, Mail, Terminal,
  Code2, FileCode, Database, Palette, Table, Network, Brain,
  GitBranch, Container, Cloud, Monitor
} from "lucide-react";
import ConsoleSection from "./components/ConsoleSection";
import FloatingObjects from "./components/FloatingObjects";
import CursorGlow from "./components/CursorGlow";
import LiquidHeroName from "./components/LiquidHeroName";
import { projects } from "./data/projects";
import { Stagger, FadeUp, FadeIn, ScaleIn } from "./components/motion";

function SectionDivider() {
  return (
    <FadeIn>
      <div className="mx-auto h-px w-full max-w-6xl bg-white/5 my-24" />
    </FadeIn>
  );
}

function AboutSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-24">
        <Stagger className="lg:col-span-1" delay={0.05} stagger={0.08}>
          <FadeUp>
            <h2 className="text-3xl font-medium text-white">About</h2>
          </FadeUp>
          <div className="mt-6 flex flex-col gap-4">
            <FadeUp>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-500">Focus</span>
                <span className="text-sm font-medium text-slate-200">Fullstack Web & Data</span>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-500">Stack</span>
                <span className="text-sm font-medium text-slate-200">Laravel + PostgreSQL</span>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-500">Specialty</span>
                <span className="text-sm font-medium text-slate-200">AI & Expert Systems</span>
              </div>
            </FadeUp>
          </div>
        </Stagger>
        <Stagger className="lg:col-span-2" delay={0.1} stagger={0.08}>
          <FadeUp>
            <p className="text-lg leading-relaxed text-slate-300">
              I am a Computer Science student who builds practical systems. My work
              bridges the gap between robust web backends and data-driven intelligence.
              From government archival systems to AI-assisted agricultural tools, I
              focus on shipping software that solves real problems.
            </p>
          </FadeUp>
          <FadeUp>
            <div className="mt-8 flex gap-4">
              <a
                href="#contact"
                className="group flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                Let&apos;s collaborate <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </FadeUp>
        </Stagger>
      </div>
    </section>
  );
}

function ProjectsGrid() {
  return (
    <section id="projects" className="mx-auto w-full max-w-6xl px-6">
      <Stagger delay={0.05} stagger={0.06}>
        <FadeUp className="mb-16 flex items-end justify-between">
          <h2 className="text-3xl font-medium text-white">Selected Work</h2>
          <span className="text-sm text-slate-500">2023 — Present</span>
        </FadeUp>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ScaleIn key={project.slug} delay={i * 0.08}>
              <div className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-white/10 hover:bg-white/[0.04] h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400">
                      {project.type}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs text-slate-500">
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="text-xs text-slate-600">+{project.stack.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>

        <FadeUp className="mt-12 flex justify-center">
          <a href="#console" className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-300 hover:bg-white/10 transition">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>Open Advanced Console</span>
          </a>
        </FadeUp>
      </Stagger>
    </section>
  );
}

function SkillsSection() {
  const skills = {
    Core: [
      { name: "Laravel", icon: "Code2" },
      { name: "PHP", icon: "FileCode" },
      { name: "PostgreSQL", icon: "Database" },
      { name: "Tailwind CSS", icon: "Palette" },
    ],
    Data: [
      { name: "Python", icon: "Terminal" },
      { name: "Pandas", icon: "Table" },
      { name: "Clustering", icon: "Network" },
      { name: "Fuzzy Logic", icon: "Brain" },
    ],
    Tools: [
      { name: "Git", icon: "GitBranch" },
      { name: "Docker", icon: "Container" },
      { name: "Azure", icon: "Cloud" },
      { name: "Linux", icon: "Monitor" },
    ],
  };

  const iconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 size={14} />,
    FileCode: <FileCode size={14} />,
    Database: <Database size={14} />,
    Palette: <Palette size={14} />,
    Terminal: <Terminal size={14} />,
    Table: <Table size={14} />,
    Network: <Network size={14} />,
    Brain: <Brain size={14} />,
    GitBranch: <GitBranch size={14} />,
    Container: <Container size={14} />,
    Cloud: <Cloud size={14} />,
    Monitor: <Monitor size={14} />,
  };

  return (
    <section id="skills" className="mx-auto w-full max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-24">
        <Stagger className="lg:col-span-1" delay={0.05} stagger={0.08}>
          <FadeUp>
            <h2 className="text-3xl font-medium text-white">Skills</h2>
          </FadeUp>
        </Stagger>
        <Stagger className="flex flex-col gap-10 lg:col-span-2" delay={0.1} stagger={0.1}>
          {Object.entries(skills).map(([category, items]) => (
            <FadeUp key={category}>
              <h3 className="mb-4 text-sm font-medium text-slate-400 uppercase tracking-wider">
                {category}
              </h3>
              <Stagger className="flex flex-wrap gap-2" stagger={0.04}>
                {items.map((item) => (
                  <FadeUp key={item.name} y={10}>
                    <span className="flex items-center gap-2 cursor-default rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-sm text-slate-300 transition hover:border-emerald-500/30 hover:text-emerald-300">
                      <span className="text-slate-500">{iconMap[item.icon]}</span>
                      {item.name}
                    </span>
                  </FadeUp>
                ))}
              </Stagger>
            </FadeUp>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-6">
      <Stagger className="flex flex-col items-center justify-center text-center" delay={0.05} stagger={0.1}>
        <FadeUp>
          <h2 className="text-3xl font-medium text-white sm:text-4xl">
            Open for collaboration
          </h2>
        </FadeUp>
        <FadeUp>
          <p className="mt-4 max-w-xl text-slate-400">
            Currently looking for internship opportunities or interesting projects.
            Drop me a line if you want to chat.
          </p>
        </FadeUp>

        <Stagger className="mt-10 flex gap-4" stagger={0.08}>
          <ScaleIn>
            <a
              href="mailto:abraralif3@gmail.com"
              className="flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-900 hover:bg-white transition"
            >
              <Mail className="h-4 w-4" />
              Email Me
            </a>
          </ScaleIn>
          <ScaleIn>
            <a
              href="https://github.com/Tesyaf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </ScaleIn>
          <ScaleIn>
            <a
              href="https://linkedin.com/in/alif-abrar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </ScaleIn>
        </Stagger>
      </Stagger>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#05060d] text-slate-100 selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="galaxy-base" />
        <div className="galaxy-nebula nebula-a" />
        <div className="absolute -top-40 left-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(120,90,255,0.15),transparent_60%)] blur-3xl opacity-60" />
        <div className="absolute top-[20%] right-[-160px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(80,200,255,0.12),transparent_60%)] blur-3xl opacity-50" />
        <div className="galaxy-stars" />
      </div>

      <CursorGlow />

      {/* Floating Objects on Top for easy interaction */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
        <FloatingObjects />
      </div>

      {/* HERO SECTION */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pt-32 pb-24">
        <Stagger delay={0.1} stagger={0.12}>
          <FadeUp>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-emerald-500/80">Available for work</span>
            </div>
          </FadeUp>

          <FadeUp>
            <LiquidHeroName />
          </FadeUp>

          <FadeUp>
            <p className="mt-8 max-w-xl text-lg text-slate-400 leading-relaxed">
              Exploring the intersection of Web Engineering and Data Science.
              Building systems that are both robust and intelligent.
            </p>
          </FadeUp>
        </Stagger>
      </header>

      <main className="relative z-10">
        <AboutSection />
        <SectionDivider />
        <ProjectsGrid />
        <SectionDivider />
        <ScaleIn>
          <ConsoleSection />
        </ScaleIn>
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <ContactSection />
      </main>

      <FadeIn delay={0.2}>
        <footer className="pt-24 pb-12 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Alif Abrar. Minimal Edition.
        </footer>
      </FadeIn>
    </div>
  );
}
