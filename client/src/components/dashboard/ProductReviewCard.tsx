import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import camisa1 from "../../images/camisa1.webp";
import camisa2 from "../../images/camisa2.png";
import camisa3 from "../../images/camisa3.png";
import bone1 from "../../images/bone1.png";
import bone2 from "../../images/bone2.png";
import bone3 from "../../images/bone3.png";
import moletom1 from "../../images/moletom1.png";
import moletom2 from "../../images/moletom2.png";
import moletom3 from "../../images/moletom3.png";

type Product = {
  id: number;
  name: string;
  image: string;
};

export function ProductReviewCard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>("");
  const [purchasedProducts, setPurchasedProducts] = useState<
    Record<string, Product[]>
  >({});
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const categories = ["Camisas", "Bonés", "Moletons"];

  const allProducts: Record<string, Product[]> = {
    Camisas: [
      {
        id: 1,
        name: "Camiseta Furia Oficial '24 Preta",
        image: camisa1,
      },
      {
        id: 4,
        name: "Camiseta Oficial Furia | Adidas Preta",
        image: camisa2,
      },
      {
        id: 5,
        name: "Camiseta My Hero Academia x Furia Izuku Midorya Branca",
        image: camisa3,
      },
    ],
    Bonés: [
      { id: 2, name: "Boné Furia Furioso Preto", image: bone1 },
      {
        id: 6,
        name: "Boné 9Twenty Furia x New Era Branco e Preto",
        image: bone2,
      },
      {
        id: 7,
        name: "Boné 59Fifty Furia x New Era Preto e Branco",
        image: bone3,
      },
    ],
    Moletons: [
      {
        id: 3,
        name: "Moletom Careca Furia Future is Black Preto",
        image: moletom1,
      },
      {
        id: 8,
        name: "Jaqueta Furia Magic Panthera Azul",
        image: moletom2,
      },
      {
        id: 9,
        name: "Moletom Oversized Furia Spray It Rosa",
        image: moletom3,
      },
    ],
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setIsAddingProduct(false);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handleSubmitReview = () => {
    if (selectedProduct && rating !== null) {
      console.log("Avaliação salva:", {
        product: selectedProduct,
        rating,
        review,
      });

      // Marcar como comprado (se ainda não estiver na lista)
      setPurchasedProducts((prev) => {
        const updated = { ...prev };
        if (!updated[selectedCategory!]) updated[selectedCategory!] = [];
        const exists = updated[selectedCategory!].some(
          (p) => p.id === selectedProduct.id
        );
        if (!exists) updated[selectedCategory!].push(selectedProduct);
        return updated;
      });

      // Resetar
      setSelectedProduct(null);
      setRating(null);
      setReview("");
      setIsAddingProduct(false);
    }
  };

  const getAvailableProducts = (category: string) => {
    const purchased = purchasedProducts[category] || [];
    return allProducts[category].filter(
      (p) => !purchased.some((pp) => pp.id === p.id)
    );
  };

  return (
    <div className="bg-black/50 rounded-lg p-6 mb-8">
      <h3 className="font-rajdhani font-bold text-2xl mb-6">
        Seus produtos FURIA
      </h3>

      <div className="flex space-x-4 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`w-full p-3 rounded ${
              selectedCategory === category ? "bg-sky-500" : "bg-sky-400"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {selectedCategory && (
        <>
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-white">Produtos já avaliados:</h4>
            {(purchasedProducts[selectedCategory] || []).length === 0 ? (
              <p className="text-gray-400 text-sm">
                Nenhum produto avaliado ainda.
              </p>
            ) : (
              purchasedProducts[selectedCategory]!.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded"
                  />
                  <span className="text-white">{product.name}</span>
                </div>
              ))
            )}
          </div>

          {!isAddingProduct ? (
            <Button
              onClick={() => setIsAddingProduct(true)}
              className="bg-furia-red text-white px-4 py-2 rounded font-bold hover:bg-red-700"
            >
              + Adicionar novo produto
            </Button>
          ) : (
            <>
              <div className="mt-4 space-y-2">
                <h4 className="text-white font-semibold mb-2">
                  Selecione um produto:
                </h4>
                {getAvailableProducts(selectedCategory).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded"
                    />
                    <span className="text-white">{product.name}</span>
                  </div>
                ))}
                {getAvailableProducts(selectedCategory).length === 0 && (
                  <p className="text-gray-400 text-sm">
                    Nenhum produto disponível para adicionar.
                  </p>
                )}
              </div>
            </>
          )}
        </>
      )}

      {selectedProduct && (
        <div className="mt-6">
          <h4 className="font-rajdhani font-semibold text-xl mb-4">
            Avaliar: {selectedProduct.name}
          </h4>
          <div className="mb-4">
            <Rating
              value={rating ?? 0}
              onValueChange={(value: number) => setRating(value)}
              count={5}
              className="text-yellow-500 [&_svg]:w-6 [&_svg]:h-6"
            />
          </div>
          <textarea
            value={review}
            onChange={handleReviewChange}
            placeholder="Escreva sua avaliação"
            className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4"
            rows={4}
          />
          <Button
            onClick={handleSubmitReview}
            className="bg-furia-red text-white px-6 py-3 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors"
          >
            Salvar Avaliação
          </Button>
        </div>
      )}
    </div>
  );
}
