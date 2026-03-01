import type { ComponentType } from "react";

import glassmorphismThumb from "../assets/thumbnails/glassmorphism.png";
import useLocalStorageThumb from "../assets/thumbnails/useLocalStorage.png";
import scrollAnimationsThumb from "../assets/thumbnails/scrollDrivenAnimations.png";
import intersectionObserverThumb from "../assets/thumbnails/intersectionObserver.png";
import optimisticUIThumb from "../assets/thumbnails/optimisticUIUpdates.png";
import containerQueriesThumb from "../assets/thumbnails/containerQueries.png";

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
    thumbnail: glassmorphismThumb,
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
    thumbnail: useLocalStorageThumb,
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
    thumbnail: scrollAnimationsThumb,
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
    thumbnail: intersectionObserverThumb,
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
    thumbnail: optimisticUIThumb,
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
    thumbnail: containerQueriesThumb,
    githubUrl: "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ContainerQueries.tsx",
    component: () => import("../tricks/ContainerQueries"),
  },
];
