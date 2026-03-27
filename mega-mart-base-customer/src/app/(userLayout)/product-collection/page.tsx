import BestSellingProducts from "@/components/BestSellingProducts/BestSellingProducts";
import ModelWomen from "@/components/ModelWomen/ModelWomen";
import { ProductCollection } from "@/components/ProductCollection/ProductCollection";


export default function Home() {
  return <div>
    <div className="space-y-4  md:space-y-16 lg:space-y-20 2xl:px-0 md:px-8 px-0 ">

    <ProductCollection />
    <BestSellingProducts />
    <ModelWomen />

    </div>
  </div>
}
