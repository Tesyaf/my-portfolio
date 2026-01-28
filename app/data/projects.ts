export type ProjectType = "web" | "data" | "hybrid";

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  type: ProjectType;
  description: string;
  stack: string[];
  impact: string[];
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "siantar",
    title: "SIANTAR",
    type: "web",
    description:
      "A government archival information system designed to manage incoming/outgoing correspondence and digital document storage for Kesbangpol Bandar Lampung.",
    stack: ["Laravel 12", "PostgreSQL", "Azure Storage", "Tailwind CSS"],
    impact: [
      "Digitized manual archive workflows into a searchable web system",
      "Reduced document retrieval time through structured indexing and metadata",
      "Improved administrative accountability with role-based access control",
    ],
  },
  {
    slug: "noka",
    title: "NOKA (Expert System for Plant Disease)",
    type: "hybrid",
    description:
      "An AI-assisted expert system that helps farmers identify and classify cacao plant diseases with rule-based reasoning and decision support.",
    stack: ["Python", "Fuzzy Logic", "Laravel", "MySQL"],
    impact: [
      "Enabled early disease detection through structured symptom analysis",
      "Provided actionable treatment recommendations for cacao farmers",
      "Combined expert knowledge with computational reasoning for reliability",
    ],
  },
  {
    slug: "doittogether",
    title: "DoItTogether",
    type: "web",
    description:
      "A collaborative task management platform that supports team workflows, shared to-do tracking, and structured productivity planning for groups.",
    stack: ["Laravel", "Tailwind CSS", "PostgreSQL", "Livewire"],
    impact: [
      "Improved team coordination with shared task boards and invitations",
      "Centralized project deadlines, priorities, and progress updates",
      "Built a scalable foundation for organizational and academic collaboration",
    ],
  },
  {
  slug: "kopisop",
  title: "Kopisop Digital Store",
  type: "web",
  description:
    "An e-commerce style web platform for managing digital product listings, orders, and interactive storefront branding, enhanced with geospatial mapping features.",
  stack: [
    "Laravel",
    "React",
    "PostgreSQL",
    "Leaflet.js",
    "Vite",
    "Tailwind CSS",
  ],
  impact: [
    "Built a modern marketplace interface optimized for digital goods",
    "Integrated interactive maps for location-based store and customer insights",
    "Implemented secure product management with role-based separation",
    "Developed reusable UI components for long-term scalability",
  ],
},
];
