'use client';

import { useState, useEffect } from 'react';
import { fetchDataSources, deleteKnowledge } from '@/lib/queries';
import { Globe, File, MessageSquare, Trash2, Edit, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export function DataManagementTab({ chatbotId, dataSources }: { chatbotId: string, dataSources: DataSource[] }) {
  const [sources, setSources] = useState<GroupedSources>({
    Website: [],
    Document: [],
    QandA: [],
    Other: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();



  useEffect(() => {
    loadDataSources();
  }, [chatbotId]);

  const loadDataSources = async () => {
    try {
      const data = await fetchDataSources(Number(chatbotId));
      const grouped = data.reduce((acc, source) => {
        const category = ['Website', 'Document', 'QandA', 'CSV'].includes(source.type) ? source.type : 'Other';
        if (source.createdAt) {
          acc[category as keyof GroupedSources].push({
            ...source,
            createdAt: new Date(source.createdAt)
          });
        }
        return acc;
      }, { Website: [], Document: [], QandA: [], Other: [] } as GroupedSources);
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

  const handleDelete = async (source: DataSource) => {
    if (window.confirm(`Are you sure you want to delete this ${source.type.toLowerCase()}?`)) {
      try {
        await deleteKnowledge(Number(chatbotId), source.name);
        toast({
          title: 'Success',
          description: `${source.type} deleted successfully`,
        });
        loadDataSources();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete data source',
          variant: 'destructive',
        });
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Website': return <Globe className="w-5 h-5" />;
      case 'Document': return <File className="w-5 h-5" />;
      case 'QandA': return <MessageSquare className="w-5 h-5" />;
      case 'CSV': return <File className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(sources).map(([type, items]) => items.length > 0 && (
        <div key={type} className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {getIcon(type)} {type}s
          </h3>
          <div className="grid gap-4">
            {items.map((source: DataSource) => (
              <div key={source.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Added on {new Date(source.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {source.type === 'QandA' && (
                      <button className="p-2 hover:bg-accent rounded-full">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(source)}
                      className="p-2 hover:bg-accent rounded-full text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 

