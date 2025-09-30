import { useState } from "react";
import { Upload, Database, FileEdit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    
    if (!file.name.endsWith('.fmf')) {
      toast.error("Please upload a valid .fmf file");
      return;
    }

    // Store file info in localStorage for now
    localStorage.setItem('fmf_filename', file.name);
    localStorage.setItem('fmf_uploaded', 'true');
    
    toast.success("File uploaded successfully!");
    navigate('/editor');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileUpload(file || null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            FMF Editor Pro
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 text-foreground">
            Professional Football Manager Database Editor
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Upload, edit, and export .fmf files with a powerful spreadsheet-style interface. 
            Full control over your FM24 database.
          </p>
        </div>

        {/* Upload Area */}
        <Card className="max-w-2xl mx-auto mb-16">
          <div
            className={`p-12 text-center border-2 border-dashed rounded-lg transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-2">Upload Your .fmf File</h3>
            <p className="text-muted-foreground mb-6">
              Drag and drop your file here, or click to browse
            </p>
            <input
              type="file"
              accept=".fmf"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button size="lg" className="cursor-pointer" asChild>
                <span>Select File</span>
              </Button>
            </label>
          </div>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Database className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Spreadsheet Interface</h3>
            <p className="text-muted-foreground">
              View and edit database entities in a familiar spreadsheet layout with sorting and filtering
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <FileEdit className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Full CRUD Operations</h3>
            <p className="text-muted-foreground">
              Create, read, update, and delete players, clubs, competitions, and more with validation
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Download className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Export & Import</h3>
            <p className="text-muted-foreground">
              Export your edited database back to .fmf format ready for Football Manager 24
            </p>
          </Card>
        </div>

        {/* Instructions */}
        <div className="max-w-3xl mx-auto mt-16">
          <Card className="p-8 bg-secondary">
            <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>Upload your Football Manager .fmf database file using the upload area above</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Navigate through different entity types (Players, Clubs, Competitions) using tabs</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>Edit entities in the spreadsheet view or open detailed edit pages for complex changes</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>Export your modified database and import it back into Football Manager 24</span>
              </li>
            </ol>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
