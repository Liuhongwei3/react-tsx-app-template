export interface ITreeData {
    name: string;
    prodCatId: number;
    children: IProdCategories[];
}

export interface IProdCategories {
    name: string;
    prodCatId: number;
    parentId: number;
    children: IProdCategories[];
}
