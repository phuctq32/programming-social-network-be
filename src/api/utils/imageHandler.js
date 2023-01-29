import cloudinary from '../../configs/cloudinary.js';

const upload = (file, options) => {    
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
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

const uploadMultiple = async (userId, postId, files) => {
    if (Array.from(files).length === 0) {
        return [];
    }
    
    try {
        const uploadedImages = await Promise.all(
            files.map(async (file, index) => {
                const uploadedImage = await upload(file.path, {
                    fileName: index.toString(),
                    folder: path.forPost(userId.toString(), postId.toString()),
                });
    
                return uploadedImage.url;
            }
        ));

        return uploadedImages;
    } catch (err) {
        throw err;
    }
}

const deleteFolder = (folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.api.delete_resources_by_prefix(folder, (err, res) => {
            if (err) {
                return reject(err);
            }
            cloudinary.api.delete_folder(folder, (err, res) => {
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

export { upload, deleteFolder, uploadMultiple, path };