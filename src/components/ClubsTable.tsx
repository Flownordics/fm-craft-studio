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

const ClubsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, deleteClub } = useFMF();

  if (!data) return null;

  const filteredClubs = data.clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.nation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    toast.info(`Edit functionality coming soon`);
  };

  const handleDelete = (id: string) => {
    const club = data.clubs.find(c => c.id === id);
    if (window.confirm(`Delete ${club?.name}? This action cannot be undone.`)) {
      deleteClub(id);
      toast.success("Club deleted");
    }
  };

  const handleAdd = () => {
    toast.info("Add functionality coming soon");
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
              <TableHead>Reputation</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Stadium</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClubs.map((club) => (
              <TableRow key={club.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{club.name}</TableCell>
                <TableCell>{club.nation}</TableCell>
                <TableCell>{club.reputation.toLocaleString()}</TableCell>
                <TableCell>€{club.balance.toLocaleString()}</TableCell>
                <TableCell>{club.stadium || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(club.id)}
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
