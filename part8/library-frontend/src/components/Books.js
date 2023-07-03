import React, { useState, useEffect } from "react";
import { ALL_BOOKS, ALL_GENRES, ALL_BOOKS_FILTERED } from "../queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import Select from "react-select";

const Books = (props) => {
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const { loading: booksLoading, data: booksData } = useQuery(ALL_BOOKS);
  const { loading: genresLoading, data: genresData } = useQuery(ALL_GENRES);
  const [
    getFilteredBooks,
    { loading: filteredBooksLoading, data: filteredBooksData },
  ] = useLazyQuery(ALL_BOOKS_FILTERED);

  useEffect(() => {
    if (selectedAuthors.length > 0 || selectedGenres.length > 0) {
      getFilteredBooks({
        variables: { authors: selectedAuthors, genres: selectedGenres },
      });
    }
  }, [selectedAuthors, selectedGenres, getFilteredBooks]);

  useEffect(() => {
    if (filteredBooksData) {
      setFilteredBooks(filteredBooksData.allBooksFiltered);
    }
  }, [filteredBooksData]);

  const handleAuthorsChange = (selectedOption) => {
    const authors = selectedOption
      ? selectedOption.map((option) => option.value)
      : [];
    setSelectedAuthors(authors);
  };

  const handleGenresChange = (selectedOption) => {
    const genres = selectedOption
      ? selectedOption.map((option) => option.value)
      : [];
    setSelectedGenres(genres);
  };

  if (booksLoading || genresLoading || filteredBooksLoading) {
    return null;
  }

  const books = filteredBooksData ? filteredBooks : booksData.allBooks;
  const genres = genresData.allGenres;
  console.log("books", books);
  console.log("filteredBooksData", filteredBooksData);

  if (!props.show) {
    return null;
  }

  const authors = booksData ? booksData.allBooks.map((b) => b.author.name) : [];
  const uniqueAuthors = [...new Set(authors)];
  console.log("authors", authors);

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Filter books by author</h3>
        <Select
          isMulti
          name="filter-author"
          options={uniqueAuthors.map((a) => ({ value: a, label: a }))}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleAuthorsChange}
        />
      </div>
      <div>
        <h3>Filter books by genre</h3>
        <Select
          isMulti
          name="filter-genre"
          options={genres.map((g) => ({ value: g, label: g }))}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleGenresChange}
        />
      </div>
    </div>
  );
};

export default Books;
