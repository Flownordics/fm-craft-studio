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

const PlayersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, deletePlayer } = useFMF();

  if (!data) return null;

  const filteredPlayers = data.players.filter(player => {
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (player.commonName && player.commonName.toLowerCase().includes(searchLower)) ||
      (player.club && player.club.toLowerCase().includes(searchLower)) ||
      player.nationality.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (id: string) => {
    toast.info(`Edit functionality coming soon`);
  };

  const handleDelete = (id: string) => {
    const player = data.players.find(p => p.id === id);
    const playerName = player?.commonName || `${player?.firstName} ${player?.lastName}`;
    if (window.confirm(`Delete ${playerName}? This action cannot be undone.`)) {
      deletePlayer(id);
      toast.success("Player deleted");
    }
  };

  const handleAdd = () => {
    toast.info("Add functionality coming soon");
  };

  return (
    <Card>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Players Database</h2>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Player
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search players, clubs, nationalities..."
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
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>CA</TableHead>
              <TableHead>PA</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {player.commonName || `${player.firstName} ${player.lastName}`}
                </TableCell>
                <TableCell>
                  {player.dateOfBirth !== 'Unknown' 
                    ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()
                    : 'Unknown'}
                </TableCell>
                <TableCell>{player.nationality}</TableCell>
                <TableCell>{player.club || 'Free Agent'}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                    {player.position}
                  </span>
                </TableCell>
                <TableCell>{player.ability}</TableCell>
                <TableCell>{player.potential}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(player.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(player.id)}
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

      {filteredPlayers.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          No players found matching your search
        </div>
      )}
    </Card>
  );
};

export default PlayersTable;
