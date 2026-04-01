import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Coins, History, Tag as TagIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router';

interface HeaderProps {
  balance: number;
  pendingBalance: number;
  onManageTags?: () => void;
}

export function Header({ balance, pendingBalance, onManageTags }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  
  const formattedDate = format(today, "EEEE, d 'de' MMMM 'de' yyyy", { 
    locale: ptBR 
  });

  const isHistoryPage = location.pathname === '/history';

  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl">MyList</h1>
          <div className="flex gap-2">
            {!isHistoryPage && onManageTags && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onManageTags}
              >
                <TagIcon className="size-4" />
                Tags
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(isHistoryPage ? '/' : '/history')}
            >
              {isHistoryPage ? (
                <>
                  <Coins className="size-4" />
                  Tarefas
                </>
              ) : (
                <>
                  <History className="size-4" />
                  Histórico
                </>
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-neutral-600 mb-4 capitalize">
          {formattedDate}
        </p>

        <div className="flex gap-6">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Saldo atual</p>
            <p className="text-xl text-green-600">
              $HC {balance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Saldo pendente</p>
            <p className="text-xl text-amber-600">
              $HC {pendingBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}