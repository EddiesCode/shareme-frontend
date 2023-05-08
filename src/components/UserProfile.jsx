import { useState, useEffect } from "react"
import { AiOutlineLogout } from "react-icons/ai"
import { useParams, useNavigate } from "react-router-dom"
import { googleLogout } from "@react-oauth/google"

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data"
import { client } from "../client"
import MasonryLayout from "./MasonryLayout"
import Spinner from "./Spinner"

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState("Created")
  const [activeBtn, setActiveBtn] = useState("created")
  const navigate = useNavigate()
  const { userId } = useParams()

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query).then((data) => {
      setUser(data[0])
    })
  }, [userId])

  if (!user) {
    return <Spinner message="Loading user profile..." />
  }

  return <div>UserProfile</div>
}

export default UserProfile
