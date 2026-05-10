import FloatingNavbar from '@/Components/Landing/FloatingNavbar';

export default function Navbar() {
    return (
        <>
            <FloatingNavbar />
            {/* Spacer to prevent content from hiding under the fixed FloatingNavbar on normal pages */}
            <div className="h-28 md:h-32"></div>
        </>
    );
}
