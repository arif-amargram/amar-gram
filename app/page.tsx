
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type LocationItem = {
  id: string;
  name: string;
};

type VillageItem = {
  id: string;
  name: string;
  history: string | null;
  description: string | null;
};

const cards = [
  { icon: "🏡", title: "গ্রামের ইতিহাস", desc: "গ্রামের জন্ম, ঐতিহ্য ও অতীতের গল্প জানুন।" },
  { icon: "🌳", title: "দর্শনীয় স্থান", desc: "গ্রামের সুন্দর ও আকর্ষণীয় জায়গাগুলো ঘুরে দেখুন।" },
  { icon: "👨‍👩‍👧", title: "কৃতী ব্যক্তিত্ব", desc: "গ্রামের গুণী ও পরিচিত মানুষদের সম্পর্কে জানুন।" },
  { icon: "🏪", title: "স্থানীয় ব্যবসা", desc: "গ্রামের দোকান ও ব্যবসা প্রতিষ্ঠানের তথ্য খুঁজুন।" },
  { icon: "🤝", title: "জনপ্রতিনিধি", desc: "গ্রামের দায়িত্বশীল ব্যক্তিদের পরিচিতি জানুন।" },
  { icon: "📞", title: "যোগাযোগ", desc: "গ্রামের প্রয়োজনীয় যোগাযোগের তথ্য দেখুন।" },
];

export default function HomePage() {
  const [divisions, setDivisions] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [upazilas, setUpazilas] = useState<LocationItem[]>([]);
  const [unions, setUnions] = useState<LocationItem[]>([]);
  const [villages, setVillages] = useState<VillageItem[]>([]);

  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [unionId, setUnionId] = useState("");
  const [selectedVillage, setSelectedVillage] = useState<VillageItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDivisions() {
      const { data, error } = await supabase
        .from("divisions")
        .select("id, name")
        .order("name");

      if (error) {
        setErrorMessage("বিভাগের তথ্য লোড করা যায়নি: " + error.message);
        return;
      }

      setDivisions(data || []);
    }

    loadDivisions();
  }, []);

  async function handleDivisionChange(value: string) {
    setDivisionId(value);
    setDistrictId("");
    setUpazilaId("");
    setUnionId("");
    setDistricts([]);
    setUpazilas([]);
    setUnions([]);
    setVillages([]);
    setSelectedVillage(null);
    setErrorMessage("");

    if (!value) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("districts")
      .select("id, name")
      .eq("division_id", value)
      .order("name");

    if (error) setErrorMessage(error.message);
    else setDistricts(data || []);

    setLoading(false);
  }

  async function handleDistrictChange(value: string) {
    setDistrictId(value);
    setUpazilaId("");
    setUnionId("");
    setUpazilas([]);
    setUnions([]);
    setVillages([]);
    setSelectedVillage(null);
    setErrorMessage("");

    if (!value) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("upazilas")
      .select("id, name")
      .eq("district_id", value)
      .order("name");

    if (error) setErrorMessage(error.message);
    else setUpazilas(data || []);

    setLoading(false);
  }

  async function handleUpazilaChange(value: string) {
    setUpazilaId(value);
    setUnionId("");
    setUnions([]);
    setVillages([]);
    setSelectedVillage(null);
    setErrorMessage("");

    if (!value) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("unions")
      .select("id, name")
      .eq("upazila_id", value)
      .order("name");

    if (error) setErrorMessage(error.message);
    else setUnions(data || []);

    setLoading(false);
  }

  async function handleUnionChange(value: string) {
    setUnionId(value);
    setVillages([]);
    setSelectedVillage(null);
    setErrorMessage("");

    if (!value) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("villages")
      .select("id, name, history, description")
      .eq("union_id", value)
      .eq("status", "published")
      .order("name");

    if (error) setErrorMessage(error.message);
    else setVillages(data || []);

    setLoading(false);
  }

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
          <a href="#village-search" className="location-chip">
            গ্রামের তথ্য খুঁজুন →
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

      <section className="section" id="village-search">
        <div className="section-heading">
          <p className="eyebrow">FIND YOUR VILLAGE</p>
          <h2>আপনার গ্রাম খুঁজুন</h2>
          <p>ধাপে ধাপে আপনার গ্রামের অবস্থান নির্বাচন করুন।</p>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "25px auto",
            padding: "25px",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
          }}
        >
          {[
            {
              label: "বিভাগ নির্বাচন",
              value: divisionId,
              options: divisions,
              change: handleDivisionChange,
            },
            {
              label: "জেলা নির্বাচন",
              value: districtId,
              options: districts,
              change: handleDistrictChange,
            },
            {
              label: "উপজেলা নির্বাচন",
              value: upazilaId,
              options: upazilas,
              change: handleUpazilaChange,
            },
            {
              label: "ইউনিয়ন নির্বাচন",
              value: unionId,
              options: unions,
              change: handleUnionChange,
            },
          ].map((item) => (
            <label
              key={item.label}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <strong style={{ color: "#245b3b", fontSize: "14px" }}>
                {item.label}
              </strong>
              <select
                value={item.value}
                onChange={(e) => item.change(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d5e3d8",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "14px",
                }}
              >
                <option value="">নির্বাচন করুন</option>
                {item.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
          ))}

          {unionId && (
            <label
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <strong style={{ color: "#245b3b", fontSize: "14px" }}>
                গ্রাম নির্বাচন
              </strong>
              <select
                value={selectedVillage?.id || ""}
                onChange={(e) => {
                  const village = villages.find(
                    (v) => v.id === e.target.value
                  );
                  setSelectedVillage(village || null);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d5e3d8",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "14px",
                }}
              >
                <option value="">গ্রাম নির্বাচন করুন</option>
                {villages.map((village) => (
                  <option key={village.id} value={village.id}>
                    {village.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "#245b3b" }}>
            তথ্য লোড হচ্ছে...
          </p>
        )}

        {errorMessage && (
          <p style={{ textAlign: "center", color: "red" }}>
            {errorMessage}
          </p>
        )}

        {unionId && !loading && villages.length === 0 && !errorMessage && (
          <p style={{ textAlign: "center" }}>
            এই ইউনিয়নে এখনো কোনো প্রকাশিত গ্রামের তথ্য নেই।
          </p>
        )}

        {selectedVillage && (
          <div
            style={{
              maxWidth: "700px",
              margin: "25px auto",
              padding: "25px",
              background: "#f0f8f1",
              borderRadius: "15px",
              border: "1px solid #c9e3ce",
            }}
          >
            <p style={{ color: "#287344", fontWeight: "bold" }}>
              আপনার নির্বাচিত গ্রাম
            </p>
            <h2 style={{ fontSize: "25px", margin: "10px 0" }}>
              🏡 {selectedVillage.name}
            </h2>
            <h3>গ্রামের ইতিহাস</h3>
            <p>{selectedVillage.history || "ইতিহাসের তথ্য এখনো যোগ করা হয়নি।"}</p>
            <h3 style={{ marginTop: "15px" }}>গ্রামের পরিচিতি</h3>
            <p>
              {selectedVillage.description ||
                "গ্রামের পরিচিতির তথ্য এখনো যোগ করা হয়নি।"}
            </p>
          </div>
        )}
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
