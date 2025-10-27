// src/app/components/Header.tsx (or wherever your nav lives)

import Link from "next/link";

export default function Header() {
  return (
    <header style={{ /* your styles */ }}>
      {/* ... other nav items ... */}
      <Link href="/auth/login" passHref>
        <img
          src="/profile-icon.png"
          alt="Profile"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      </Link>
    </header>
  );
}
