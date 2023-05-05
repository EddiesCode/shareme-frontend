import { urlFor } from "../client"

const Pin = ({ pin: { postedBy, image, _id, destination } }) => {
  return (
    <div>
      <img
        className="w-full rounded-lg"
        alt="user-post"
        src={urlFor(image).width(250).url()}
      />
    </div>
  )
}

export default Pin
