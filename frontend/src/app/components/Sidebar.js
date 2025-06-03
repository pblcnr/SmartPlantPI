export default function Sidebar({ onLogout }) {
    return (
        <aside className="h-screen w-64 bg-green-700 text-white flex flex-col">
            <div className="flex flex-col items-center py-8">
                <img src="#" alt="Logo" className="w-20 mb-2" />
                <h1 className="text-2xl font-bold">SmartPlant</h1>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2 px-6">
                    <li><a href="#" className="hover:text-amber-100">Dashboard</a></li>
                    <li><a href="#" className="hover:text-amber-100">Minhas Plantas</a></li>
                    <li><a href="#" className="hover:text-amber-100">Alertas</a></li>
                    <li><a href="#" className="hover:text-amber-100">Perfil</a></li>
                </ul>
            </nav>
            <button className="m-6 bg-white text-green-700 py-2 rounded hover:bg-amber-100 font-semibold" onClick={onLogout}>Sair</button>
        </aside>
    );
}