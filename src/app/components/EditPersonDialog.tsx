import { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

interface EditPersonDialogProps {
  person: {
    id: string;
    name: string;
    image: string;
    phases: string[];
  };
  phases: string[];
  onEdit: (id: string, person: { name: string; image: string; phases: string[] }) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function EditPersonDialog({ person, phases, onEdit, onDelete, onClose }: EditPersonDialogProps) {
  const [name, setName] = useState(person.name);
  const [imageUrl, setImageUrl] = useState(person.image);
  const [selectedPhases, setSelectedPhases] = useState<string[]>(person.phases);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && imageUrl && selectedPhases.length > 0) {
      onEdit(person.id, { name, image: imageUrl, phases: selectedPhases });
      onClose();
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${person.name}?`)) {
      onDelete(person.id);
      onClose();
    }
  };

  const togglePhase = (phase: string) => {
    setSelectedPhases(prev =>
      prev.includes(phase)
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Edit Person</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Phases ({selectedPhases.length} selected)</label>
            <div className="flex flex-wrap gap-2">
              {phases.map((phase) => (
                <button
                  key={phase}
                  type="button"
                  onClick={() => togglePhase(phase)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedPhases.includes(phase)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}