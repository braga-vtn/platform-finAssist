import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Team = {
  id: string;
  name: string;
}

interface Props {
  team: Team[];
  itemsSelected: string[];
  onFilter: (_items: string[]) => void;
}

export function MemberFilter({ team, itemsSelected, onFilter }: Props): React.JSX.Element {

  const handleSelectedItem = (id: string) => {
    const updatedSelection = itemsSelected.includes(id)
      ? itemsSelected.filter(selectedId => selectedId !== id)
      : [...itemsSelected, id];

    onFilter(updatedSelection);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="style" size="sm" className="h-10 border rounded-xl">
          {itemsSelected.length > 0 && (
            <>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {itemsSelected.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {itemsSelected.length > 1 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {itemsSelected.length} selecionado
                  </Badge>
                ) : (
                  team
                    .filter((member) => itemsSelected.includes(member.id))
                    .map((member) => (
                      <Badge
                        variant="secondary"
                        key={member.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {member.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
          Equipe
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {team.map((member) => {
                const isSelected = itemsSelected.includes(member.id);
                return (
                  <CommandItem
                    key={member.id}
                    onSelect={() => handleSelectedItem(member.id)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check />
                    </div>
                    <span>{member.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {itemsSelected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onFilter([])}
                    className="justify-center text-center"
                  >
                    Limpar Filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}