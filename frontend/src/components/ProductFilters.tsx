// client/src/components/ProductFilters.tsx
import React, { useState } from 'react';
import './styles/ProductFilters.scss';

interface ProductFiltersProps {
    onFilterChange: (filters: any) => void;
}

const clubs = ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Man Utd'];
const types = ['home', 'away'];
const sizes = ['S', 'M', 'L', 'XL'];

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
    const [selectedClub, setSelectedClub] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const applyFilters = () => {
        const filters = {
            ...(selectedClub && { club: selectedClub }),
            ...(selectedType && { type: selectedType }),
            ...(selectedSize && { size: selectedSize }),
        };
        onFilterChange(filters);
    };

    const clearFilters = () => {
        setSelectedClub('');
        setSelectedType('');
        setSelectedSize('');
        onFilterChange({}); // Resetujemy filtry
    };

    return (
        <div className="product-filters">
            <h3>Filtrowanie</h3>
            
            <select value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
                <option value="">Wybierz klub</option>
                {clubs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">Wybierz typ</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                <option value="">Wybierz rozmiar</option>
                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <button onClick={applyFilters}>Zastosuj</button>
            <button onClick={clearFilters}>Wyczyść</button>
        </div>
    );
};

export default ProductFilters;