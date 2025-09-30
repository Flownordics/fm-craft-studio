import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import PlayersTable from "@/components/PlayersTable";
import ClubsTable from "@/components/ClubsTable";
import CompetitionsTable from "@/components/CompetitionsTable";

const EditorDashboard = () => {
  const navigate = useNavigate();
  const [filename, setFilename] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const uploaded = localStorage.getItem('fmf_uploaded');
    const name = localStorage.getItem('fmf_filename');
    
    if (!uploaded) {
      navigate('/');
      return;
    }
    
    if (name) setFilename(name);

    // Warn on page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [navigate, hasUnsavedChanges]);

  const handleExport = () => {
    toast.success("Exporting database...", {
      description: "Your .fmf file will download shortly"
    });
    
    // Simulate export
    setTimeout(() => {
      toast.success("Database exported successfully!");
      setHasUnsavedChanges(false);
    }, 1500);
  };

  const handleNewFile = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to upload a new file?"
      );
      if (!confirmed) return;
    }
    
    localStorage.removeItem('fmf_uploaded');
    localStorage.removeItem('fmf_filename');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">FMF Editor Pro</h1>
            <p className="text-sm text-muted-foreground">{filename}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleNewFile}>
              <Upload className="w-4 h-4 mr-2" />
              New File
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export .fmf
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {hasUnsavedChanges && (
          <Alert className="mb-6 border-accent bg-accent/10">
            <AlertCircle className="h-4 w-4 text-accent-foreground" />
            <AlertDescription className="text-accent-foreground">
              You have unsaved changes. Don't forget to export your database.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="players" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <PlayersTable onEdit={() => setHasUnsavedChanges(true)} />
          </TabsContent>

          <TabsContent value="clubs">
            <ClubsTable onEdit={() => setHasUnsavedChanges(true)} />
          </TabsContent>

          <TabsContent value="competitions">
            <CompetitionsTable onEdit={() => setHasUnsavedChanges(true)} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EditorDashboard;
