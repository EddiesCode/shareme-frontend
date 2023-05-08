import { urlFor, client } from "../client"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdDownloadForOffline } from "react-icons/md"
import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { fetchUser } from "../utils/fetchUser"

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const navigate = useNavigate()
  const user = fetchUser()

  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.sub
  )?.length

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true)
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: crypto.randomUUID(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload()
          setSavingPost(false)
        })
    }
  }

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload()
    })
  }

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative w-auto overflow-hidden transition-all duration-500 ease-in-out rounded-lg cursor-zoom-in hover:shadow-lg"
      >
        <img
          className="w-full rounded-lg"
          alt="user-post"
          src={urlFor(image).width(250).url()}
        />
        {postHovered && (
          <div
            className="absolute top-0 z-50 flex flex-col justify-between w-full h-full p-1 pt-2 pb-2 pr-2"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:opacity-100 hover:shadow-md"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="px-5 py-1 text-base font-bold text-white bg-red-500 opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md outlined-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    savePin(_id)
                  }}
                  type="button"
                  className="px-5 py-1 text-base font-bold text-white bg-red-500 opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md outlined-none"
                >
                  {savingPost ? "saving" : "Save"}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between w-full gap-2">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 pl-4 pr-4 font-bold text-black bg-white rounded-full opacity-70 hover:100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(12, 22)
                    : destination.slice(12)}
                </a>
              )}
              {postedBy?._id === user?.sub && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePin(_id)
                  }}
                  className="p-2 text-base font-bold bg-white text-dark opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md outlined-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex items-center gap-2 mt-2"
      >
        <img
          className="w-8 h-8 rounded-full object-hover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitilize">{postedBy?.userName}</p>
      </Link>
    </div>
  )
}

export default Pin
