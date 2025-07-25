import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center">
            <SearchIcon className="w-12 h-12 text-muted-foreground" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The project you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/projects">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
