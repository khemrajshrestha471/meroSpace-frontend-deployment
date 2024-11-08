"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CommonProducts from "@/components/products/CommonProducts";

interface SearchResult {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string;
}

const SearchProductPage = () => {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [data, setData] = useState<SearchResult[]>([]);

  // Extract query parameters
  const location = searchParams.get("location") || "";
  const budget = searchParams.get("budget") || "";
  const property = searchParams.get("property") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://mero-space-backend-deployment.vercel.app/search-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location,
            budget,
            property,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: SearchResult[] = await response.json();
        setSearchResults(data);
        setData(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchData();
  }, [location, budget, property]);

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div>
      <div className="relative w-full h-[50vh]">
        <Image
          src="/assets/images/search-found.png"
          alt="Search Results"
          layout="fill"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="absolute inset-0 flex items-end justify-left p-8 px-16">
          <p
            className="text-white text-4xl font-bold font-sans"
            style={{ fontFamily: "Arial, Arial, sans-serif" }}
          >
            {searchResults?.length} Result(s) found!
          </p>
        </div>
      </div>

      <div>
        {searchResults?.length != 0 ? (
          <div className="w-full overflow-hidden pr-8 pt-4">
            <ul className="flex flex-wrap justify-center gap-4">
              {currentItems.map((item) => (
                <li
                  key={item.unique_id}
                  className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
                >
                  <Card className="flex flex-col min-h-[350px] overflow-hidden">
                    <div className="flex-grow">
                      <img
                        src={item.imageUrl}
                        alt={item.headline}
                        className="h-[200px] w-full object-cover"
                        style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
                      />
                    </div>
                    <CardHeader className="flex flex-col p-2">
                      <CardTitle className="truncate font-semibold pl-1">
                        {item.headline}
                      </CardTitle>
                      <CardDescription className="truncate text-gray-600 pl-1">
                        {item.description}
                      </CardDescription>
                      <div className="flex justify-between items-center pl-1">
                        <CardDescription className="truncate font-bold">
                          Location: {item.location}
                        </CardDescription>
                        <Link href={`/Unique-Product?Pid=${item.unique_id}`}>
                          <Button className="ml-2">Explore</Button>
                        </Link>
                      </div>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
            {data.length > 0 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the default anchor behavior
                          if (currentPage > 1) {
                            setCurrentPage((prev) => prev - 1);
                          }
                        }}
                        className="no-underline"
                      />
                    </PaginationItem>

                    {/* Render pagination numbers */}
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;

                      // Show ellipsis only when needed
                      if (
                        (pageNumber > 2 &&
                          currentPage > 2 &&
                          currentPage < totalPages - 1 &&
                          pageNumber === currentPage - 1) ||
                        (pageNumber < totalPages - 1 &&
                          currentPage < totalPages - 1 &&
                          pageNumber === currentPage + 1)
                      ) {
                        return null; // Skip rendering this page number
                      }

                      // Render the first two and last two pages with ellipsis in between
                      if (
                        pageNumber === 1 ||
                        pageNumber === 2 ||
                        pageNumber === totalPages - 1 ||
                        pageNumber === totalPages
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                              className="no-underline"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Render ellipsis in the middle
                      if (
                        pageNumber === currentPage - 1 ||
                        pageNumber === currentPage + 1
                      ) {
                        return null; // Skip rendering the adjacent pages to avoid duplicates
                      }

                      if (
                        (currentPage > 3 && pageNumber === 3) ||
                        (currentPage < totalPages - 2 &&
                          pageNumber === totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis className="text-blue-600" />
                          </PaginationItem>
                        );
                      }

                      return null; // Skip rendering other pages
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the default anchor behavior
                          if (currentPage < totalPages) {
                            setCurrentPage((prev) => prev + 1);
                          }
                        }}
                        className="no-underline"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        ) : (
          <>
          <p className="text-center font-bold text-3xl text-blue-500 font-sans pt-2" style={{ fontFamily: "Arial, Arial, sans-serif" }}>Recommend Results</p>
          <CommonProducts />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchProductPage;
