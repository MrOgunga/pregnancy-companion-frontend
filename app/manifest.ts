import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bumply — AI Pregnancy Companion",
    short_name: "Bumply",
    description: "Personalised weekly pregnancy care, meal plans, and a companion who knows your week.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FBF7F1",
    theme_color: "#C97B5A",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
