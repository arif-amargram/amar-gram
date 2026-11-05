
import Link from "next/link";

const cards = [
  { icon: "🏡", title: "গ্রামের ইতিহাস", desc: "গ্রামের জন্ম, ঐতিহ্য ও অতীতের গল্প জানুন।" },
  { icon: "🌳", title: "দর্শনীয় স্থান", desc: "গ্রামের সুন্দর ও আকর্ষণীয় জায়গাগুলো ঘুরে দেখুন।" },
  { icon: "👨‍👩‍👧", title: "কৃতী ব্যক্তিত্ব", desc: "গ্রামের গুণী ও পরিচিত মানুষদের সম্পর্কে জানুন।" },
  { icon: "🏪", title: "স্থানীয় ব্যবসা", desc: "গ্রামের দোকান ও ব্যবসা প্রতিষ্ঠানের তথ্য খুঁজুন।" },
  { icon: "🤝", title: "জনপ্রতিনিধি", desc: "গ্রামের দায়িত্বশীল ব্যক্তিদের পরিচিতি জানুন।" },
  { icon: "📞", title: "যোগাযোগ", desc: "গ্রামের প্রয়োজনীয় যোগাযোগের তথ্য দেখুন।" },
];

export default function HomePage() {
  return (
    <main>
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">🌿</span>
          আমার গ্রাম
        </Link>
        <span className="tagline">গ্রামের তথ্য, সবার জন্য</span>
        <Link href="/admin" className="location-chip">
          অ্যাডমিন লগইন
        </Link>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO AMAR GRAM</p>
          <h1>
            নিজের গ্রামকে জানুন,
            <br />
            <span>ভালোবাসুন বাংলাদেশকে</span>
          </h1>
          <p className="hero-copy">
            বাংলাদেশের প্রতিটি গ্রামের ইতিহাস, ঐতিহ্য, দর্শনীয় স্থান,
            কৃতী মানুষ ও প্রয়োজনীয় তথ্য এক জায়গায়।
          </p>
          <a href="#information" className="location-chip">
            গ্রামের তথ্য দেখুন →
          </a>
          <p className="small-note">আপনার গ্রাম, আপনার পরিচয়, আমাদের গর্ব।</p>
        </div>

        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000"
            alt="সবুজ প্রকৃতি ও গ্রামের দৃশ্য"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "320px",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
          />
        </div>
      </section>

      <section className="section" id="information">
        <div className="section-heading">
          <p className="eyebrow">EXPLORE YOUR VILLAGE</p>
          <h2>গ্রামের পরিচিতি</h2>
          <p>এক জায়গায় খুঁজে নিন আপনার গ্রামের সকল প্রয়োজনীয় তথ্য।</p>
        </div>

        <div className="cards">
          {cards.map((card) => (
            <article className="info-card" key={card.title}>
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notice">
        <div>
          <h2>গ্রামই আমাদের শিকড়</h2>
          <p>
            নিজের গ্রামের ইতিহাস ও ঐতিহ্য সংরক্ষণ করুন।
            নতুন প্রজন্মের কাছে তুলে ধরুন নিজের গ্রামের পরিচয়।
          </p>
        </div>
        <div className="notice-icon">🌾</div>
      </section>

      <footer>
        <strong>🌿 আমার গ্রাম</strong>
        <span>© ২০২৬ আমার গ্রাম | গ্রামের তথ্য, সবার জন্য</span>
      </footer>
    </main>
  );
}
