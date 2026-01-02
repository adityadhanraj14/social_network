import { useState, useMemo } from 'react';
import { PersonCard } from './components/PersonCard';
import { PhaseCircle } from './components/PhaseCircle';
import { AddPersonDialog } from './components/AddPersonDialog';
import { AddPhaseDialog } from './components/AddPhaseDialog';
import { EditPersonDialog } from './components/EditPersonDialog';
import { Plus, Users, Circle, Sliders } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  image: string;
  phases: string[];
}

interface Phase {
  name: string;
  color: string;
  position: { x: number; y: number };
  size: number;
}

interface PersonPosition {
  id: string;
  position: { x: number; y: number };
}

export default function App() {
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [personSize, setPersonSize] = useState(60);

  const [phases, setPhases] = useState<Phase[]>([
    { name: 'Family', color: '#3B82F6', position: { x: 150, y: 200 }, size: 300 },
    { name: 'School', color: '#EF4444', position: { x: 350, y: 150 }, size: 280 },
    { name: 'Kota', color: '#10B981', position: { x: 550, y: 200 }, size: 260 },
    { name: 'College', color: '#F59E0B', position: { x: 250, y: 380 }, size: 300 },
    { name: 'Sequoia', color: '#8B5CF6', position: { x: 480, y: 360 }, size: 280 },
  ]);

  const [people, setPeople] = useState<Person[]>([
    {
      id: '1',
      name: 'Mom',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzMzNjE5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      phases: ['Family']
    },
    {
      id: '2',
      name: 'Dad',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjczNTczNjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      phases: ['Family']
    },
    {
      id: '3',
      name: 'Rahul',
      image: 'https://images.unsplash.com/photo-1561740303-a0fd9fabc646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwxfHx8fDE3NjcyNjYwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      phases: ['School', 'Kota']
    },
    {
      id: '4',
      name: 'Priya',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3MzE4NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      phases: ['School']
    },
    {
      id: '5',
      name: 'Arjun',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NjczNTc0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      phases: ['Kota', 'College']
    },
    {
      id: '6',
      name: 'Sneha',
      image: 'https://images.unsplash.com/photo-1641760395906-8bf9c07b5a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWFndWUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjczNjA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      phases: ['College', 'Sequoia']
    }
  ]);

  // Calculate phase connections based on shared people
  const phaseConnections = useMemo(() => {
    const connections = new Map<string, Set<string>>();
    
    people.forEach(person => {
      if (person.phases.length > 1) {
        person.phases.forEach(phase1 => {
          if (!connections.has(phase1)) {
            connections.set(phase1, new Set());
          }
          person.phases.forEach(phase2 => {
            if (phase1 !== phase2) {
              connections.get(phase1)!.add(phase2);
            }
          });
        });
      }
    });
    
    return connections;
  }, [people]);

  // Smart phase positioning based on connections
  const positionedPhases = useMemo(() => {
    const positioned: Phase[] = [];
    const baseSize = 300;
    const overlapDistance = 180; // Distance between centers when overlapping
    const separateDistance = 450; // Distance when not connected
    
    // Group phases into connected clusters
    const visited = new Set<string>();
    const clusters: string[][] = [];
    
    phases.forEach(phase => {
      if (visited.has(phase.name)) return;
      
      const cluster: string[] = [phase.name];
      visited.add(phase.name);
      
      // Find all connected phases using BFS
      const queue = [phase.name];
      while (queue.length > 0) {
        const current = queue.shift()!;
        const connections = phaseConnections.get(current);
        
        if (connections) {
          connections.forEach(connected => {
            if (!visited.has(connected)) {
              visited.add(connected);
              cluster.push(connected);
              queue.push(connected);
            }
          });
        }
      }
      
      clusters.push(cluster);
    });
    
    // Position each cluster separately
    let clusterOffsetX = 200;
    
    clusters.forEach(cluster => {
      const clusterPhases = phases.filter(p => cluster.includes(p.name));
      
      clusterPhases.forEach((phase, index) => {
        if (positioned.find(p => p.name === phase.name)) return;
        
        if (index === 0) {
          // First phase in cluster
          positioned.push({
            ...phase,
            position: { x: clusterOffsetX, y: 300 },
            size: baseSize
          });
        } else {
          // Find connected phase in this cluster that's already positioned
          const connections = phaseConnections.get(phase.name);
          const connectedPhase = positioned.find(p => 
            cluster.includes(p.name) && connections?.has(p.name)
          );
          
          if (connectedPhase) {
            // Position to overlap with connected phase
            const angle = (index * Math.PI * 2) / clusterPhases.length;
            positioned.push({
              ...phase,
              position: {
                x: connectedPhase.position.x + Math.cos(angle) * overlapDistance,
                y: connectedPhase.position.y + Math.sin(angle) * overlapDistance
              },
              size: baseSize
            });
          } else {
            // Fallback: position near last in cluster
            const lastInCluster = positioned[positioned.length - 1];
            positioned.push({
              ...phase,
              position: {
                x: lastInCluster.position.x + overlapDistance,
                y: lastInCluster.position.y
              },
              size: baseSize
            });
          }
        }
      });
      
      // Move offset for next cluster
      clusterOffsetX += separateDistance + baseSize;
    });
    
    return positioned;
  }, [phases, phaseConnections]);

  // Check if two circles collide
  const checkCollision = (pos1: { x: number; y: number }, pos2: { x: number; y: number }, radius: number): boolean => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius * 2;
  };

  // Calculate positions for all people with collision detection
  const peoplePositions = useMemo(() => {
    const positions: PersonPosition[] = [];
    const margin = personSize + 10; // Minimum distance between people
    
    people.forEach(person => {
      const personPhases = positionedPhases.filter(p => person.phases.includes(p.name));
      
      if (personPhases.length === 0) return;
      
      // Calculate target area (center of involved phases)
      const centerX = personPhases.reduce((sum, p) => sum + p.position.x + p.size / 2, 0) / personPhases.length;
      const centerY = personPhases.reduce((sum, p) => sum + p.position.y + p.size / 2, 0) / personPhases.length;
      
      // Find a non-colliding position
      let position = { x: centerX - personSize / 2, y: centerY - personSize / 2 };
      let attempts = 0;
      const maxAttempts = 100;
      
      while (attempts < maxAttempts) {
        const hasCollision = positions.some(existing => 
          checkCollision(position, existing.position, margin)
        );
        
        if (!hasCollision) {
          break;
        }
        
        // Try a new position in a spiral pattern
        const angle = (attempts * 0.5) % (Math.PI * 2);
        const radius = 20 + (attempts * 5);
        position = {
          x: centerX - personSize / 2 + Math.cos(angle) * radius,
          y: centerY - personSize / 2 + Math.sin(angle) * radius
        };
        
        attempts++;
      }
      
      positions.push({
        id: person.id,
        position
      });
    });
    
    return positions;
  }, [people, positionedPhases, personSize]);

  const handleAddPerson = (newPerson: { name: string; image: string; phases: string[] }) => {
    setPeople([...people, {
      id: Date.now().toString(),
      ...newPerson
    }]);
  };

  const handleEditPerson = (id: string, updatedPerson: { name: string; image: string; phases: string[] }) => {
    setPeople(people.map(p => p.id === id ? { ...p, ...updatedPerson } : p));
  };

  const handleDeletePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const handleAddPhase = (newPhase: { name: string; color: string }) => {
    setPhases([...phases, {
      ...newPhase,
      position: { x: 0, y: 0 }, // Will be calculated
      size: 300
    }]);
  };

  // Create phase color map for PersonCard
  const phaseColors = useMemo(() => {
    const colorMap: { [key: string]: string } = {};
    positionedPhases.forEach(phase => {
      colorMap[phase.name] = phase.color;
    });
    return colorMap;
  }, [positionedPhases]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">My Life Network</h1>
              <p className="text-sm text-gray-600 mt-1">Visualize connections across different phases of life</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Person Size Control */}
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                <Sliders className="w-4 h-4 text-gray-600" />
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={personSize}
                  onChange={(e) => setPersonSize(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">{personSize}px</span>
              </div>

              <button
                onClick={() => setShowAddPhase(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Circle className="w-4 h-4" />
                Add Phase
              </button>
              
              <button
                onClick={() => setShowAddPerson(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                Add Person
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[calc(100vh-100px)] overflow-auto">
        <div className="relative min-w-[1400px] min-h-[900px]">
          {/* Phase Circles */}
          {positionedPhases.map((phase) => (
            <PhaseCircle
              key={phase.name}
              name={phase.name}
              color={phase.color}
              position={phase.position}
              size={phase.size}
            />
          ))}

          {/* Person Cards */}
          {people.map((person) => {
            const personPos = peoplePositions.find(p => p.id === person.id);
            if (!personPos) return null;
            
            return (
              <PersonCard
                key={person.id}
                name={person.name}
                image={person.image}
                phases={person.phases}
                position={personPos.position}
                size={personSize}
                phaseColors={phaseColors}
                onEdit={() => setEditingPerson(person)}
              />
            );
          })}

          {/* Empty State */}
          {people.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No people added yet</p>
                <button
                  onClick={() => setShowAddPerson(true)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Person
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {showAddPerson && (
        <AddPersonDialog
          phases={phases.map(p => p.name)}
          onAdd={handleAddPerson}
          onClose={() => setShowAddPerson(false)}
        />
      )}

      {showAddPhase && (
        <AddPhaseDialog
          onAdd={handleAddPhase}
          onClose={() => setShowAddPhase(false)}
        />
      )}

      {editingPerson && (
        <EditPersonDialog
          person={editingPerson}
          phases={phases.map(p => p.name)}
          onEdit={handleEditPerson}
          onDelete={handleDeletePerson}
          onClose={() => setEditingPerson(null)}
        />
      )}
    </div>
  );
}