
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Village = {
  id: string;
  name: string;
  history: string | null;
  description: string | null;
};
type Person = {
  id: string;
  village_id: string;
  name: string;
  designation: string | null;
  description: string | null;
  phone: string | null;
  consent_confirmed: boolean;
  status: string;
};
type Place = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  image_url: string | null;
  status: string;
  village_id: string;
};
export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [history, setHistory] = useState("");
  const [description, setDescription] = useState("");
const [places, setPlaces] = useState<Place[]>([]);
const [placeName, setPlaceName] = useState("");
const [placeDescription, setPlaceDescription] = useState("");
const [placeAddress, setPlaceAddress] = useState("");
const [placeVillageId, setPlaceVillageId] = useState("");
const [placeImage, setPlaceImage] = useState<File | null>(null);
const [placeLoading, setPlaceLoading] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
const [personName, setPersonName] = useState("");
const [personDesignation, setPersonDesignation] = useState("");
const [personDescription, setPersonDescription] = useState("");
const [personPhone, setPersonPhone] = useState("");
const [personVillageId, setPersonVillageId] = useState("");
const [personConsent, setPersonConsent] = useState(false);
const [personLoading, setPersonLoading] = useState(false);
  async function loadVillages() {
    const { data, error } = await supabase
      .from("villages")
      .select("id, name, history, description")
      .order("name");

    if (error) {
      setMessage("গ্রামের তথ্য লোড করা যায়নি: " + error.message);
      return;
    }

    setVillages(data || []);
  }
async function loadPlaces() {
async function loadPeople() {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .order("name");

  if (error) {
    setMessage("কৃতী ব্যক্তিত্বের তথ্য লোড হয়নি: " + error.message);
    return;
  }

  setPeople(data || []);
}
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("name");

  if (error) {
    setMessage("দর্শনীয় স্থানের তথ্য লোড হয়নি: " + error.message);
    return;
  }

  setPlaces(data || []);
}
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Login error: " + error.message);
      setLoading(false);
      return;
    }

    if (data.user?.app_metadata?.role === "admin") {
      setIsAdmin(true);
      await loadVillages();
await loadPlaces();
await loadPeople();
setMessage("স্বাগতম! Admin Login Successful.");
    } else {
      await supabase.auth.signOut();
      setMessage("তোমার Admin permission নেই।");
    }

    setLoading(false);
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        "https://eloquent-flan-a40f60.netlify.app/auth/update-password",
    });

    if (error) {
      setMessage("Recovery failed: " + error.message);
    } else {
      setMessage("Recovery Email পাঠানো হয়েছে। Gmail পরীক্ষা করো।");
    }

    setLoading(false);
  }

  function handleVillageChange(id: string) {
    setSelectedVillageId(id);
    const village = villages.find((v) => v.id === id);
    setHistory(village?.history || "");
    setDescription(village?.description || "");
    setMessage("");
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedVillageId) {
      setMessage("প্রথমে একটি গ্রাম নির্বাচন করো।");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("villages")
      .update({ history, description })
      .eq("id", selectedVillageId);

    if (error) {
      setMessage("Save failed: " + error.message);
    } else {
      setVillages((previous) =>
        previous.map((village) =>
          village.id === selectedVillageId
            ? { ...village, history, description }
            : village
        )
      );
      setMessage("গ্রামের তথ্য সফলভাবে সংরক্ষণ হয়েছে!");
    }

    setLoading(false);
  }
async function handleAddPlace(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!placeVillageId) {
    setMessage("প্রথমে একটি গ্রাম নির্বাচন করুন।");
    return;
  }

  setPlaceLoading(true);
  setMessage("");

  let imageUrl = "";

  if (placeImage) {
    const fileName = `${Date.now()}-${placeImage.name.replace(/\s/g, "-")}`;

    const { error: uploadError } = await supabase.storage
      .from("village-places")
      .upload(fileName, placeImage);

    if (uploadError) {
      setMessage("ছবি Upload হয়নি: " + uploadError.message);
      setPlaceLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("village-places")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const { error } = await supabase.from("places").insert({
    name: placeName,
    description: placeDescription,
    address: placeAddress,
    image_url: imageUrl,
    village_id: placeVillageId,
    status: "published",
  });

  if (error) {
    setMessage("তথ্য Save হয়নি: " + error.message);
  } else {
    setMessage("দর্শনীয় স্থান সফলভাবে যোগ হয়েছে!");

    setPlaceName("");
    setPlaceDescription("");
    setPlaceAddress("");
    setPlaceVillageId("");
    setPlaceImage(null);

    await loadPlaces();
  }

  setPlaceLoading(false);
}
async function handleAddPerson(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!personVillageId) {
    setMessage("প্রথমে একটি গ্রাম নির্বাচন করুন।");
    return;
  }

  if (!personConsent) {
    setMessage("ব্যক্তির তথ্য প্রকাশের সম্মতি নিশ্চিত করুন।");
    return;
  }

  setPersonLoading(true);
  setMessage("");

  const { error } = await supabase.from("people").insert({
    name: personName,
    designation: personDesignation,
    description: personDescription,
    phone: personPhone,
    village_id: personVillageId,
    consent_confirmed: true,
    status: "published",
  });

  if (error) {
    setMessage("তথ্য সংরক্ষণ হয়নি: " + error.message);
  } else {
    setMessage("কৃতী ব্যক্তিত্বের তথ্য সফলভাবে যোগ হয়েছে!");

    setPersonName("");
    setPersonDesignation("");
    setPersonDescription("");
    setPersonPhone("");
    setPersonVillageId("");
    setPersonConsent(false);

    await loadPeople();
  }

  setPersonLoading(false);
}
  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setEmail("");
    setPassword("");
    setVillages([]);
    setSelectedVillageId("");
    setHistory("");
    setDescription("");
    setMessage("Logout successful.");
  }

  const selectedVillage = villages.find(
    (village) => village.id === selectedVillageId
  );

  return (
    <main className="min-h-screen bg-[#f3f7f2] text-gray-800">
      {!isAdmin ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#edf4eb]">
          <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">
            <div className="relative min-h-[280px] md:min-h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200"
                alt="সবুজ গ্রামের প্রকৃতি"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-950/55 flex flex-col justify-end p-8 md:p-12 text-white">
                <p className="text-green-200 font-semibold tracking-widest text-sm">
                  WELCOME TO
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mt-3">
                  আমার গ্রাম
                </h1>
                <p className="mt-4 text-green-50 text-lg">
                  গ্রামের ইতিহাস, ঐতিহ্য ও পরিচয় সংরক্ষণের একটি ডিজিটাল
                  ঠিকানা।
                </p>
              </div>
            </div>

            <div className="p-7 md:p-12 flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🌿</div>
                <h2 className="text-3xl font-bold text-green-800">
                  {forgotPassword ? "Reset Password" : "Admin Login"}
                </h2>
                <p className="text-gray-500 mt-2">
                  আমার গ্রাম - Administration Portal
                </p>
              </div>

              {forgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <label className="block">
                    <span className="block mb-2 font-medium">Admin Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotPassword(false);
                      setMessage("");
                    }}
                    className="w-full text-green-700 font-medium"
                  >
                    ← Back to Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  <label className="block">
                    <span className="block mb-2 font-medium">Email Address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Admin email"
                      className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  <label className="block">
                    <span className="block mb-2 font-medium">Password</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                      className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login to Dashboard →"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotPassword(true);
                      setMessage("");
                    }}
                    className="w-full text-green-700 font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </form>
              )}

              {message && (
                <p className="mt-5 text-center text-sm text-gray-700 break-words">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        
<div className="admin-dashboard">
  <aside className="admin-sidebar">
    <div style={{ fontSize: "35px" }}>🌿</div>
    <h2>আমার গ্রাম</h2>
    <p style={{ color: "#c6e5d2" }}>Admin Control Panel</p>

    <nav>
      <a href="#dashboard">📊 Dashboard</a>
      <a href="#village-management">🏡 Village Management</a>
      <a href="/">🌐 View Website</a>
    </nav>

    <button
      onClick={handleLogout}
      className="admin-logout"
    >
      ↪ Logout
    </button>
  </aside>

  <section className="admin-content">
    <div id="dashboard" className="admin-header">
      <p style={{ color: "#176b4a", fontWeight: "bold" }}>
        ADMINISTRATION PORTAL
      </p>
      <h1>Dashboard Overview</h1>
      <p>আমার গ্রাম ওয়েবসাইটের সকল তথ্য এখান থেকে পরিচালনা করুন।</p>
    </div>

    <div className="admin-stats">
      <div className="admin-stat-card">
        <div className="stat-icon">🏡</div>
        <p>মোট গ্রাম</p>
        <h3>{villages.length}</h3>
      </div>

      <div className="admin-stat-card">
        <div className="stat-icon">📝</div>
        <p>Village Information</p>
        <h3>Management</h3>
      </div>

      <div className="admin-stat-card">
        <div className="stat-icon">🌐</div>
        <p>Website Status</p>
        <h3>Connected</h3>
      </div>
    </div>

    <div id="village-management" className="admin-panel">
      <h2>🏡 Village Information Management</h2>
      <p>গ্রামের ইতিহাস ও পরিচিতি যোগ অথবা পরিবর্তন করুন।</p>

      <form onSubmit={handleSave}>
        <label>
          গ্রাম নির্বাচন করুন
          <select
            value={selectedVillageId}
            onChange={(e) => handleVillageChange(e.target.value)}
            required
          >
            <option value="">গ্রাম নির্বাচন করুন</option>
            {villages.map((village) => (
              <option key={village.id} value={village.id}>
                {village.name}
              </option>
            ))}
          </select>
        </label>

        {selectedVillage && (
          <p style={{ color: "#176b4a", marginTop: "15px" }}>
            নির্বাচিত গ্রাম: <strong>{selectedVillage.name}</strong>
          </p>
        )}

        <label>
          গ্রামের ইতিহাস
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            rows={6}
            placeholder="এখানে গ্রামের ইতিহাস লিখুন..."
          />
        </label>

        <label>
          গ্রামের পরিচিতি
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="এখানে গ্রামের পরিচিতি লিখুন..."
          />
        </label>

        <button type="submit" disabled={loading || !selectedVillageId}>
          {loading ? "Saving..." : "💾 তথ্য সংরক্ষণ করুন"}
        </button>
      </form>
    </div>

<div className="admin-panel" style={{ marginTop: "30px" }}>
  <h2>📍 Tourist Places Management</h2>
  <p>গ্রামের দর্শনীয় স্থান ও ছবি যোগ করুন।</p>

  <form onSubmit={handleAddPlace}>
    <label>
      দর্শনীয় স্থানের নাম
      <input
        type="text"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        placeholder="যেমন: ঐতিহাসিক মসজিদ"
        required
      />
    </label>

    <label>
      গ্রাম নির্বাচন করুন
      <select
        value={placeVillageId}
        onChange={(e) => setPlaceVillageId(e.target.value)}
        required
      >
        <option value="">গ্রাম নির্বাচন করুন</option>
        {villages.map((village) => (
          <option key={village.id} value={village.id}>
            {village.name}
          </option>
        ))}
      </select>
    </label>

    <label>
      স্থানের ঠিকানা
      <input
        type="text"
        value={placeAddress}
        onChange={(e) => setPlaceAddress(e.target.value)}
        placeholder="স্থানের ঠিকানা লিখুন"
      />
    </label>

    <label>
      স্থানের বিবরণ
      <textarea
        rows={5}
        value={placeDescription}
        onChange={(e) => setPlaceDescription(e.target.value)}
        placeholder="দর্শনীয় স্থানের বিস্তারিত লিখুন..."
      />
    </label>

    <label>
      স্থানের ছবি আপলোড
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setPlaceImage(e.target.files?.[0] || null)
        }
      />
    </label>

    <button type="submit" disabled={placeLoading}>
      {placeLoading ? "Uploading..." : "📤 দর্শনীয় স্থান যোগ করুন"}
    </button>
  </form>

  <div style={{ marginTop: "30px" }}>
    <h3>সংরক্ষিত দর্শনীয় স্থান: {places.length}</h3>

    {places.map((place) => (
      <div
        key={place.id}
        style={{
          padding: "15px",
          marginTop: "15px",
          border: "1px solid #e4eee7",
          borderRadius: "12px",
        }}
      >
        {place.image_url && (
          <img
            src={place.image_url}
            alt={place.name}
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        )}
        <h3>{place.name}</h3>
        <p>{place.address}</p>
        <p>{place.description}</p>
      </div>
    ))}
  </div>
</div>

<div className="admin-panel" style={{ marginTop: "30px" }}>
  <h2>👨‍👩‍👧 কৃতী ব্যক্তিত্ব Management</h2>
  <p>গ্রামের গুণী ও পরিচিত ব্যক্তিদের তথ্য যোগ করুন।</p>

  <form onSubmit={handleAddPerson}>
    <label>
      ব্যক্তির নাম
      <input
        type="text"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        placeholder="ব্যক্তির নাম লিখুন"
        required
      />
    </label>

    <label>
      পরিচয় / পদবি
      <input
        type="text"
        value={personDesignation}
        onChange={(e) => setPersonDesignation(e.target.value)}
        placeholder="যেমন: শিক্ষক, মুক্তিযোদ্ধা, সমাজসেবক"
        required
      />
    </label>

    <label>
      গ্রাম নির্বাচন করুন
      <select
        value={personVillageId}
        onChange={(e) => setPersonVillageId(e.target.value)}
        required
      >
        <option value="">গ্রাম নির্বাচন করুন</option>
        {villages.map((village) => (
          <option key={village.id} value={village.id}>
            {village.name}
          </option>
        ))}
      </select>
    </label>

    <label>
      ব্যক্তির পরিচিতি
      <textarea
        rows={5}
        value={personDescription}
        onChange={(e) => setPersonDescription(e.target.value)}
        placeholder="ব্যক্তির বিস্তারিত পরিচিতি লিখুন..."
      />
    </label>

    <label>
      মোবাইল নম্বর
      <input
        type="tel"
        value={personPhone}
        onChange={(e) => setPersonPhone(e.target.value)}
        placeholder="মোবাইল নম্বর লিখুন"
      />
    </label>

    <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        type="checkbox"
        checked={personConsent}
        onChange={(e) => setPersonConsent(e.target.checked)}
        required
      />
      ব্যক্তির তথ্য প্রকাশের সম্মতি নেওয়া হয়েছে।
    </label>

    <button
      type="submit"
      disabled={personLoading || !personConsent}
    >
      {personLoading ? "Saving..." : "👤 কৃতী ব্যক্তিত্ব যোগ করুন"}
    </button>
  </form>

  <div style={{ marginTop: "30px" }}>
    <h3>সংরক্ষিত কৃতী ব্যক্তিত্ব: {people.length}</h3>

    {people.map((person) => (
      <div
        key={person.id}
        style={{
          padding: "15px",
          marginTop: "15px",
          border: "1px solid #e4eee7",
          borderRadius: "12px",
        }}
      >
        <h3>{person.name}</h3>
        <p><strong>{person.designation}</strong></p>
        <p>
          গ্রাম: {villages.find((v) => v.id === person.village_id)?.name || ""}
        </p>
        <p>{person.description}</p>
        <p>{person.phone}</p>
        <p>স্ট্যাটাস: {person.status}</p>
      </div>
    ))}
  </div>
</div>

    {message && (
      <p className="admin-message">{message}</p>
    )}

    <div className="admin-footer">
      © 2026 Amar Gram | Admin Dashboard
    </div>
  </section>
</div>

      )}
    </main>
  );
}
