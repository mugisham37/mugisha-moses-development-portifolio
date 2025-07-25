import { ProjectShowcase } from "@/components/interactive/ProjectShowcase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Elite Developer Portfolio",
  description:
    "Explore my latest projects showcasing cutting-edge technologies and innovative solutions.",
  openGraph: {
    title: "Projects | Elite Developer Portfolio",
    description:
      "Explore my latest projects showcasing cutting-edge technologies and innovative solutions.",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <ProjectShowcase
          enableFiltering={true}
          enableSearch={true}
          className="py-8"
        />
      </div>
    </main>
  );
}
