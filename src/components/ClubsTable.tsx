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

interface Club {
  id: number;
  name: string;
  nation: string;
  league: string;
  division: string;
  reputation: number;
  balance: string;
}

const mockClubs: Club[] = [
  { id: 1, name: "Manchester City", nation: "England", league: "Premier League", division: "1", reputation: 9500, balance: "£250M" },
  { id: 2, name: "Real Madrid", nation: "Spain", league: "La Liga", division: "1", reputation: 9800, balance: "€300M" },
  { id: 3, name: "Bayern Munich", nation: "Germany", league: "Bundesliga", division: "1", reputation: 9400, balance: "€200M" },
  { id: 4, name: "Paris Saint-Germain", nation: "France", league: "Ligue 1", division: "1", reputation: 9200, balance: "€350M" },
  { id: 5, name: "Arsenal", nation: "England", league: "Premier League", division: "1", reputation: 8800, balance: "£180M" },
];

interface ClubsTableProps {
  onEdit: () => void;
}

const ClubsTable = ({ onEdit }: ClubsTableProps) => {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.nation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (club: Club) => {
    toast.info(`Editing ${club.name}`, {
      description: "Entity edit modal would open here"
    });
    onEdit();
  };

  const handleDelete = (id: number) => {
    const club = clubs.find(c => c.id === id);
    if (window.confirm(`Delete ${club?.name}? This action cannot be undone.`)) {
      setClubs(clubs.filter(c => c.id !== id));
      toast.success("Club deleted");
      onEdit();
    }
  };

  const handleAdd = () => {
    toast.info("Add new club", {
      description: "Create new club modal would open here"
    });
  };

  return (
    <Card>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Clubs Database</h2>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Club
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs, nations, leagues..."
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
              <TableHead>Club Name</TableHead>
              <TableHead>Nation</TableHead>
              <TableHead>League</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Reputation</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClubs.map((club) => (
              <TableRow key={club.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{club.name}</TableCell>
                <TableCell>{club.nation}</TableCell>
                <TableCell>{club.league}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                    {club.division}
                  </span>
                </TableCell>
                <TableCell>{club.reputation.toLocaleString()}</TableCell>
                <TableCell>{club.balance}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(club)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(club.id)}
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

      {filteredClubs.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          No clubs found matching your search
        </div>
      )}
    </Card>
  );
};

export default ClubsTable;
