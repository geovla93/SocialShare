import axios from "axios";

const uploadPic = async (media) => {
	try {
		const form = new FormData();
		form.append("file", media);
		form.append("upload_preset", "socialmedia");
		form.append("cloud_name", "geovla");

		const res = await axios({
			url: process.env.CLOUDINARY_URL,
			method: "POST",
			data: form,
		});

		return res.data.url;
	} catch (error) {
		alert("Error uploading image", error);
		return;
	}
};

export default uploadPic;
