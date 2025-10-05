import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

export default function Loading() {
  
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Loader />
            </main>
            <Footer />
        </div>
    )
    
}
