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

interface Competition {
  id: number;
  name: string;
  nation: string;
  level: string;
  teams: number;
  reputation: number;
  format: string;
}

const mockCompetitions: Competition[] = [
  { id: 1, name: "Premier League", nation: "England", level: "1", teams: 20, reputation: 9800, format: "League" },
  { id: 2, name: "La Liga", nation: "Spain", level: "1", teams: 20, reputation: 9600, format: "League" },
  { id: 3, name: "UEFA Champions League", nation: "Europe", level: "Continental", teams: 32, reputation: 10000, format: "Cup" },
  { id: 4, name: "Bundesliga", nation: "Germany", level: "1", teams: 18, reputation: 9400, format: "League" },
  { id: 5, name: "Serie A", nation: "Italy", level: "1", teams: 20, reputation: 9300, format: "League" },
];

interface CompetitionsTableProps {
  onEdit: () => void;
}

const CompetitionsTable = ({ onEdit }: CompetitionsTableProps) => {
  const [competitions, setCompetitions] = useState<Competition[]>(mockCompetitions);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompetitions = competitions.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.nation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (competition: Competition) => {
    toast.info(`Editing ${competition.name}`, {
      description: "Entity edit modal would open here"
    });
    onEdit();
  };

  const handleDelete = (id: number) => {
    const competition = competitions.find(c => c.id === id);
    if (window.confirm(`Delete ${competition?.name}? This action cannot be undone.`)) {
      setCompetitions(competitions.filter(c => c.id !== id));
      toast.success("Competition deleted");
      onEdit();
    }
  };

  const handleAdd = () => {
    toast.info("Add new competition", {
      description: "Create new competition modal would open here"
    });
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
              <TableHead>Level</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Reputation</TableHead>
              <TableHead>Format</TableHead>
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
                    {competition.level}
                  </span>
                </TableCell>
                <TableCell>{competition.teams}</TableCell>
                <TableCell>{competition.reputation.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    competition.format === 'League' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-accent/10 text-accent-foreground'
                  }`}>
                    {competition.format}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(competition)}
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
