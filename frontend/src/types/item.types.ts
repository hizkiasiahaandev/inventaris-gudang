export interface createItem {
    sku: string,
    name: string,
    stock: number,
    minimumStock: number,
    unit: string,
    purchasePrice: number,
    categoryId: number,
    supplierId: number;
    description?: string,
};

export interface updateItem {
    sku?: string,
    name?: string,
    stock?: number,
    minimumStock?: number,
    unit?: string,
    purchasePrice?: number,
    categoryId?: number,
    supplierId?: number;
    description?: string,
};



{ /* 
    
    model Item {
  id             Int             @id @default(autoincrement())
  sku            String          @unique
  name           String
  description    String?
  stock          Int             @default(0)
  minimumStock   Int             @default(0)
  unit           String
  purchasePrice  Decimal         @db.Decimal(15, 2)
  isActive       Boolean         @default(true)
  categoryId     Int
  category       Category        @relation(fields: [categoryId], references: [id])
  supplierId     Int
  supplier       Supplier        @relation(fields: [supplierId], references: [id])
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  stockMovements StockMovement[]

  @@map("items")
}
    */}


export interface ItemsData {
    id: number;
    sku: string;
    name: string;
    description: string;
    stock: number;
    minimumStock: number;
    unit: string;
    purchasePrice: number;
    isActive: boolean;
    categoryId: number;
    supplierId: number;
    createdAt: string;
    updatedAt: string
}

export interface ItemsFormValues {
    sku: string;
    name: string;
    description: string;
    stock: number;
    minimumStock: number;
    unit: string;
    purchasePrice: number;
    categoryId: number,
    supplierId: number;
}

export interface getItems {
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
}