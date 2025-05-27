import Footer from "@/components/footer";
import Header from "@/components/header";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Saved Translations</h1>
          {/* Add favorite translations with categories */}
        </div>
      </main>
      <Footer />
    </div>
  )
}