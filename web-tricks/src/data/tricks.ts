import type { ComponentType } from "react";

export interface Trick {
  id: string;
  title: string;
  description: string;
  category: "CSS" | "JS" | "React";
  technologies: string[];
  thumbnail: string;
  githubUrl: string;
  component: () => Promise<{ default: ComponentType }>;
}

export const tricks: Trick[] = [
  {
    id: "glassmorphism",
    title: "Glassmorphism Card",
    description:
      "Frosted glass effect with backdrop-filter and translucent layers.",
    category: "CSS",
    technologies: ["backdrop-filter", "CSS", "opacity"],
    thumbnail:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&q=80",
    githubUrl: "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/Glassmorphism.tsx",
    component: () => import("../tricks/Glassmorphism"),
  },
  {
    id: "use-local-storage",
    title: "useLocalStorage Hook",
    description:
      "A custom hook that syncs React state with localStorage automatically.",
    category: "React",
    technologies: ["React hooks", "localStorage", "JSON"],
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    githubUrl: "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/UseLocalStorage.tsx",
    component: () => import("../tricks/UseLocalStorage"),
  },
  {
    id: "scroll-animations",
    title: "Scroll-Driven Animations",
    description:
      "Animate elements on scroll using pure CSS animation-timeline.",
    category: "CSS",
    technologies: ["animation-timeline", "CSS", "scroll()"],
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    githubUrl: "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ScrollAnimations.tsx",
    component: () => import("../tricks/ScrollAnimations"),
  },
  {
    id: "intersection-observer",
    title: "Intersection Observer",
    description:
      "Lazy-load images and trigger animations when elements enter the viewport.",
    category: "JS",
    technologies: ["IntersectionObserver", "JavaScript", "lazy loading"],
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    githubUrl: "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/IntersectionObserverDemo.tsx",
    component: () => import("../tricks/IntersectionObserverDemo"),
  },
  {
    id: "optimistic-ui",
    title: "Optimistic UI Updates",
    description:
      "Update the UI instantly before the server confirms, then reconcile.",
    category: "React",
    technologies: ["React", "useState", "async"],
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    githubUrl: "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/OptimisticUI.tsx",
    component: () => import("../tricks/OptimisticUI"),
  },
  {
    id: "container-queries",
    title: "Container Queries",
    description:
      "Style components based on their parent size, not the viewport.",
    category: "CSS",
    technologies: ["@container", "CSS", "container-type"],
    thumbnail:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
    githubUrl: "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ContainerQueries.tsx",
    component: () => import("../tricks/ContainerQueries"),
  },
];
