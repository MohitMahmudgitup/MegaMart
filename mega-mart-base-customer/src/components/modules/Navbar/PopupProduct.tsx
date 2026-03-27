import { X } from "lucide-react"
import { CollectionList } from "./CollectionList"
import { useEffect } from "react"

const PopupProduct = ({ onClose, searchQuery }: any) => {

  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = "hidden"

    return () => {
      // Enable body scroll again
      document.body.style.overflow = "auto"
    }
  }, [])
  
  return (
    <div 
      className="relative w-[1000px] h-[80vh] bg-white rounded-lg shadow-lg flex flex-col my-8"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h2 className="font-semibold text-lg">Products</h2>
      </div>

      {/* ONLY THIS AREA SCROLLS */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <CollectionList onClose={onClose} searchQuery={searchQuery} />
      </div>

    </div>
  )
}

export default PopupProduct