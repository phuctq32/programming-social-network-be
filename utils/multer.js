import multer from 'multer';

export default multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/png||jpg||jpeg||gif$i/)) {
            cb(new Error('File does not support.'), false);
        }

        cb(null, true);
    } 
});