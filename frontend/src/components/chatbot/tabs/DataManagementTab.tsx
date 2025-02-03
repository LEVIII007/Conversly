"use client";

import { useState, useEffect } from 'react';
import { deleteKnowledge, addCitation, fetchEmbeddingsForSource } from '@/lib/queries';
import { Globe, File, MessageSquare, Trash2, Edit, Database, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CitationDialog } from '@/components/chatbot/citationDialog';
import { ContentDialog } from '@/components/chatbot/contentDialog';

interface DataSource {
  id: number;
  type: string;
  name: string;
  sourceDetails: any;
  createdAt: Date;
}

interface GroupedSources {
  Website: DataSource[];
  Document: DataSource[];
  QandA: DataSource[];
  Other: DataSource[];
}

export function DataManagementTab({
  chatbotId,
  dataSources,
  onDataDeleted,
}: {
  chatbotId: string;
  dataSources: DataSource[];
  onDataDeleted: () => void;
}) {
  const [sources, setSources] = useState<GroupedSources>({
    Website: [],
    Document: [],
    QandA: [],
    Other: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // For citation dialog
  const [showCitationDialog, setShowCitationDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  // For content dialog
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [chunks, setChunks] = useState<{id : number, text : string, topic : string}[]>([]);

  const { toast } = useToast();

  // Group data on mount or whenever dataSources changes
  useEffect(() => {
    loadDataSources();
  }, [dataSources]);

  const loadDataSources = () => {
    try {
      const grouped = dataSources.reduce((acc, source) => {
        const category = ['Website', 'Document', 'QandA', 'CSV'].includes(source.type)
          ? source.type
          : 'Other';
        acc[category as keyof GroupedSources].push({
          ...source,
          createdAt: new Date(source.createdAt),
        });
        return acc;
      }, {
        Website: [],
        Document: [],
        QandA: [],
        Other: [],
      } as GroupedSources);

      setSources(grouped);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data sources',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete knowledge
  const handleDelete = async (source: DataSource) => {
    if (window.confirm(`Are you sure you want to delete this ${source.type.toLowerCase()}?`)) {
      try {
        await deleteKnowledge(Number(chatbotId), source.id);
        toast({
          title: 'Success',
          description: `${source.type} deleted successfully`,
        });
        onDataDeleted();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete data source',
          variant: 'destructive',
        });
      }
    }
  };

  // Open the citation dialog for a specific source
  const handleOpenCitationDialog = (source: DataSource) => {
    setSelectedSource(source);
    setShowCitationDialog(true);
  };

  // Callback for when citation is submitted from CitationDialog
  const handleAddCitation = async (citationText: string, dataSourceId: number) => {
    if (!selectedSource) return;
    try {
      await addCitation(Number(chatbotId), dataSourceId, citationText);
      toast({
        title: 'Success',
        description: 'Citation added successfully',
      });
      setShowCitationDialog(false);
      setSelectedSource(null);
      onDataDeleted();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add citation',
        variant: 'destructive',
      });
    }
  };

  // Show content from embeddings table
  const handleShowContent = async (source: DataSource) => {
    setSelectedSource(source);
    setIsContentLoading(true);
    setShowContentDialog(true);

    try {
      // fetch chunks from your embeddings table or relevant API
      // shape of return: an array of strings or a custom structure
      const embeddingChunks = await fetchEmbeddingsForSource(source.id);
      setChunks(embeddingChunks); // store in state
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data source content',
        variant: 'destructive',
      });
    } finally {
      setIsContentLoading(false);
    }
  };

  // Return icon for each source type
  const getIcon = (type: string) => {
    switch (type) {
      case 'Website':
        return <Globe className="w-5 h-5" />;
      case 'Document':
        return <File className="w-5 h-5" />;
      case 'QandA':
        return <MessageSquare className="w-5 h-5" />;
      case 'CSV':
        return <File className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(sources).map(([type, items]) =>
        items.length > 0 && (
          <div key={type} className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {getIcon(type)} {type}s
            </h3>
            <div className="grid gap-4">
              {items.map((source : DataSource) => (
                <div key={source.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{source.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(source.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* Show content button */}
                      <button 
                        onClick={() => handleShowContent(source)}
                        className="p-2 hover:bg-accent rounded-full"
                        title="Show Saved Content"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* If QandA, show an edit button */}
                      {source.type === 'QandA' && (
                        <button className="p-2 hover:bg-accent rounded-full">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(source)}
                        className="p-2 hover:bg-accent rounded-full text-destructive"
                        title="Delete Data Source"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Add Citation */}
                      <button
                        onClick={() => handleOpenCitationDialog(source)}
                        className="p-2 hover:bg-accent rounded-full"
                        title="Add Citation"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Citation Dialog */}
      <CitationDialog
        isOpen={showCitationDialog}
        onClose={() => {
          setShowCitationDialog(false);
          setSelectedSource(null);
        }}
        onSubmit={handleAddCitation}
        datasourceId={selectedSource?.id ?? 0}
      />

      {/* Content Dialog */}
      <ContentDialog
        isOpen={showContentDialog}
        onClose={() => {
          setShowContentDialog(false);
          setChunks([]);
          setSelectedSource(null);
        }}
        title={`Content for: ${selectedSource?.name ?? ''}`}
        chunks={chunks.map(chunk => chunk.text)}
        isLoading={isContentLoading}
      />
    </div>
  );
}
