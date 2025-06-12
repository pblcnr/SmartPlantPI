export default function LoadingOverlay({ carregando }) {
  if (!carregando) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur bg-white/40">
      <span className="text-xl text-green-700 font-bold">Carregando...</span>
    </div>
  );
}