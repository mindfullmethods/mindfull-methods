export default function Navbar() {
    return(
        <nav className="w-full border-b">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="text-2xl font-bold">Mindfull Methods</h1>

                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm font-medium">
                        Home
                    </a>

                    <a href="#" className="text-sm font-medium">
                        Internships
                    </a>

                    <a href="#" className="text-sm font-medium">
                        About
                    </a>

                    <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
}