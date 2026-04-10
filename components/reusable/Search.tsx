"use client";

import { CircleHelp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search() {
  const [search, setSearch] = useState<string>("");
  const [product, setProduct] = useState<any>({ results: [] });
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  // Fetch products once when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Demo data
        const demoProducts = {
          data: {
            results: [
              {
                product: {
                  name: "Maid Service Package A",
                  category: { slug: "maid-services" },
                },
              },
              {
                product: {
                  name: "Maid Service Package B",
                  category: { slug: "maid-services" },
                },
              },
              {
                product: {
                  name: "Cleaning Services",
                  category: { slug: "cleaning" },
                },
              },
              {
                product: {
                  name: "Household Management",
                  category: { slug: "household" },
                },
              },
              {
                product: {
                  name: "Care Services",
                  category: { slug: "care-services" },
                },
              },
            ],
          },
        };
        setProduct(demoProducts?.data || { results: [] });
      } catch (error) {
        console.error("Failed to fetch product info:", error);
      }
    };

    fetchData();
  }, []);

  // Filter products when `search` or `product.results` changes
  useEffect(() => {
    if (search.trim() !== "" && product.results.length > 0) {
      setFilteredProducts(
        product?.results?.filter((item: any) =>
          item?.product?.name?.toLowerCase().includes(search.toLowerCase()),
        ) || [],
      );
    } else {
      setFilteredProducts([]);
    }
  }, [search, product.results]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", search);

    router.push(`/products?${params.toString()}`);

    // Clear the input field after navigating
    setSearch("");
  };
  const handleProductNameSearch = (path: string, name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", name);
    router.push(`/category/${path}?${params.toString()}`);

    // Clear the input field after navigating
    setSearch("");
  };

  return (
    <div className="w-full md:w-80 lg:w-90 relative">
      <input
        type="text"
        name="search"
        value={search}
        onChange={handleChange}
        className=" w-full  p-3  rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56]"
        placeholder="Search User"
      />
      <button
        onClick={handleSearch}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M16.893 16.92L19.973 20M19 11.5C19 13.4891 18.2098 15.3968 16.8033 16.8033C15.3968 18.2098 13.4891 19 11.5 19C9.51088 19 7.60322 18.2098 6.1967 16.8033C4.79018 15.3968 4 13.4891 4 11.5C4 9.51088 4.79018 7.60322 6.1967 6.1967C7.60322 4.79018 9.51088 4 11.5 4C13.4891 4 15.3968 4.79018 16.8033 6.1967C18.2098 7.60322 19 9.51088 19 11.5Z"
            stroke="#A5A5AB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Display the filtered product list */}
      {search !== "" && (
        <div className="mt-4 bg-white shadow-md rounded-lg px-3 py-6 absolute w-full">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item: any, index: number) => (
              <button
                key={index}
                onClick={() =>
                  handleProductNameSearch(
                    item.product.category.slug,
                    item.product.name,
                  )
                }
                className="block w-full text-left p-2 text-blackColor text-base font-semibold rounded-md"
              >
                {item.product.name}
              </button>
            ))
          ) : (
            <p className="text-textColor p-2 flex justify-center font-semibold items-center gap-3">
              <CircleHelp className="text-primaryColor" size={40} /> No matching
              products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
