import Link from "next/link";
import Image from "next/image";

export default function Sidebar({ onLogout }) {
    return (
        <aside className="h-screen w-64 bg-green-700 text-white flex flex-col justify-between">
            <div className="flex flex-col items-center py-8">
                <Image src="/img/logo.png" alt="Logo" className="w-40 mb-10 rounded-full" width={500} height={500} />
                <h1 className="text-4xl font-bold">SmartPlant</h1>
            </div>
            <nav className="flex flex-col gap-3 px-6 mt-8">
                <Link href="/" className="block py-2 px-4 rounded bg-green-800 hover:bg-amber-100 hover:text-green-800 transition-colors font-semibold text-center">
                    Dashboard
                </Link>
                <Link href="/plantas" className="block py-2 px-4 rounded bg-green-800 hover:bg-amber-100 hover:text-green-800 transition-colors font-semibold text-center">
                    Minhas Plantas
                </Link>
                <Link href="/alertas" className="block py-2 px-4 rounded bg-green-800 hover:bg-amber-100 hover:text-green-800 transition-colors font-semibold text-center">
                    Alertas
                </Link>
                <Link href="/perfil" className="block py-2 px-4 rounded bg-green-800 hover:bg-amber-100 hover:text-green-800 transition-colors font-semibold text-center">
                    Perfil
                </Link>
            </nav>
            <button
                className="m-6 bg-white text-green-700 py-2 rounded hover:bg-amber-100 font-semibold transition-colors"
                onClick={onLogout}
            >
                Sair
            </button>
        </aside>
    );
}