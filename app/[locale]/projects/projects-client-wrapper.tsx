"use client";

import { useState, useEffect } from "react";
import ImageViewer from "@/components/image-viewer";
import type { Project } from "@/lib/projects";

export default function ProjectsClientWrapper({
  projects,
}: {
  projects: Project[];
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Event delegation voor clicks op server-gerenderde cards
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("a, button")) {
        return;
      }

      const gallery = document.querySelector("[data-project-gallery]");
      const card = target.closest("[data-project-id]");

      if (!gallery || !card || !gallery.contains(card)) {
        return;
      }

      const id = card.getAttribute("data-project-id");
      const project = projects.find((p) => p.id === id);

      if (project) openModal(project);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [projects]);

  return (
    <ImageViewer
      project={selectedProject}
      isOpen={isModalOpen}
      onClose={closeModal}
    />
  );
}
