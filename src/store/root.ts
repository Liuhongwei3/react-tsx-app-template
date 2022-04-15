
import { createContext } from 'react';
import { makeAutoObservable } from "mobx"

class Store {
    showFields: any[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    setShowFields(fields: any[]) {
        this.showFields = fields;
    }
}

export const StoresContext = createContext(new Store());
