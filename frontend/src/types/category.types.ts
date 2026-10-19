export interface createCategory {
    name: string,
    description?: string
}

export interface getCategories {
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
}

export interface updateCategory {
    name?: string,
    description?: string
}


export interface CategoryData {
    id: number;
    name: string;
    description: string
}
export interface CategoryFormValues {
    name: string;
    description: string
}

export interface Category {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}