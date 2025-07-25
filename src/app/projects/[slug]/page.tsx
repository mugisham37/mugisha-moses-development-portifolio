import { notFound } from "next/navigation";
import { Metadata } from "next";
import { projects } from "@/data/projects";
// import { ProjectDetailView } from "@/components/interactive/ProjectDetailView"; // Temporarily disabled

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = projects.find((p) => p.id === params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Elite Developer Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.images.map((img) => ({
        url: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.images[0]?.src,
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.id === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="text-muted-foreground">{project.description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Project detail view temporarily disabled for testing
        </p>
      </div>
    </main>
  );
}
