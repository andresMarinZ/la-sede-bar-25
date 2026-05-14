export interface MenuItem {
  Categoria: string;
  Producto: string;
  Presentacion: string;
  Precio: string;
}

export interface MenuGroup {
  categoria: string;
  productos: MenuItem[];
}
