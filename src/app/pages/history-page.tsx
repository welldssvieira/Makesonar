import { useTasks } from '../hooks/use-tasks';
import { Header } from '../components/header';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function HistoryPage() {
  const { transactions, balance, pendingBalance } = useTasks();

  // Ordena transações por data (mais recente primeiro)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header balance={balance} pendingBalance={pendingBalance} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl mb-6">Histórico Financeiro</h2>

        {sortedTransactions.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center text-neutral-400">
            <p>Nenhuma transação registrada ainda</p>
            <p className="text-sm mt-2">Adicione tarefas para começar a acumular saldo</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg border p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {transaction.type === 'earn' ? (
                      <ArrowUp className="size-5" />
                    ) : (
                      <ArrowDown className="size-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-neutral-900">
                      {transaction.taskTitle}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {format(new Date(transaction.date), "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={transaction.type === 'earn' ? 'default' : 'secondary'}
                  >
                    {transaction.type === 'earn' ? 'Concluída' : 'Pendente'}
                  </Badge>
                  <p
                    className={`text-lg font-medium ${
                      transaction.type === 'earn'
                        ? 'text-green-600'
                        : 'text-amber-600'
                    }`}
                  >
                    $HC {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo */}
        {sortedTransactions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border p-6">
            <h3 className="text-lg mb-4">Resumo</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total de transações</p>
                <p className="text-2xl">{sortedTransactions.length}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Saldo conquistado</p>
                <p className="text-2xl text-green-600">$HC {balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Saldo pendente</p>
                <p className="text-2xl text-amber-600">$HC {pendingBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}