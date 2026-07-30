import { Search, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar plato…',
}: Props) {
  return (
    <label className="search-bar">
      <Search size={18} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" className="icon-btn" onClick={() => onChange('')} aria-label="Limpiar">
          <X size={16} />
        </button>
      )}
    </label>
  )
}
