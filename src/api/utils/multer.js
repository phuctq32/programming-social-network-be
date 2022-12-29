import multer from 'multer';

export default multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match('image/png|image/jpg|image/jpeg')) {
            cb(new Error('File does not support.'), false);
        }

        cb(null, true);
    } 
});