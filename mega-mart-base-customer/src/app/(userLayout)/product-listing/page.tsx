import AppPromo from "@/components/modules/home/app-promo/AppPromo";
import ProductListing from "@/components/ProductList/ProductList";
import SaveMore from "@/components/modules/home/save-more/SaveMore";


export default function Home() {
    return (
        <div className="min-h-screen space-y-4 md:space-y-16 lg:space-y-20 bg-background">
            <ProductListing />
            <SaveMore />
            <AppPromo />
        </div>
    )
}
