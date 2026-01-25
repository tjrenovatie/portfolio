// lib/projects.ts
export interface Project {
  id: string;
  title: string;
  /** width / height – e.g. 1.5 = 3:2 */
  repAspect: number;
  blobPrefix: string;
}

export const projects = [
  {
    id: "p1",
    title: "Bathroom Renovations",
    repAspect: 1.33, // 4:3 – classic photo
    blobPrefix: "projects/p1/",
  },
  {
    id: "p2",
    title: "Toilet Renovations",
    repAspect: 0.8, // 4:5 – tall portrait
    blobPrefix: "projects/p2/",
  },
  {
    id: "p3",
    title: "Kitchen Renovations",
    repAspect: 1.78, // 16:9 – wide kitchen shot
    blobPrefix: "projects/p3/",
  },
  {
    id: "p4",
    title: "Bathroom Remodel",
    repAspect: 0.75, // 3:4 – tall
    blobPrefix: "projects/p4/",
  },
  {
    id: "p5",
    title: "Bathroom Flooring Heating",
    repAspect: 1.25, // 5:4 – square-ish
    blobPrefix: "projects/p5/",
  },
  {
    id: "p6",
    title: "Complete Bathroom Renovation",
    repAspect: 1.6, // 8:5 – wide
    blobPrefix: "projects/p6/",
  },
  {
    id: "p7",
    title: "Modern Toilet Renovation",
    repAspect: 1.0, // 1:1 – square
    blobPrefix: "projects/p7/",
  },
  {
    id: "p8",
    title: "Luxury Bathroom Remodel",
    repAspect: 1.5, // 3:2 – classic
    blobPrefix: "projects/p8/",
  },
  {
    id: "p9",
    title: "Compact Bathroom Renovation",
    repAspect: 1.33, // 4:3
    blobPrefix: "projects/p9/",
  },
  {
    id: "p10",
    title: "Spacious Kitchen Remodel",
    repAspect: 1.78, // 16:9 – wide
    blobPrefix: "projects/p10/",
  },
  {
    id: "p11",
    title: "Outdoor Patio Renovation",
    repAspect: 1.9, // 19:10 – ultra-wide
    blobPrefix: "projects/p11/",
  },
  {
    id: "p12",
    title: "Kitchen Makeover",
    repAspect: 1.6, // 8:5
    blobPrefix: "projects/p12/",
  },
  {
    id: "p13",
    title: "Tv Wall Renovation",
    repAspect: 1.78, // 16:9 – perfect for TV wall
    blobPrefix: "projects/p13/",
  },
  {
    id: "p14",
    title: "Living Room Upgrade",
    repAspect: 1.5, // 3:2
    blobPrefix: "projects/p14/",
  },
  {
    id: "p15",
    title: "Bedroom Renovation",
    repAspect: 1.33, // 4:3
    blobPrefix: "projects/p15/",
  },
  {
    id: "p16",
    title: "Home Office Setup",
    repAspect: 1.25, // 5:4
    blobPrefix: "projects/p16/",
  },
  {
    id: "p17",
    title: "Dining Room Remodel",
    repAspect: 1.6, // 8:5
    blobPrefix: "projects/p17/",
  },
] as const;
