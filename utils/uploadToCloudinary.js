export const uploadToCloudinary = async (file) => {
    const cloudName = "dlahzfpmk";
    const preset = "Test_first_time";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return {
        url: data.secure_url,
        public_id: data.public_id,
    };
};