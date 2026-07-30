import { restaurant } from '../data/menu'

/** Simple visual QR-style pattern for demo (not a real encoder). */
function DemoQr({ seed }: { seed: string }) {
  const size = 21
  const cells: boolean[] = []
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  for (let i = 0; i < size * size; i++) {
    h = (h * 1664525 + 1013904223) >>> 0
    const x = i % size
    const y = Math.floor(i / size)
    const finder =
      (x < 7 && y < 7) ||
      (x > size - 8 && y < 7) ||
      (x < 7 && y > size - 8)
    if (finder) {
      const inBorder = x === 0 || y === 0 || x === 6 || y === 6 || x === size - 1 || y === size - 1 || x === size - 7 || y === size - 7
      const inCore = x >= 2 && x <= 4 && y >= 2 && y <= 4
      const inCoreTR = x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4
      const inCoreBL = x >= 2 && x <= 4 && y >= size - 5 && y <= size - 3
      cells.push(inBorder || inCore || inCoreTR || inCoreBL)
    } else {
      cells.push(h % 3 !== 0)
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="qr-svg" role="img" aria-label="Código QR de mesa">
      <rect width={size} height={size} fill="#fff" />
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={i % size}
            y={Math.floor(i / size)}
            width={1}
            height={1}
            fill="#111"
          />
        ) : null,
      )}
    </svg>
  )
}

export function QrPage() {
  return (
    <div className="qr-page">
      <header className="page-header">
        <div>
          <h1>Lector de código</h1>
          <p>Compartí el menú digital de la mesa</p>
        </div>
      </header>

      <div className="qr-card">
        <p className="eyebrow">{restaurant.name}</p>
        <DemoQr seed={`${restaurant.name}-${restaurant.tableCode}`} />
        <strong className="qr-code-label">{restaurant.tableCode}</strong>
        <p className="muted">
          El cliente escanea y ve el mismo menú visual en su celular.
        </p>
      </div>
    </div>
  )
}
