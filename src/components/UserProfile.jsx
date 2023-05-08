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

const randomImage =
  "https://source.unsplash.com/random/1600x900/?nature,photography,technology"

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"

const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"

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

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId)

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data)
      })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId)

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data)
      })
    }
  }, [text, userId])

  const logout = () => {
    googleLogout()
    localStorage.clear()

    navigate("/login")
  }
  if (!user) {
    return <Spinner message="Loading user profile..." />
  }

  return (
    <div className="relative items-center justify-center h-full pb-2">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col items-center justify-center">
            <img
              src={randomImage}
              className="object-cover w-full shadow-lg h-370 2xl:h-510"
              alt="banner-pic"
            />
            <img
              className="object-cover w-20 h-20 -mt-10 rounded-full shadow-xl"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="mt-3 text-3xl font-bold text-center">
              {user.userName}
            </h1>
            <div className="absolute top-0 right-0 p-2 z-1">
              {userId === user._id && (
                <button
                  type="button"
                  className="p-2 rounded-full shadow-md outline-none cursor-pointer bg-w"
                  onClick={logout}
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn("created")
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn("saved")
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full mt-2 text-xl font-bold">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
