import React, { useState } from 'react';
import { Button, Card, CardContent, Input, Badge } from '../../components/ui';
import { 
  CreditCard, DollarSign, Tag, ShoppingBag, 
  Settings, Check, AlertTriangle, FileSpreadsheet 
} from 'lucide-react';

export function AdminFinance() {
  const [activeTab, setActiveTab] = useState('methods');

  const products = [
    { id: 1, name: 'Água Mineral 500ml', category: 'Frigobar', price: 6.00, stock: 120 },
    { id: 2, name: 'Refrigerante Lata', category: 'Frigobar', price: 8.00, stock: 45 },
    { id: 3, name: 'Café da Manhã Extra', category: 'Serviço', price: 45.00, stock: null },
    { id: 4, name: 'Lavanderia (Peça)', category: 'Serviço', price: 15.00, stock: null },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
          <p className="text-slate-500">Gerencie pagamentos, taxas e catálogo de produtos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileSpreadsheet size={18} /> Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('methods')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'methods'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Meios de Pagamento
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Catálogo de Produtos
          </button>
          <button
            onClick={() => setActiveTab('taxes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'taxes'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Taxas e Impostos
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Payment Methods */}
        {activeTab === 'methods' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PaymentMethodCard 
              name="Cartão de Crédito" 
              icon={CreditCard} 
              status="active" 
              provider="Stripe" 
              fees="2.9% + R$ 0,30"
            />
            <PaymentMethodCard 
              name="Pix" 
              icon={DollarSign} 
              status="active" 
              provider="Banco Central" 
              fees="0%"
            />
            <PaymentMethodCard 
              name="Dinheiro" 
              icon={DollarSign} 
              status="active" 
              provider="Manual" 
              fees="0%"
            />
          </div>
        )}

        {/* Products Catalog */}
        {activeTab === 'products' && (
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div className="relative">
                  <Input placeholder="Buscar produto..." className="w-64 pl-8" />
                </div>
                <Button size="sm" className="bg-sky-600 hover:bg-sky-700 gap-2">
                  <Tag size={16} /> Novo Produto
                </Button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Categoria</th>
                    <th className="px-6 py-3">Preço Unit.</th>
                    <th className="px-6 py-3">Estoque</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-800">{product.name}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 border border-slate-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-600">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        {product.stock === null ? (
                          <span className="text-slate-400 italic">N/A</span>
                        ) : product.stock < 50 ? (
                          <span className="text-orange-600 font-bold flex items-center gap-1">
                            <AlertTriangle size={12} /> {product.stock}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold">{product.stock}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right text-sky-600 hover:underline cursor-pointer">Editar</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function PaymentMethodCard({ name, icon: Icon, status, provider, fees }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
            <Icon size={24} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-600 uppercase">Ativo</span>
          </div>
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-1">{name}</h3>
        <p className="text-sm text-slate-500 mb-4">Provedor: {provider}</p>
        
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
          <span className="text-slate-500">Taxas:</span>
          <span className="font-mono font-bold text-slate-700">{fees}</span>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="w-full">Configurar</Button>
        </div>
      </CardContent>
    </Card>
  );
}