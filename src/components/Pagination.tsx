"use client"
import React from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";

/**
 * Propriétés du composant
 */
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/**
 * Système de paginantion
 * @param currentPage page courante
 * @param totalPages total de pages
 * @param onPageChange fonction de gestion de changement de page
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }:PaginationProps) => {

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Fonction pour passer à la page précédente
    const prevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <nav className={"py-8 flex justify-center"}>
            <ul className={"inline-flex -space-x-px text-sm"}>
                <li>
                    <button
                        onClick={prevPage} disabled={currentPage <= 1}
                        className={"flex items-center rounded-l-lg justify-center px-2 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:text-gray-400 disabled:bg-gray-100"}
                    >
                        <ChevronLeftIcon className="size-5"/>
                    </button>
                </li>
                {[...Array(totalPages).keys()].map(i => (
                    <li key={i}>
                        <button
                            disabled={i+1 === currentPage}
                            onClick={() => onPageChange(i + 1)}
                            className="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:border-indigo-600 disabled:text-white disabled:bg-indigo-600"
                        >
                            {i+1}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={nextPage}
                        disabled={currentPage >= totalPages}
                        className={"flex items-center justify-center px-2  rounded-r-lg h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:text-gray-400 disabled:bg-gray-100"}
                    >
                        <ChevronRightIcon className="size-5"/>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
