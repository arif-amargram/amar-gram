
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-green-50">
      <header className="bg-green-800 text-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">আমার গ্রাম</h1>
          <Link
            href="/admin"
            className="bg-white text-green-800 px-4 py-2 rounded-lg font-semibold"
          >
            অ্যাডমিন লগইন
          </Link>
        </div>
      </header>

      <section className="text-center px-5 py-20">
        <h2 className="text-4xl font-bold text-green-900 mb-5">
          নিজের গ্রামকে জানুন, গ্রামকে ভালোবাসুন
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
          বাংলাদেশের প্রতিটি গ্রামের ইতিহাস, ঐতিহ্য, দর্শনীয় স্থান,
          কৃতী মানুষ এবং প্রয়োজনীয় তথ্য এক জায়গায়।
        </p>

        <div className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="আপনার গ্রামের নাম লিখুন..."
            className="flex-1 min-w-0 border border-green-300 rounded-lg px-4 py-3"
          />
          <button className="bg-green-700 text-white px-5 py-3 rounded-lg">
            খুঁজুন
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <h2 className="text-2xl font-bold text-green-900 text-center mb-8">
          আমাদের গ্রামের তথ্য
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ["গ্রামের ইতিহাস", "গ্রামের অতীত, ঐতিহ্য ও পরিচিতি জানুন।"],
            ["দর্শনীয় স্থান", "গ্রামের সুন্দর ও গুরুত্বপূর্ণ স্থানগুলো দেখুন।"],
            ["কৃতী ব্যক্তিত্ব", "গ্রামের গুণী ও পরিচিত মানুষদের সম্পর্কে জানুন।"],
            ["গ্রামের জনপ্রতিনিধি", "গ্রামের দায়িত্বশীল ব্যক্তিদের তথ্য জানুন।"],
            ["স্থানীয় ব্যবসা", "গ্রামের দোকান ও ব্যবসা প্রতিষ্ঠানের তথ্য খুঁজুন।"],
            ["গ্রামের যোগাযোগ", "গ্রামের প্রয়োজনীয় যোগাযোগের তথ্য দেখুন।"],
          ].map(([title, description]) => (
            <div
              key={title}
              className="bg-white rounded-xl shadow p-6 text-center"
            >
              <h3 className="text-xl font-bold text-green-800 mb-3">
                {title}
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-green-900 text-white text-center p-5">
        © ২০২৬ আমার গ্রাম | গ্রামের তথ্য, সবার জন্য
      </footer>
    </main>
  );
}
