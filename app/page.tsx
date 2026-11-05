
import Link from "next/link";

const categories = [
  {
    icon: "🏡",
    title: "গ্রামের ইতিহাস",
    description: "জানুন গ্রামের জন্ম, ঐতিহ্য ও অতীতের গল্প।",
  },
  {
    icon: "🌳",
    title: "দর্শনীয় স্থান",
    description: "ঘুরে দেখুন গ্রামের সুন্দর ও আকর্ষণীয় জায়গা।",
  },
  {
    icon: "👨‍👩‍👧",
    title: "কৃতী ব্যক্তিত্ব",
    description: "জানুন গ্রামের গুণী ও পরিচিত মানুষদের কথা।",
  },
  {
    icon: "🏪",
    title: "স্থানীয় ব্যবসা",
    description: "খুঁজে নিন গ্রামের দোকান ও ব্যবসা প্রতিষ্ঠান।",
  },
  {
    icon: "🤝",
    title: "জনপ্রতিনিধি",
    description: "জানুন গ্রামের দায়িত্বশীল ব্যক্তিদের তথ্য।",
  },
  {
    icon: "📞",
    title: "যোগাযোগ",
    description: "প্রয়োজনীয় যোগাযোগের তথ্য খুঁজে নিন।",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f8f2] text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold text-green-800">
            🌿 আমার গ্রাম
          </Link>

          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="text-green-800">হোম</Link>
            <a href="#information" className="hover:text-green-700">
              গ্রামের তথ্য
            </a>
            <Link
              href="/admin"
              className="bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              অ্যাডমিন
            </Link>
          </nav>
        </div>
      </header>

      <section
        className="relative min-h-[470px] flex items-center justify-center text-center px-5 py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,35,15,.55),rgba(0,35,15,.55)),url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800')",
        }}
      >
        <div className="max-w-3xl text-white">
          <p className="text-green-200 font-semibold mb-4">
            গ্রামের গল্প, গ্রামের পরিচয়
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            নিজের গ্রামকে জানুন,
            <br />
            ভালোবাসুন বাংলাদেশকে
          </h1>

          <p className="text-lg md:text-xl text-gray-100 mb-9">
            বাংলাদেশের প্রতিটি গ্রামের ইতিহাস, ঐতিহ্য, মানুষ ও
            প্রয়োজনীয় তথ্য এক জায়গায়।
          </p>

          <a
            href="#search"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-green-950 font-bold px-8 py-3 rounded-full"
          >
            গ্রাম খুঁজুন ↓
          </a>
        </div>
      </section>

      <section id="search" className="max-w-5xl mx-auto px-5 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-5 text-center">
            আপনার গ্রাম খুঁজে নিন
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {["বিভাগ নির্বাচন", "জেলা নির্বাচন", "উপজেলা নির্বাচন", "গ্রাম নির্বাচন"].map((item) => (
              <select
                key={item}
                defaultValue=""
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              >
                <option value="" disabled>{item}</option>
              </select>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            খুব শিগগিরই এখানে বিভাগ থেকে গ্রাম পর্যন্ত তথ্য অনুসন্ধান করা যাবে।
          </p>
        </div>
      </section>

      <section id="information" className="max-w-7xl mx-auto px-5 py-20">
        <div className="text-center mb-10">
          <p className="text-green-700 font-semibold mb-2">এক জায়গায় সব তথ্য</p>
          <h2 className="text-3xl font-extrabold text-green-950">
            গ্রামের পরিচিতি
          </h2>
          <p className="text-gray-600 mt-3">
            আপনার গ্রামের প্রয়োজনীয় সব তথ্য জানুন।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition border border-green-50"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-7">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-900 text-white py-16 px-5 text-center">
        <h2 className="text-3xl font-bold mb-4">
          গ্রামই আমাদের শিকড়
        </h2>
        <p className="text-green-100 max-w-2xl mx-auto">
          নিজের গ্রামের তথ্য সংরক্ষণ করুন। নতুন প্রজন্মের কাছে
          তুলে ধরুন গ্রামের ইতিহাস ও ঐতিহ্য।
        </p>
      </section>

      <footer className="bg-[#102d20] text-green-100 text-center py-6 px-5">
        <p className="font-bold text-lg">🌿 আমার গ্রাম</p>
        <p className="text-sm mt-2">
          © ২০২৬ আমার গ্রাম | গ্রামের তথ্য, সবার জন্য
        </p>
      </footer>
    </main>
  );
}
