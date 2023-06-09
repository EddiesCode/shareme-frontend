import { useState, useEffect } from "react"
import { MdDownloadForOffline } from "react-icons/md"
import { Link, useParams } from "react-router-dom"
import { client, urlFor } from "../client"
import MasonryLayout from "./MasonryLayout"
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data"
import Spinner from "./Spinner"

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState("")
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()

  const addComment = () => {
    if (comment) {
      setAddingComment(true)

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: crypto.randomUUID(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails()

          setComment("")
          setAddingComment(false)
        })
    }
  }

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0])

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0])

          client.fetch(query).then((res) => setPins(res))
        }
      })
    }
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])

  if (!pinDetail) return <Spinner message="Loading pin..." />

  return (
    <>
      <div
        className="flex flex-col m-auto bg-white xl-flex"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex items-center justify-center flex-initial md:items-start">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-b-lg rounded-t-3xl"
            alt="user-post"
          ></img>
        </div>
        <div className="flex-1 w-full p-5 xl:min-620">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={`${pinDetail?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:opacity-100 hover:shadow-md"
              >
                <MdDownloadForOffline />
              </a>{" "}
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="mt-3 text-4xl font-bold break-words">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex items-center gap-2 mt-5 bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-hover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitilize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="overflow-y-auto max-h-370">
            {pinDetail?.comments?.map((comment, index) => (
              <div className="flex items-center gap-2 mt-5 bg-white rounded-lg">
                <img
                  src={comment?.postedBy?.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment?.postedBy?.userName}</p>
                  <p>{comment?.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={pinDetail.postedBy?.image}
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 p-2 border-2 border-gray-100 outline-none rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-center">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  )
}

export default PinDetail
