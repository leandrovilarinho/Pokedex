import Link from 'next/link';

const Navbar = () => (
  <nav>
    <Link href="/regioes">Regiões</Link>
    <Link href="/tipos">Tipos</Link>
    <Link href="/favoritos">Favoritos</Link>
  </nav>
);

export default Navbar;