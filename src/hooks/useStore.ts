import React from 'react';
import { StoresContext } from '../store/root';

export const useStores = () => React.useContext(StoresContext);
