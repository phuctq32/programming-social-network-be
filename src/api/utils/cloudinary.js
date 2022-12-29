import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = (file, options) => {    
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
            file,
            {
                public_id: options.fileName,
                folder: options.folder
            },
            (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            }
        );
    });
}

const deleteFolder = (folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.api.delete_resources_by_prefix(folder, (err, res) => {
            if (err) {
                return reject(err);
            }
            cloudinary.v2.api.delete_folder(folder, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        });
    })
}

const path = {
    forPost: (userId, postId) => `users/${userId}/posts/${postId}`,
    forAvatar: (userId) => `users/${userId}/avatar/`
}

export { uploadImage, deleteFolder, path };