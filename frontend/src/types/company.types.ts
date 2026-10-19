export interface CompanyProfileService {
    name: string,
    email?: string,
    phone?: string,
    address?: string,
    website?: string,
    description?: string,
    logo?: string,
    createdAt: string,
    updatedAt: string,
}

export interface updateCompanyProfile {
    name?: string,
    email?: string,
    phone?: string,
    address?: string,
    website?: string,
    description?: string,
    logo?: string
}

export interface CompanyProfileFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    description: string;
    logo: string;
}

export interface CompanyProfile {
    name: string;
    description: string | null;
    logo: string | null;
}