import { useState, useEffect } from "react"

import MasonryLayout from "./MasonryLayout"
import { client } from "../client"
import { feedQuery, searchQuery } from "../utils/data"
import Spinner from "./Spinner"

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)
  return <div>Search</div>
}

export default Search
