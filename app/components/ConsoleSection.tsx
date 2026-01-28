"use client";

import {
  BatteryFull,
  Maximize2,
  Minimize2,
  Minimize,
  X,
  Terminal,
  Folder,
  Mail,
  Grid2X2,
  Wifi,
  Monitor,
  HardDrive,
  Globe,
  Gamepad2,
  Sun,
  Moon,
  Bluetooth,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { projects, type Project, type ProjectType } from "../data/projects";
import GlowSweepOverlay from "./GlowSweepOverlay";

// --- Types ---

type FilterType = ProjectType | "all";
type Mode = "dev" | "data";

type DesktopIcon = {
  label: string;
  action: string;
  icon: ComponentType<{ className?: string }>;
};

// --- Config ---

const DOCK_ITEMS: DesktopIcon[] = [
  { label: "Terminal", action: "terminal", icon: Terminal },
  { label: "Projects", action: "projects", icon: Folder },
  { label: "Contact", action: "contact", icon: Mail },
];

const ALL_APPS: DesktopIcon[] = [
  ...DOCK_ITEMS,
  { label: "Browser", action: "browser", icon: Globe },
  { label: "Storage", action: "storage", icon: HardDrive },
];

const COMMAND_DOCS: Array<[string, string]> = [
  ["help", "Show available commands"],
  ["projects | ls", "List projects"],
  ["open <slug>", "Open project details"],
  ["about <slug>", "Show project summary"],
  ["stack <slug>", "Show tech stack"],
  ["mode <dev|data>", "Switch portfolio mode"],
  ["clear", "Clear output"],
];

// --- Helper Functions ---

const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

// --- Component ---

export default function ConsoleSection() {
  // State
  const [expanded, setExpanded] = useState(false);
  const [bootStage, setBootStage] = useState<"off" | "booting" | "ready">("off"); // "off" initially for effect
  const [activeProject, setActiveProject] = useState<Project | null>(projects[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  
  // Terminal State
  const terminalRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const commandHandlerRef = useRef<(cmd: string) => void>(() => {});
  const promptLabel = "guest@portfolio:~$ ";
  const inputBufferRef = useRef("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number | null>(null);

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    setBootStage("ready"); // fast boot for UX
    return () => clearInterval(timer);
  }, []);

  // --- Terminal Logic (Simplified for brevity) ---
  
  const write = (text: string) => terminalRef.current?.write(text);
  const writeln = (text = "") => terminalRef.current?.writeln(text);
  
  const ansi = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    dim: "\x1b[2m",
    bold: "\x1b[1m",
    red: "\x1b[31m",
  };

  const writePrompt = () => {
    write(`\r${ansi.green}${promptLabel}${ansi.reset} `);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      writePrompt();
      return;
    }

    writeln(`\r\n`);
    const [command, ...args] = trimmed.split(/\s+/);

    switch (command) {
      case "help":
        writeln(`${ansi.bold}Available Commands:${ansi.reset}`);
        COMMAND_DOCS.forEach(([c, d]) => writeln(`  ${c.padEnd(20)} ${d}`));
        break;
      case "ls":
      case "projects":
        writeln(`${ansi.bold}Projects:${ansi.reset}`);
        projects.forEach((p) => {
          writeln(`  ${ansi.cyan}${p.slug.padEnd(15)}${ansi.reset} ${p.title}`);
        });
        break;
      case "open":
      case "cat":
        const slug = args[0];
        const p = getProjectBySlug(slug);
        if (p) {
          writeln(`${ansi.bold}${p.title}${ansi.reset}`);
          writeln(p.description);
          writeln(`${ansi.dim}Stack: ${p.stack.join(", ")}${ansi.reset}`);
        } else {
          writeln(`${ansi.red}Project not found.${ansi.reset}`);
        }
        break;
      case "clear":
        terminalRef.current?.clear();
        break;
      case "mail":
      case "contact":
         writeln("Email: abraralif3@gmail.com");
         break;
      default:
        writeln(`${ansi.red}Command not found.${ansi.reset}`);
    }
    
    writePrompt();
  };

  // Initialize xterm
  useEffect(() => {
    if (bootStage !== "ready" || !terminalContainerRef.current) return; 
    
    let term: any;
    let fitAddon: any;

    const init = async () => {
      const xterm = await import("xterm");
      const xtermFit = await import("xterm-addon-fit");
      
      term = new xterm.Terminal({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: "'IBM Plex Mono', monospace",
        theme: {
          background: "#0f172a", // Match slate-900
          foreground: "#e2e8f0",
        },
        rows: 14, // Smaller default height
      });
      
      fitAddon = new xtermFit.FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalContainerRef.current!);
      fitAddon.fit();
      
      terminalRef.current = term;
      fitAddonRef.current = fitAddon;

      term.writeln(`${ansi.blue}Welcome to Portfolio OS v2.0${ansi.reset}`);
      term.writeln("Type 'help' to start.");
      writePrompt();

      // Input handling
      term.onData((data: string) => {
        if (data === "\r") { // Enter
            const cmd = inputBufferRef.current;
            inputBufferRef.current = "";
            executeCommand(cmd);
        } else if (data === "\u007F") { // Backspace
            if (inputBufferRef.current.length > 0) {
                inputBufferRef.current = inputBufferRef.current.slice(0, -1);
                term.write("\b \b");
            }
        } else if (data >= " ") {
            inputBufferRef.current += data;
            term.write(data);
        }
      });
    };

    init();

    return () => {
      term?.dispose();
    };
  }, [bootStage]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => fitAddonRef.current?.fit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded]);
  
  // Re-fit when expanded changes
  useEffect(() => {
      setTimeout(() => fitAddonRef.current?.fit(), 300);
  }, [expanded]);

  const handleDockClick = (action: string) => {
    if (action === "terminal") {
       terminalRef.current?.focus();
    } else if (action === "projects") {
       terminalRef.current?.writeln("");
       inputBufferRef.current = "projects";
       executeCommand("projects");
    } else if (action === "contact") {
       terminalRef.current?.writeln("");
       inputBufferRef.current = "contact";
       executeCommand("contact");
    }
  };

  return (
    <section id="console" className="relative py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        
        {/* Header Control */}
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-slate-200">Terminal Workspace</h2>
            <button 
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition"
            >
                {expanded ? (
                    <>
                        <Minimize2 className="w-4 h-4" />
                        Collapse Mode
                    </>
                ) : (
                    <>
                        <Maximize2 className="w-4 h-4" />
                        Expand Workspace
                    </>
                )}
            </button>
        </div>

        {/* The "Laptop/Screen" Container */}
        <motion.div 
            layout
            className={`relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl transition-all duration-500 ${expanded ? "h-[600px]" : "h-[400px]"}`}
        >
            {/* Wallpaper Overlay */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: "url(/wallpaper.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }} 
            />
            <div className="absolute inset-0 bg-slate-900/80 pointer-events-none" />

            {/* Top Bar (GNOME Style) */}
            <div className="relative z-10 flex h-8 items-center justify-between bg-slate-950/80 px-4 text-[11px] font-medium text-slate-300 backdrop-blur border-b border-white/5">
                <div 
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <Grid2X2 className="w-3.5 h-3.5" />
                    <span>Activities</span>
                </div>
                <div>
                   {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
                   {" "}
                   {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit'})}
                </div>
                <div className="flex gap-3">
                    <Wifi className="w-3.5 h-3.5" />
                    <BatteryFull className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Activities Menu Overlay */}
            <AnimatePresence>
            {menuOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
                    onClick={() => setMenuOpen(false)}
                >
                    <div className="grid grid-cols-4 gap-6 p-8" onClick={(e) => e.stopPropagation()}>
                        {ALL_APPS.map((app) => {
                            const Icon = app.icon;
                            return (
                                <button key={app.label} className="flex flex-col items-center gap-3 group" onClick={() => { handleDockClick(app.action); setMenuOpen(false); }}>
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                        <Icon className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <span className="text-xs text-slate-200">{app.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* Desktop Area */}
            <div className="relative z-0 h-full p-4 flex flex-col items-center justify-center pb-16">
                
                {/* Terminal Window */}
                <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-slate-700/50 bg-[#0f172a] shadow-2xl">
                    <GlowSweepOverlay />
                    
                    {/* Window Title Bar */}
                    <div className="relative z-10 flex items-center justify-between bg-slate-800/50 px-3 py-2 border-b border-slate-700/50">
                        <div className="flex items-center gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="text-xs text-slate-400 font-mono">alif@portfolio:~</div>
                        <div className="w-10" /> {/* Spacer */}
                    </div>
                    {/* Terminal Content */}
                    <div className="relative z-10 p-1">
                        <div ref={terminalContainerRef} className="h-full min-h-[220px]" />
                    </div>
                </div>

            </div>

            {/* Dock (Bottom) */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-2 backdrop-blur shadow-xl">
                    {DOCK_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button 
                                key={item.label}
                                onClick={() => handleDockClick(item.action)}
                                className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 hover:bg-slate-700 transition"
                                title={item.label}
                            >
                                <Icon className="h-5 w-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                                <span className="absolute -bottom-8 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

        </motion.div>
      </div>
    </section>
  );
}