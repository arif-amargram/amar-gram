
import { supabase } from "@/lib/supabase";

const quickLinks = [
  { icon: "🏫", title: "শিক্ষাপ্রতিষ্ঠান", text: "স্কুল, কলেজ ও মাদ্রাসার তথ্য" },
  { icon: "🕌", title: "ধর্মীয় প্রতিষ্ঠান", text: "মসজিদ ও অন্যান্য প্রতিষ্ঠানের তথ্য" },
  { icon: "🏥", title: "স্বাস্থ্যসেবা", text: "ক্লিনিক, ফার্মেসি ও জরুরি সেবা" },
  { icon: "🛍️", title: "স্থানীয় ব্যবসা", text: "দোকান ও সেবাদানকারীর পরিচিতি" },
  { icon: "📍", title: "দর্শনীয় স্থান", text: "গ্রামের পরিচিত স্থান ও তথ্য" },
  { icon: "👥", title: "গ্রামবাসী", text: "সম্মতিসহ প্রকাশিত পরিচিতি" },
];

export default async function Home() {
  const { data: villages } = await supabase
    .from("villages")
    .select("name, history, description")
    .eq("status", "published")
    .limit(1);

  const village = villages?.[0];

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">আ</span>
          <span>আমার গ্রাম</span>
        </a>
        <span className="tagline">গ্রামের তথ্য, সবার জন্য</span>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO AMAR GRAM</p>
          <h1>
            আমার গ্রাম,<br />
            <span>আমাদের পরিচয়</span>
          </h1>
          <p className="hero-copy">
            নিজের গ্রামের প্রয়োজনীয় তথ্য, প্রতিষ্ঠান, স্থানীয় ব্যবসা ও পরিচিতি
            এক জায়গায় খুঁজে পাওয়ার সহজ উদ্যোগ।
          </p>

          <div className="location-chip">
            📍 {village?.name || "দর্শনগ্রাম"} · বিষা · আত্রাই · নওগাঁ
          </div>

          <p className="small-note">
            {village?.description ||
              "গ্রামের তথ্য সংগ্রহ ও যাচাইয়ের কাজ চলছে।"}
          </p>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="sun" />
          <div className="hill hill-back" />
          <div className="hill hill-front" />
          <div className="house">⌂</div>
          <div className="tree tree-one">♣</div>
          <div className="tree tree-two">♣</div>
          <div className="river" />
        </div>
      </section>

      {village?.history && (
        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">VILLAGE HISTORY</p>
            <h2>{village.name} গ্রামের ইতিহাস</h2>
            <p>{village.history}</p>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">EXPLORE YOUR VILLAGE</p>
          <h2>গ্রামের তথ্য খুঁজুন</h2>
          <p>
            একটি সুন্দর, তথ্যসমৃদ্ধ ও সবার জন্য উন্মুক্ত গ্রাম directory
            গড়ে তোলাই আমাদের লক্ষ্য।
          </p>
        </div>

        <div className="cards">
          {quickLinks.map((item) => (
            <article className="info-card" key={item.title}>
              <span className="card-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notice">
        <div>
          <p className="eyebrow">OUR INITIATIVE</p>
          <h2>তথ্য হোক সবার হাতের নাগালে</h2>
          <p>
            সঠিক তথ্য সংগ্রহ, যাচাই এবং অনুমতি নিয়ে প্রকাশের মাধ্যমে
            গ্রামের মানুষের উপকারে আসাই আমাদের উদ্দেশ্য।
          </p>
        </div>
        <span className="notice-icon">🌱</span>
      </section>

      <footer>
        <strong>আমার গ্রাম | AMAR GRAM</strong>
        <span>একটি কমিউনিটি উদ্যোগ · © 2026</span>
      </footer>
    </main>
  );
}
