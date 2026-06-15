/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Category {
  Lacteos = 'Lácteos',
  Carnes = 'Carnes',
  Limpieza = 'Limpieza',
  FrutasVerduras = 'Frutas y Verduras',
  Panaderia = 'Panadería',
  Bebidas = 'Bebidas',
  Despensa = 'Despensa',
  Otros = 'Otros',
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  estimatedPrice: number;
  scrapedPrice?: number;
  scrapedStore?: string;
  notes?: string;
  purchased: boolean;
}

export interface ListMember {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface ShoppingList {
  id: string;
  name: string;
  category: string; // Casa, Trabajo, Escuela, etc.
  items: Product[];
  members: ListMember[];
}

export interface Store {
  id: string;
  name: string;
  type: 'supermarket' | 'pharmacy' | 'hardware' | 'convenience';
  distance: number; // in miles
  lat: number;
  lng: number;
  availableProducts: { productName: string; price: number }[];
}

export interface ChangeLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string; // e.g., "agregó Leche", "marcó Manzana como comprado"
  listName: string;
}

export interface UserProfile {
  name: string;
  email: string;
  photoUrl: string;
  alertRadius: number; // 0.5, 1.0, 2.0 miles
  preferredStores: string[]; // Walmart, Target, etc.
  pushEnabled: boolean;
}
