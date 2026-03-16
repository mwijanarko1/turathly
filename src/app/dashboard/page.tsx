"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { BookOpen, Clock, FileText, FolderOpen, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useConvexAvailable } from "@/lib/providers";
import type { Project } from "@/lib/types";

const genreOptions: NonNullable<Project["genre"]>[] = [
  "general",
  "tafsir",
  "fiqh",
  "hadith",
  "theology",
  "biography",
];

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

function DashboardShell({
  children,
  convexAvailable,
}: {
  children: React.ReactNode;
  convexAvailable: boolean;
}) {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-semibold text-primary">
              Turathl<span className="text-accent">y</span>
            </span>
          </Link>
          <span className="text-sm text-muted-foreground">
            {user?.fullName || user?.emailAddresses[0]?.emailAddress}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {!convexAvailable && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <p className="text-sm">
              Convex is not configured. Add `NEXT_PUBLIC_CONVEX_URL` to enable project data.
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

function DashboardUnavailable() {
  return (
    <DashboardShell convexAvailable={false}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your translation projects</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="font-heading text-lg font-semibold">Projects Require Convex</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This dashboard switches to live Convex queries when the deployment URL is available.
        </p>
      </div>
    </DashboardShell>
  );
}

function DashboardLive() {
  const router = useRouter();
  const projects = useQuery(api.projects.listByOwner) as Project[] | undefined;
  const createProject = useMutation(api.projects.create);
  const [showNewProject, setShowNewProject] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    sourceLang: "Arabic",
    targetLang: "English",
    genre: "general" as NonNullable<Project["genre"]>,
  });

  const handleCreateProject = async () => {
    if (!form.title.trim()) {
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const projectId = await createProject({
        title: form.title.trim(),
        sourceLang: form.sourceLang.trim(),
        targetLang: form.targetLang.trim(),
        genre: form.genre,
      });

      setForm({
        title: "",
        sourceLang: "Arabic",
        targetLang: "English",
        genre: "general",
      });
      setShowNewProject(false);
      router.push(`/project/${projectId}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardShell convexAvailable>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your translation projects</p>
        </div>
        <Button onClick={() => setShowNewProject(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {showNewProject && (
        <Card className="mb-6 border-primary/15">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Start a new Arabic-to-English translation workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Project Title</span>
                <Input
                  name="title"
                  placeholder="Shamāʾil al-Tirmidhī"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleCreateProject();
                    }
                  }}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Genre</span>
                <select
                  aria-label="Genre"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={form.genre}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      genre: event.target.value as NonNullable<Project["genre"]>,
                    }))
                  }
                >
                  {genreOptions.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Source Language</span>
                <Input
                  name="sourceLang"
                  value={form.sourceLang}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, sourceLang: event.target.value }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Target Language</span>
                <Input
                  name="targetLang"
                  value={form.targetLang}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, targetLang: event.target.value }))
                  }
                />
              </label>
            </div>

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            <div className="flex items-center gap-3">
              <Button onClick={() => void handleCreateProject()} disabled={isCreating || !form.title.trim()}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Project"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewProject(false);
                  setErrorMessage(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {projects === undefined ? (
        <div className="rounded-2xl border border-border bg-card/70 px-6 py-16 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Loading projects…</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-lg font-semibold">No projects yet</h2>
          <p className="mt-2 text-muted-foreground">Create your first translation project to get started.</p>
          <Button className="mt-5" onClick={() => setShowNewProject(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project._id} href={`/project/${project._id}`}>
              <Card className="h-full border-transparent transition-colors hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-1 text-lg">{project.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      {project.genre || "general"}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    {project.sourceLang} to {project.targetLang}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Updated {formatDate(project.updatedAt)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

export default function DashboardPage() {
  const convexAvailable = useConvexAvailable();
  return convexAvailable ? <DashboardLive /> : <DashboardUnavailable />;
}
