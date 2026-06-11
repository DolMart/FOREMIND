/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShoppingList } from "../types";
import { Plus, Search, Folder, Users, CheckSquare, ChevronRight, ShoppingBag } from "lucide-react";

interface ListsViewProps {
  lists: ShoppingList[];
  onSelectList: (listId: string) => void;
  onAddList: (name: string, category: string) => void;
}

export default function ListsView({ lists, onSelectList, onAddList }: ListsViewProps) {
  const [search, setSearch] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListCategory, setNewListCategory] = useState("Casa");

  const filtered = lists.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddList(newListName.trim(), newListCategory);
      setNewListName("");
      setShowAddNew(false);
    }
  };

  return (
    <div
      id="lists-view-container"
      className="h-full w-full bg-slate-950 text-slate-100 flex flex-col p-4 overflow-y-auto"
    >
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-xl rounded-full" />
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
          Mis Listas de Compra
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Sincronizadas y listas para geolocalización en tiempo real.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar lista o categoría..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
        />
      </div>

      {/* Add New List inline form or toggle */}
      {showAddNew ? (
        <form
          onSubmit={handleCreate}
          className="bg-slate-900 border border-emerald-500/30 p-3 rounded-xl mb-4 flex flex-col gap-2.5 animate-fadeIn"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-400">Nueva Lista</span>
            <button
              type="button"
              onClick={() => setShowAddNew(false)}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Cancelar
            </button>
          </div>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Ej. Despensa Oficina, Fiesta Feriado"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 placeholder:text-slate-600"
            required
            autoFocus
          />
          <div className="flex gap-2">
            {["Casa", "Trabajo", "Escuela", "Amigos", "Personal"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setNewListCategory(cat)}
                className={`py-1 px-2.5 rounded-full text-[10px] uppercase font-mono transition-colors ${
                  newListCategory === cat
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "bg-slate-950 border border-slate-800 text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Crear Lista
          </button>
        </form>
      ) : (
        <button
          id="btn-add-list-trigger"
          onClick={() => setShowAddNew(true)}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl flex items-center justify-center gap-2 mb-4 text-xs font-bold text-emerald-400 transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Lista</span>
        </button>
      )}

      {/* List items */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-2">
            <ShoppingBag className="w-8 h-8 opacity-40 text-slate-400" />
            <p className="text-xs">No se encontraron listas.</p>
          </div>
        ) : (
          filtered.map((list) => {
            const purchasedCount = list.items.filter((i) => i.purchased).length;
            const totalCount = list.items.length;
            const percent = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0;

            return (
              <div
                id={`list-card-${list.id}`}
                key={list.id}
                onClick={() => onSelectList(list.id)}
                className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 p-3.5 rounded-xl cursor-pointer flex flex-col gap-2.5 transition-all hover:bg-slate-900/90 active:scale-99 group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-emerald-400 transition-colors">
                        {list.name}
                      </h4>
                      <span className="text-[10px] py-0.5 px-2 rounded-full uppercase bg-slate-950 border border-slate-800 font-mono text-slate-400 tracking-wider">
                        {list.category}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                </div>

                {/* Info Pills section */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-950 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {purchasedCount}/{totalCount} Items
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{list.members.length} Miembros</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

