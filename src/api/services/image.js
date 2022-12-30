import * as imageHandler from '../utils/imageHandler.js';

const uploadMultipleFiles = async (files) => {
    if (files) {
        return [];
    }
    
    try {
        const uploadedImages = await Promise.all(
            files.map(async (file, index) => {
                const uploadedImage = await imageHandler.uploadImage(file.path, {
                    fileName: index.toString(),
                    folder: imageHandler.path.forPost(req.userId.toString(), newPost._id.toString()),
                });
    
                return uploadedImage.url;
            }
        ));

        return uploadedImages;
    } catch (err) {
        throw err;
    }
}

export {
    uploadMultipleFiles
};