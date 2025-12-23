import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManagementCardProps {
  title: string;
  description: string;
  items: string[];
  onAdd: (item: string) => void;
  onDelete: (item: string) => void;
  icon: React.ReactNode;
  gradient: string;
  placeholder: string;
}

const ManagementCard: React.FC<ManagementCardProps> = ({
  title,
  description,
  items,
  onAdd,
  onDelete,
  icon,
  gradient,
  placeholder
}) => {
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewItem('');
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-500",
      "hover:shadow-2xl hover:-translate-y-1",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
      "hover:before:opacity-100"
    )}>
      {/* Decorative gradient bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-xl", gradient)} />
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl shadow-lg transition-all duration-300",
              "group-hover:scale-110 group-hover:shadow-xl",
              gradient
            )}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground font-normal">{description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-muted to-muted/50 shadow-sm">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {items.map((item, index) => (
            <div
              key={item}
              className={cn(
                "group/item flex items-center justify-between px-3 py-2.5 rounded-lg",
                "bg-gradient-to-r from-muted/50 to-muted/30",
                "border border-border/30 shadow-sm",
                "transition-all duration-300",
                "hover:shadow-md hover:border-border/50 hover:from-muted/70 hover:to-muted/40",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-sm font-medium text-foreground truncate flex-1">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                className={cn(
                  "h-7 w-7 p-0 opacity-0 group-hover/item:opacity-100",
                  "transition-all duration-200",
                  "hover:bg-destructive/20 hover:text-destructive"
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Item */}
        {isAdding ? (
          <div className="flex gap-2 animate-scale-in">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 h-9 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              variant="hero"
              onClick={handleAdd}
              className="h-9 px-3 shadow-lg"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewItem('');
              }}
              className="h-9 w-9 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className={cn(
              "w-full h-10 border-dashed border-2",
              "bg-gradient-to-r from-muted/30 to-transparent",
              "hover:from-primary/10 hover:to-primary/5 hover:border-primary/50",
              "transition-all duration-300 group/add"
            )}
          >
            <Plus className="h-4 w-4 mr-2 group-hover/add:rotate-90 transition-transform duration-300" />
            Add New {title.slice(0, -1)}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ManagementCard;
