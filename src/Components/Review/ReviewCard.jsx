import { Rating } from "@mui/material";
import { IconButton, Button } from '@mui/material';
import "./ReviewCard.css"
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import { Padding } from "maplibre-gl";
import { editReview } from "../../Services/review";
import useAuth from "../../hooks/useAuth";
import { createReaction, getReactionsByFilter, updateReaction } from "../../Services/reaction";

// Add state management!!!
const handleEditReview = async (review_id, user_id, rating, comment, access_token) => {
    try {
        await editReview(review_id, user_id, rating, comment, access_token);
    } catch (error) {
        console.error(error);
    }
}

const handleReaction = async (updated_reaction, user_liked, user_disliked, review_id, user_id, reaction, access_token) => { // reaction: true = like, false = dislike    
    try {
        if ((user_liked && !reaction) || (user_disliked && reaction)) { // two truth cases: user previously liked and wants to dislike OR user previously disliked and wants to like
            const foundReaction = (await getReactionsByFilter({ review_id, user_id }))[0]; // find the specific reaction's id to update (indexed at 0 since service function returns array)
            await updateReaction({ id: foundReaction.id, reaction }, access_token); // update that specific reaction to the opposite react
            updated_reaction(true); // tell app to refresh reactions
            return;
        }
        await createReaction(review_id, user_id, reaction, access_token); // if user hasn't liked or dislike a given review, create a reaction
        updated_reaction(true); // tell app to refresh reactions
    } catch (error) {
        console.error(error);
    }
}

const ReviewCard = ({ review_id = -1, ratingValue = 0, description, createdAt = 0, isOwner = false, likes, dislikes, userLiked = false, userDisliked = false, setReactionUpdate }) => {
    const { auth } = useAuth();
    const user_id = auth?.user_info?.id;
    const newRating = 4; // TODO: change this
    const newComment = "new comment" //TODO: change this
    const access_token = auth?.access_token;

    return (
        <div className="review-card">
            <div className="review-header">
                <Rating
                    value={ratingValue}
                    precision={1}
                    size="large"
                    readOnly
                />
                <div className="review-recency">
                    {createdAt}
                </div>
            </div>

            <div className="review-description">
                {description}
            </div>

            <div style={{ justifyContent: isOwner ? "space-between" : "flex-end" }} className="review-buttons">
                <Button
                    className="edit-button"
                    style={{ display: isOwner ? 'block' : 'none' }}
                    onClick={() => handleEditReview( // TODO: currently will edit the review as soon as you click button --> but idealy we should be editting in a popup
                        review_id,
                        user_id,
                        newRating,
                        newComment,
                        access_token)}
                >
                    <EditIcon style={{ marginRight: "5px", marginBottom: "3px", width: "20px" }} />
                    Edit
                </Button>
                <div className="thumbs-container">
                    <div
                        className="thumbs-up-container"
                        onClick={() => handleReaction(setReactionUpdate, userLiked, userDisliked, review_id, user_id, true, access_token)}
                    >
                        <IconButton
                            sx={{ top: "7px" }}
                            className={userLiked ? "thumbs-button liked" : "thumbs-button"}
                        >
                            <ThumbUpIcon />
                        </IconButton>
                        {likes}
                    </div>

                    <div
                        className="thumbs-down-container"
                        onClick={() => handleReaction(setReactionUpdate, userLiked, userDisliked, review_id, user_id, false, access_token)}
                    >
                        <IconButton
                            sx={{ top: "7px" }}
                            className={userDisliked ? "thumbs-button disliked" : "thumbs-button"}
                        >
                            <ThumbDownIcon />
                        </IconButton>
                        {dislikes}
                    </div>
                </div>
            </div>

        </div >
    )
}

export default ReviewCard;