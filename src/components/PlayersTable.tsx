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

interface Player {
  id: number;
  name: string;
  age: number;
  nationality: string;
  club: string;
  position: string;
  ca: number;
  pa: number;
}

const mockPlayers: Player[] = [
  { id: 1, name: "Erling Haaland", age: 23, nationality: "Norway", club: "Manchester City", position: "ST", ca: 180, pa: 195 },
  { id: 2, name: "Kylian Mbappé", age: 25, nationality: "France", club: "Paris Saint-Germain", position: "ST", ca: 185, pa: 200 },
  { id: 3, name: "Jude Bellingham", age: 20, nationality: "England", club: "Real Madrid", position: "CM", ca: 165, pa: 185 },
  { id: 4, name: "Vinícius Júnior", age: 23, nationality: "Brazil", club: "Real Madrid", position: "LW", ca: 175, pa: 190 },
  { id: 5, name: "Bukayo Saka", age: 22, nationality: "England", club: "Arsenal", position: "RW", ca: 160, pa: 180 },
];

interface PlayersTableProps {
  onEdit: () => void;
}

const PlayersTable = ({ onEdit }: PlayersTableProps) => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (player: Player) => {
    toast.info(`Editing ${player.name}`, {
      description: "Entity edit modal would open here"
    });
    onEdit();
  };

  const handleDelete = (id: number) => {
    const player = players.find(p => p.id === id);
    if (window.confirm(`Delete ${player?.name}? This action cannot be undone.`)) {
      setPlayers(players.filter(p => p.id !== id));
      toast.success("Player deleted");
      onEdit();
    }
  };

  const handleAdd = () => {
    toast.info("Add new player", {
      description: "Create new player modal would open here"
    });
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
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell>{player.nationality}</TableCell>
                <TableCell>{player.club}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                    {player.position}
                  </span>
                </TableCell>
                <TableCell>{player.ca}</TableCell>
                <TableCell>{player.pa}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(player)}
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
