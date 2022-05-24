import moment from "moment";
import Moment from "react-moment";

export default function calculateDate(createdAt) {
	const today = moment(Date.now());
	const postDate = moment(createdAt);
	const diffInHours = today.diff(postDate, "hours");

	if (diffInHours >= 48) {
		return <Moment format="DD/MM/YYY hh:mm A">{createdAt}</Moment>;
	} else if (diffInHours >= 24) {
		return (
			<>
				Yesterday <Moment format="hh:mm A">{createdAt}</Moment>
			</>
		);
	} else {
		return (
			<>
				Today <Moment format="hh:mm A">{createdAt}</Moment>
			</>
		);
	}
}
