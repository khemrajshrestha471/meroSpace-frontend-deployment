import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type UploadedAllUser = {
  _id: string;
  username: string;
  email: string;
  p_number: string;
  password: string;
  register_date_time: string;
};

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

  const SeekerUser = () => {
  const [dataSeeker, setDataSeeker] = useState<UploadedAllUser[]>([]);
  const [loadingSeeker, setLoadingSeeker] = useState(true);
  const [uploadsSeekerCount, setUploadsSeekerCount] = useState<
    Record<string, number>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDataSeeker = async () => {
      try {
        const response = await fetch("https://mero-space-backend-deployment.vercel.app/get-all-seeker");
        const result = await response.json();
        setDataSeeker(result);
        setLoadingSeeker(false);
        // Fetch uploads count for each uploader
        result.forEach(async (seeker: UploadedAllUser) => {
          const countResponse = await fetch(
            `https://mero-space-backend-deployment.vercel.app/uploaded-requirement-data/${seeker._id}`
          );
          const data = await countResponse.json();
          setUploadsSeekerCount((prev) => ({
            ...prev,
            [seeker._id]: data.length,
          }));
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingSeeker(false);
      }
    };

    fetchDataSeeker();
  }, []);

  if (loadingSeeker) {
    return <p>Loading...</p>;
  }

  const FailedDeleteSeeker = () => {
    toast.error("Failed to delete seeker. Please try again.", {
      draggable: true,
      theme: "colored",
    });
  };

  const deleteThisSeeker = async (_id: string) => {
    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/delete-unique-seeker/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        await response.json();
        FailedDeleteSeeker();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataSeeker.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(dataSeeker.length / itemsPerPage);

  return (
    <>
      <div>
        <p className="text-center text-blue-500 text-3xl font-semibold">
          Seeker Information
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-center">SN</TableHead>
              <TableHead className="font-bold text-center">Email</TableHead>
              <TableHead className="font-bold text-center">
                Total Requirements Uploaded
              </TableHead>
              <TableHead className="font-bold text-center">Joined At</TableHead>
              <TableHead className="font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((index, i) => (
              <TableRow key={index._id}>
                <TableCell className="text-center">
                  {indexOfFirstItem + i + 1}
                </TableCell>
                <TableCell className="text-center">{index.email}</TableCell>
                <TableCell className="text-center">
                  {uploadsSeekerCount[index._id] || 0}
                </TableCell>
                <TableCell className="text-center">
                  {index.register_date_time}
                </TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <TableCell className="text-red-500">Delete</TableCell>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Really want to delete this Uploader?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undo and will permanently delete
                        this uploader from the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => deleteThisSeeker(index._id)}
                      >
                        Continue
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ToastContainer />
      </div>
      {dataSeeker.length > 0 && (
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
    </>
  );
};

export default SeekerUser;
