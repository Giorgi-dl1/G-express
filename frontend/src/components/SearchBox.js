import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };
  return (
    <form onSubmit={submitHandler}>
      <input
        style={{ outline: "none", border: "none", padding: ".21rem" }}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search item"
      />
      <button type="submit" className="button-search">
        Search
      </button>
    </form>
  );
}
