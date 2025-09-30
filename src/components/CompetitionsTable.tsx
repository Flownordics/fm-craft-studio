import { useState } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useFMF } from "@/contexts/FMFContext";

const CompetitionsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, deleteCompetition } = useFMF();

  if (!data) return null;

  const filteredCompetitions = data.competitions.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.nation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    toast.info(`Edit functionality coming soon`);
  };

  const handleDelete = (id: string) => {
    const competition = data.competitions.find(c => c.id === id);
    if (window.confirm(`Delete ${competition?.name}? This action cannot be undone.`)) {
      deleteCompetition(id);
      toast.success("Competition deleted");
    }
  };

  const handleAdd = () => {
    toast.info("Add functionality coming soon");
  };

  return (
    <Card>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Competitions Database</h2>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Competition
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search competitions, nations, formats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competition Name</TableHead>
              <TableHead>Nation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reputation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompetitions.map((competition) => (
              <TableRow key={competition.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{competition.name}</TableCell>
                <TableCell>{competition.nation}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                    {competition.type}
                  </span>
                </TableCell>
                <TableCell>{competition.reputation.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(competition.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(competition.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCompetitions.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          No competitions found matching your search
        </div>
      )}
    </Card>
  );
};

export default CompetitionsTable;
