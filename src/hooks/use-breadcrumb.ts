import { create } from 'zustand';

type BreadcrumbItem = {
  title: string;
  url: string;
};

type BreadcrumbStore = {
  breadcrumb: BreadcrumbItem[];
  setBreadcrumb: (items: BreadcrumbItem[]) => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumb: [],
  setBreadcrumb: (items) => set({ breadcrumb: items }),
}));
