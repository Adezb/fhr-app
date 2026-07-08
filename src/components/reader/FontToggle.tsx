import { useFont } from '../../hooks/useFont';

export default function FontToggle() {
  const { font, setFont } = useFont();

  const toggleFont = () => {
    setFont(font === 'serif' ? 'sans' : 'serif');
  };

  return (
    <button 
      onClick={toggleFont}
      className="text-white hover:text-gold-light transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-light text-sm font-medium"
      aria-label="Toggle Font Style"
      title={`Current Font: ${font === 'serif' ? 'Serif' : 'Sans-Serif'}`}
    >
      {font === 'serif' ? (
        <span className="font-serif">Aa</span>
      ) : (
        <span className="font-sans">Aa</span>
      )}
    </button>
  );
}
