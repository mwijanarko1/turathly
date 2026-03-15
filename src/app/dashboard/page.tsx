"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Plus, 
  FolderOpen, 
  Clock, 
  FileText,
  Loader2
} from "lucide-react";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { useConvexAvailable } from "@/lib/providers";

function DashboardContentInner() {
  const { user } = useUser();
  const convexAvailable = useConvexAvailable();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) return;
    
    setIsCreating(true);
    try {
      // TODO: Implement with Convex when available
      const newProject: Project = {
        _id: Date.now().toString(),
        ownerId: user?.id || "",
        title: newProjectTitle,
        sourceLang: "Arabic",
        targetLang: "English",
        genre: "general",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setProjects(prev => [newProject, ...prev]);
      setNewProjectTitle("");
      setShowNewProject(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="font-heading text-xl font-semibold text-primary">
                Turathl<span className="text-accent">y</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.fullName || user?.emailAddresses[0]?.emailAddress}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!convexAvailable && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
            <p className="text-sm">
              Convex is not configured. Please set up your Convex deployment to enable full functionality.
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your translation projects
            </p>
          </div>
          <Button 
            onClick={() => setShowNewProject(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {showNewProject && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Create New Project</CardTitle>
              <CardDescription>
                Start a new translation project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Project title"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                />
                <Button 
                  onClick={handleCreateProject}
                  disabled={isCreating || !newProjectTitle.trim()}
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectTitle("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">
              No projects yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first translation project to get started
            </p>
            <Button onClick={() => setShowNewProject(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project._id} href={`/project/${project._id}`}>
                <Card className="hover:border-primary/20 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">
                        {project.title}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-2">
                        {project.genre || "general"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {project.sourceLang} → {project.targetLang}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Updated {formatDate(project.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContentInner />;
}
