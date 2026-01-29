"use client";

const stars = [
    // down (atas ke bawah)
    { cls: "sstar down s1" },
    { cls: "sstar down s2" },
    { cls: "sstar down s3" },
    // up (bawah ke atas)
    { cls: "sstar up s4" },
    { cls: "sstar up s5" },
    { cls: "sstar up s6" },
];

export default function ShootingStars() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {stars.map((s, i) => (
                <span key={i} className={s.cls} />
            ))}
        </div>
    );
}
