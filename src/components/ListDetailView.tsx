/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingList, Product, Category } from '../types/types';
import {
  ArrowLeft,
  Plus,
  Search,
  Tag,
  Trash2,
  Edit,
  Info,
  Check,
  Square,
  DollarSign,
  ListFilter,
  Users,
} from 'lucide-react';

interface ListDetailViewProps {
  list: ShoppingList;
  onBack: () => void;
  onManageMembers: () => void;
  onUpdateItem: (itemId: string, updated: Partial<Product>) => void;
  onAddItem: (item: Omit<Product, 'id' | 'purchased'>) => void;
  onDeleteItem: (itemId: string) => void;
}

export default function ListDetailView({
  list,
  onBack,
  onManageMembers,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
}: ListDetailViewProps) {
  const [search, setSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>('Todas');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Item states
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>(
    Category.Despensa,
  );
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(2.5);
  const [newItemNotes, setNewItemNotes] = useState('');

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem({
        name: newItemName.trim(),
        category: newItemCategory,
        quantity: newItemQuantity,
        estimatedPrice: newItemPrice,
        notes: newItemNotes.trim() || undefined,
      });
      setNewItemName('');
      setNewItemNotes('');
      setNewItemQuantity(1);
      setNewItemPrice(2.5);
      setShowAddForm(false);
    }
  };

  const togglePurchased = (product: Product) => {
    onUpdateItem(product.id, { purchased: !product.purchased });
  };

  const filteredItems = list.items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      activeCategoryFilter === 'Todas' ||
      item.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case Category.Lacteos:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case Category.Carnes:
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case Category.Limpieza:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case Category.FrutasVerduras:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case Category.Bebidas:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div
      id='list-detail-container'
      className='h-full w-full bg-slate-950 text-slate-100 flex flex-col p-4 overflow-y-auto'
    >
      {/* Top bar */}
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={onBack}
          className='p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer'
        >
          <ArrowLeft className='w-4 h-4' />
        </button>
        <div className='text-center'>
          <h3 className='text-sm font-bold text-white'>{list.name}</h3>
          <span className='text-[10px] text-slate-500 uppercase tracking-wider font-mono'>
            {list.category}
          </span>
        </div>
        <button
          onClick={onManageMembers}
          className='flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer'
        >
          <Users className='w-3.5 h-3.5' />
          <span className='font-medium text-[10px]'>{list.members.length}</span>
        </button>
      </div>

      {/* Stats Counter */}
      <div className='grid grid-cols-2 gap-2 mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800'>
        <div className='text-center'>
          <span className='text-[10px] text-slate-500 uppercase'>
            Comprados
          </span>
          <p className='text-lg font-bold text-emerald-400'>
            {list.items.filter((i) => i.purchased).length} / {list.items.length}
          </p>
        </div>
        <div className='text-center border-l border-slate-800'>
          <span className='text-[10px] text-slate-500 uppercase'>
            Presupuesto Est.
          </span>
          <p className='text-lg font-bold text-slate-200'>
            $
            {list.items
              .reduce(
                (sum, item) => sum + item.estimatedPrice * item.quantity,
                0,
              )
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Controls Container (Search + Filter Categories) */}
      <div className='flex flex-col gap-2 mb-4'>
        {/* Search */}
        <div className='relative'>
          <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
            <Search className='w-3.5 h-3.5 text-slate-500' />
          </div>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar producto...'
            className='w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500'
          />
        </div>

        {/* Category horizontal filters */}
        <div className='flex gap-1 overflow-x-auto pb-1 scrollbar-none'>
          {['Todas', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`py-1 px-2.5 rounded-full text-[10px] whitespace-nowrap transition-colors ${
                activeCategoryFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-905 border border-slate-800 text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Product form section */}
      {showAddForm ? (
        <form
          onSubmit={handleAddItemSubmit}
          className='bg-slate-900 border border-emerald-500/30 p-3.5 rounded-xl mb-4 flex flex-col gap-3 animate-slideIn'
        >
          <div className='flex justify-between items-center'>
            <span className='text-xs font-bold text-emerald-400'>
              Agregar Producto
            </span>
            <button
              type='button'
              onClick={() => setShowAddForm(false)}
              className='text-[10px] text-slate-500 hover:text-slate-300'
            >
              Cerrar
            </button>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-[9px] uppercase font-mono tracking-wider text-slate-400'>
              Nombre del Producto
            </label>
            <input
              type='text'
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder='Ej. Detergente, Manzanas o Harina'
              className='w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 placeholder:text-slate-600'
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col gap-1'>
              <label className='text-[9px] uppercase font-mono tracking-wider text-slate-400'>
                Cantidad
              </label>
              <input
                type='number'
                min='1'
                value={newItemQuantity}
                onChange={(e) =>
                  setNewItemQuantity(parseInt(e.target.value) || 1)
                }
                className='w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-100'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[9px] uppercase font-mono tracking-wider text-slate-400'>
                Precio Est ($)
              </label>
              <input
                type='number'
                step='0.01'
                min='0.1'
                value={newItemPrice}
                onChange={(e) =>
                  setNewItemPrice(parseFloat(e.target.value) || 0)
                }
                className='w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-100'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col gap-1'>
              <label className='text-[9px] uppercase font-mono tracking-wider text-slate-400'>
                Categoría
              </label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as Category)}
                className='w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-100'
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[9px] uppercase font-mono tracking-wider text-slate-400'>
                Notas u Observación
              </label>
              <input
                type='text'
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                placeholder='Ej. Bolsa grande'
                className='w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 placeholder:text-slate-600'
              />
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer'
          >
            Añadir a Lista Colaborativa
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className='w-full py-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold mb-4 hover:bg-slate-850 active:scale-99 transition-all cursor-pointer'
        >
          <Plus className='w-4 h-4' />
          <span>Añadir Producto</span>
        </button>
      )}

      {/* Shopping Products List Card content */}
      <div className='flex flex-col gap-2'>
        {filteredItems.length === 0 ? (
          <div className='text-center py-6 text-slate-500 text-xs'>
            No hay productos en esta selección.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all ${
                item.purchased
                  ? 'bg-slate-950/60 border-slate-900/80 text-slate-500'
                  : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            >
              <div className='flex items-start justify-between gap-2'>
                {/* Left check section */}
                <div className='flex items-start gap-2.5 flex-1'>
                  <button
                    onClick={() => togglePurchased(item)}
                    className='mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer'
                  >
                    {item.purchased ? (
                      <div className='p-0.5 bg-emerald-500 text-slate-950 rounded-md'>
                        <Check className='w-3.5 h-3.5 stroke-[3]' />
                      </div>
                    ) : (
                      <div className='w-4.5 h-4.5 border-2 border-slate-600 hover:border-emerald-500 rounded-md' />
                    )}
                  </button>

                  <div className='flex flex-col'>
                    <span
                      className={`text-xs font-bold leading-tight ${
                        item.purchased
                          ? 'line-through text-slate-500'
                          : 'text-white'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Item category badge */}
                    <div className='flex items-center gap-2 mt-1 flex-wrap'>
                      <span
                        className={`text-[8px] px-1.5 py-0.2 border rounded-full font-mono uppercase ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </span>
                      {item.quantity && (
                        <span className='text-[9px] text-slate-400 bg-slate-950/40 px-1.5 rounded-md border border-slate-900'>
                          Cant: {item.quantity}
                        </span>
                      )}
                      <span className='text-[9px] text-slate-400 font-bold bg-slate-950/40 px-1.5 rounded-md border border-slate-900'>
                        Est: ${(item.estimatedPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.notes && (
                      <p className='text-[10px] text-slate-400 mt-1 italic flex items-center gap-1'>
                        <Info className='w-3 h-3 flex-shrink-0 text-slate-500' />
                        <span>{item.notes}</span>
                      </p>
                    )}

                    {/* Real-time price scraping notification mockup display */}
                    {!item.purchased && item.scrapedPrice && (
                      <div className='mt-2 text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-1.5 rounded-md flex items-center justify-between'>
                        <span>Precios en Tienda:</span>
                        <span className='font-mono font-bold'>
                          {item.scrapedStore}: ${item.scrapedPrice}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct delete button */}
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className='text-slate-600 hover:text-red-400 p-1 transition-colors cursor-pointer'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
